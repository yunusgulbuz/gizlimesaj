import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { apiRateLimit } from '@/lib/rateLimit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = apiRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = apiRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      slug,
      audience,
      description,
      preview_url,
      bg_audio_url,
      is_active
    } = body;

    // Validate required fields
    if (!title || !slug || !audience) {
      return NextResponse.json(
        { error: 'Title, slug, and audience are required' },
        { status: 400 }
      );
    }

    // Validate audience
    const validAudiences = ['teen', 'adult', 'classic', 'fun', 'elegant'];
    if (!validAudiences.includes(audience)) {
      return NextResponse.json(
        { error: 'Invalid audience' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Check if slug already exists for another template
    const { data: existingTemplate } = await supabase
      .from('templates')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single();

    if (existingTemplate) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Update template
    const { data: template, error } = await supabase
      .from('templates')
      .update({
        title,
        slug,
        audience,
        description: description || null,
        preview_url: preview_url || null,
        bg_audio_url: bg_audio_url || null,
        is_active: is_active !== undefined ? is_active : true
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating template:', error);
      return NextResponse.json(
        { error: 'Failed to update template' },
        { status: 500 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error in template update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = apiRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Instead of deleting, we'll deactivate the template
    const { error } = await supabase
      .from('templates')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting template:', error);
      return NextResponse.json(
        { error: 'Failed to delete template' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in template deletion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
