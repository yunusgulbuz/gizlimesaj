import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { generatePrompt, generatePromptWithBase, extractColorScheme } from '@/lib/ai-prompts';
import { sanitizeHTML, validateHTML, extractEditableFields } from '@/lib/sanitize-html';
import { getBaseTemplate } from '@/lib/ai-template-bases';
import { canUseAI, useAICredit, getUserCredits } from '@/lib/credit-helpers';

// Increase API route timeout to 5 minutes for AI generation
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function generateSlug(userId: string, title: string): string {
  // Get first 8 characters of user ID
  const userPrefix = userId.slice(0, 8);

  // Slugify title
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .slice(0, 30); // Limit length

  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36);

  return `ai-${userPrefix}-${titleSlug}-${timestamp}`;
}

// REMOVED: Old rate limit function - now using subscription-based limits

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to generate AI templates.' },
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
    const { title, category, userPrompt, templateBaseId } = body;

    // Validate inputs
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Title is required and must be at least 3 characters long.' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string') {
      return NextResponse.json(
        { error: 'Category is required.' },
        { status: 400 }
      );
    }

    const validCategories = ['teen', 'adult', 'classic', 'fun', 'elegant', 'romantic', 'birthday', 'apology', 'thank-you', 'celebration'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category selected.' },
        { status: 400 }
      );
    }

    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length < 10) {
      return NextResponse.json(
        { error: 'Prompt is required and must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    if (userPrompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Maximum 1000 characters.' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI template generation is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Generate the AI prompt (with or without base template)
    let fullPrompt: string;

    if (templateBaseId) {
      // Use base template approach
      const baseTemplate = getBaseTemplate(templateBaseId);

      if (!baseTemplate) {
        return NextResponse.json(
          { error: 'Selected template style not found.' },
          { status: 400 }
        );
      }

      console.log('Using base template:', baseTemplate.name);
      fullPrompt = generatePromptWithBase(baseTemplate.structure, category, userPrompt);
    } else {
      // Fallback to old method (generate from scratch)
      fullPrompt = generatePrompt(category, userPrompt);
    }

    // Call OpenAI API
    console.log('Calling OpenAI API for user:', user.id);
    const response = await openai.responses.create({
      model: 'gpt-5-codex',
      input: fullPrompt,
    });

    const generatedHTML = response.output_text;

    if (!generatedHTML) {
      return NextResponse.json(
        { error: 'Failed to generate template. Please try again.' },
        { status: 500 }
      );
    }

    // Validate HTML
    const validation = validateHTML(generatedHTML);
    if (!validation.isValid) {
      console.error('HTML validation failed:', validation.error);
      return NextResponse.json(
        { error: `Generated template validation failed: ${validation.error}` },
        { status: 500 }
      );
    }

    // Sanitize HTML
    const sanitizedHTML = sanitizeHTML(generatedHTML);

    // Extract color scheme and editable fields
    const colorScheme = extractColorScheme(sanitizedHTML);
    const editableFields = extractEditableFields(sanitizedHTML);

    // Generate unique slug
    const slug = generateSlug(user.id, title);

    // Save to database
    const { data: template, error: dbError } = await supabase
      .from('ai_generated_templates')
      .insert({
        user_id: user.id,
        slug,
        title: title.trim(),
        category,
        user_prompt: userPrompt.trim(),
        template_code: sanitizedHTML,
        status: 'draft', // Mark as draft (takes up a slot)
        metadata: {
          colorScheme,
          editableFields,
          templateBaseId: templateBaseId || null, // Store which base was used
          recipientName: 'Sevgilim',
          mainMessage: 'Bu özel mesaj senin için yapay zeka tarafından oluşturuldu.',
          footerMessage: 'Seni düşünen birinden ❤️',
        },
        is_active: true,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save template. Please try again.' },
        { status: 500 }
      );
    }

    // Use 1 AI credit
    const creditResult = await useAICredit(user.id, template.id, 'AI template oluşturma');

    if (!creditResult.success) {
      console.error('Failed to deduct credit after generation');
    }

    // Return success response
    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        slug: template.slug,
        title: template.title,
        category: template.category,
      },
      remainingCredits: creditResult.remainingCredits,
      message: 'AI template generated successfully!',
    });

  } catch (error: any) {
    console.error('AI template generation error:', error);

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

// GET endpoint to check user's remaining AI credits
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's credit balance
    const credits = await getUserCredits(user.id);

    return NextResponse.json({
      totalCredits: credits.totalCredits,
      usedCredits: credits.usedCredits,
      remainingCredits: credits.remainingCredits,
      canGenerate: credits.canUseAI,
    });

  } catch (error) {
    console.error('Error in GET /api/ai-templates/generate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
