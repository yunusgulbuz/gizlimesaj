import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { sanitizeHTML, validateHTML, extractEditableFields } from '@/lib/sanitize-html';
import { extractColorScheme } from '@/lib/ai-prompts';
import { canUseAI, useAICredit } from '@/lib/credit-helpers';

// Increase API route timeout to 5 minutes for AI refinement
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to refine AI templates.' },
        { status: 401 }
      );
    }

    // Check AI credit balance
    const creditCheck = await canUseAI(user.id);
    if (!creditCheck.allowed) {
      return NextResponse.json(
        { error: creditCheck.reason, needCredits: true },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { templateId, refinePrompt } = body;

    // Validate inputs
    if (!templateId || typeof templateId !== 'string') {
      return NextResponse.json(
        { error: 'Template ID is required.' },
        { status: 400 }
      );
    }

    if (!refinePrompt || typeof refinePrompt !== 'string' || refinePrompt.trim().length < 5) {
      return NextResponse.json(
        { error: 'Refine prompt is required and must be at least 5 characters long.' },
        { status: 400 }
      );
    }

    if (refinePrompt.length > 500) {
      return NextResponse.json(
        { error: 'Refine prompt is too long. Maximum 500 characters.' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI template refinement is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Get the existing template (must belong to user)
    const { data: template, error: fetchError } = await supabase
      .from('ai_generated_templates')
      .select('*')
      .eq('id', templateId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !template) {
      return NextResponse.json(
        { error: 'Template not found or you do not have permission to edit it.' },
        { status: 404 }
      );
    }

    // Build refinement prompt with flexible approach
    const refinementPrompt = `You are refining an existing premium HTML template. The user wants to make changes to improve or customize the design. You have creative freedom to make significant changes based on their request.

<current-template>
${template.template_code}
</current-template>

User's refinement request:
${refinePrompt.trim()}

REFINEMENT APPROACH - Creative Freedom with Quality Standards:

1. **UNDERSTAND THE REQUEST**: Analyze what the user wants (color change, layout adjustment, animation change, complete redesign, etc.)
2. **QUALITY STANDARDS**: Maintain high-quality animations, modern effects, and responsive design
3. **CREATIVE FREEDOM**: Feel free to make significant changes to layout, colors, animations, and visual elements
4. **USER'S VISION**: Prioritize the user's specific request over preserving the original design

WHAT YOU CAN FREELY MODIFY:
✅ **Layout & Structure**: Change element positioning, adjust grid/flex layouts, add/remove sections
✅ **Colors & Gradients**: Completely change color palettes and gradient schemes
✅ **Fonts & Typography**: Modify font families, sizes, weights, line heights
✅ **Animations**: Change animation types, speeds, and effects (floating→bouncing, fade→slide, etc.)
✅ **Decorative Elements**: Add/modify/replace decorative elements (petals→stars, hearts→confetti, etc.)
✅ **Background**: Change background patterns, gradients, or effects
✅ **Visual Effects**: Adjust blur, shadows, opacity, borders
✅ **Element Sizes**: Change spacing, padding, margins, element dimensions

WHAT YOU MUST KEEP:
🔒 **data-editable attributes**: Preserve all data-editable attributes on text content
🔒 **{{CREATOR_NAME}} placeholder**: Keep the creator name element with data-creator-name attribute
   IMPORTANT: Creator name element MUST be:
   <p class="..." data-creator-name>Hazırlayan: {{CREATOR_NAME}}</p>
   DO NOT add data-editable to this element! It should remain non-editable.
🔒 **Responsive design**: Maintain mobile-first responsive design
🔒 **High quality**: Keep animations smooth and design professional
🔒 **Content**: Don't change the actual text content unless specifically requested

CRITICAL SECURITY RULES:
🚫 **NO JavaScript**: NEVER use event handlers (onClick, onLoad, onMouseOver, etc.) or inline JavaScript
🚫 **NO Script Tags**: Never include <script> tags or javascript: protocol
✅ **CSS Animations ONLY**: Use ONLY CSS animations (Tailwind animate-bounce, animate-pulse, animate-spin, @keyframes, transitions)
✅ **Static HTML**: Generate pure HTML with Tailwind CSS classes only

EXAMPLES OF REFINEMENT REQUESTS:
- "Make it more colorful" → Change color palette to vibrant colors, add more gradient effects
- "Change animation to bouncing" → Replace current animations with bounce effects
- "Make it minimalist" → Simplify layout, remove decorative elements, use neutral colors
- "Add stars instead of hearts" → Replace heart elements with star shapes and animations
- "Dark theme" → Change to dark background with light text
- "More spacing" → Increase padding and margins throughout

IMPORTANT: If the user's request is substantial (like "completely redesign" or "change theme"), feel free to make major changes while keeping the quality high and preserving the core mechanics (data-editable, responsive design).

RETURN ONLY THE MODIFIED HTML CODE - no explanations, no markdown code blocks, just the raw HTML.`;

    // Call OpenAI API
    console.log('Calling OpenAI API to refine template for user:', user.id);
    const response = await openai.responses.create({
      model: 'gpt-5-codex',
      input: refinementPrompt,
    });

    const generatedHTML = response.output_text;

    if (!generatedHTML) {
      return NextResponse.json(
        { error: 'Failed to refine template. Please try again.' },
        { status: 500 }
      );
    }

    // Validate HTML
    const validation = validateHTML(generatedHTML);
    if (!validation.isValid) {
      console.error('HTML validation failed:', validation.error);
      return NextResponse.json(
        { error: `Refined template validation failed: ${validation.error}` },
        { status: 500 }
      );
    }

    // Sanitize HTML
    const sanitizedHTML = sanitizeHTML(generatedHTML);

    // Extract color scheme and editable fields
    const colorScheme = extractColorScheme(sanitizedHTML);
    const editableFields = extractEditableFields(sanitizedHTML);

    // Update the template in database
    const { data: updatedTemplate, error: updateError } = await supabase
      .from('ai_generated_templates')
      .update({
        template_code: sanitizedHTML,
        metadata: {
          ...template.metadata,
          colorScheme,
          editableFields,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', templateId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Database error:', updateError);
      return NextResponse.json(
        { error: 'Failed to save refined template. Please try again.' },
        { status: 500 }
      );
    }

    // Use 1 AI credit
    const creditResult = await useAICredit(user.id, updatedTemplate.id, 'AI template düzenleme');

    if (!creditResult.success) {
      console.error('Failed to deduct credit after refinement');
    }

    // Return success response
    return NextResponse.json({
      success: true,
      template: {
        id: updatedTemplate.id,
        slug: updatedTemplate.slug,
        title: updatedTemplate.title,
        template_code: updatedTemplate.template_code,
        metadata: updatedTemplate.metadata,
      },
      remainingCredits: creditResult.remainingCredits,
      message: 'Template refined successfully!',
    });

  } catch (error: any) {
    console.error('AI template refinement error:', error);

    // Handle OpenAI specific errors
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'AI service is currently busy. Please try again in a moment.' },
        { status: 429 }
      );
    }

    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'AI service authentication failed. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
