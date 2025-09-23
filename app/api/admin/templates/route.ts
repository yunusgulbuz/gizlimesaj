import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { apiRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = apiRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

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

    // Check if slug already exists
    const { data: existingTemplate } = await supabase
      .from('templates')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingTemplate) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Create template
    const { data: template, error } = await supabase
      .from('templates')
      .insert({
        title,
        slug,
        audience,
        description: description || null,
        preview_url: preview_url || null,
        bg_audio_url: bg_audio_url || null,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      return NextResponse.json(
        { error: 'Failed to create template' },
        { status: 500 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error in template creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = apiRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const audience = searchParams.get('audience');
    const status = searchParams.get('status');

    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from('templates')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (audience && audience !== 'all') {
      query = query.eq('audience', audience);
    }

    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    // Pagination
    const offset = (page - 1) * limit;
    const { data: templates, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching templates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch templates' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      templates,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error('Error in template fetching:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}