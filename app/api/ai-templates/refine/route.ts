import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { sanitizeHTML, validateHTML, extractEditableFields } from '@/lib/sanitize-html';
import { extractColorScheme } from '@/lib/ai-prompts';

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

    // Build refinement prompt
    const refinementPrompt = `You are refining an existing HTML template. Here is the current template:

<current-template>
${template.template_code}
</current-template>

User's refinement request:
${refinePrompt.trim()}

Please modify the template according to the user's request. Keep the same overall structure and editable fields (data-editable attributes). Only change what was specifically requested.

IMPORTANT REQUIREMENTS:
1. Use ONLY HTML and TailwindCSS classes - NO external CSS files or <style> tags
2. Keep all existing data-editable attributes
3. Maintain the same structure and editable fields
4. Apply only the specific changes requested
5. The template must work in a div container (not a full page)
6. Include the COLOR_SCHEME JSON comment at the end

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
