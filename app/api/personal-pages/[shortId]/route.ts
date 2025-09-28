import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isValidShortId } from '@/lib/shortid';
import { pageViewRateLimit } from '@/lib/rateLimit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = pageViewRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { shortId } = await params;

    // Validate short ID format
    if (!isValidShortId(shortId)) {
      return NextResponse.json(
        { error: 'Invalid short ID format' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get personal page with template info using direct query since we need additional fields
    const { data: personalPage, error } = await supabase
      .from('personal_pages')
      .select(`
        id,
        short_id,
        template_id,
        recipient_name,
        sender_name,
        message,
        start_at,
        expires_at,
        is_active,
        special_date,
        templates!inner (
          title,
          slug,
          audience,
          preview_url,
          bg_audio_url
        )
      `)
      .eq('short_id', shortId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (!personalPage) {
      return NextResponse.json(
        { error: 'Personal page not found' },
        { status: 404 }
      );
    }

    const page = personalPage;

    // Check if page is expired
    const now = new Date();
    const expiresAt = new Date(page.expires_at);
    
    if (now > expiresAt) {
      // Update page status to inactive if expired
      await supabase
        .from('personal_pages')
        .update({ is_active: false })
        .eq('short_id', shortId);

      return NextResponse.json(
        { error: 'Personal page has expired' },
        { status: 410 }
      );
    }

    // Return the personal page data
    const template = page.templates && page.templates.length > 0 ? page.templates[0] : null;
    return NextResponse.json({
      id: page.id,
      short_id: page.short_id,
      recipient_name: page.recipient_name,
      sender_name: page.sender_name,
      message: page.message,
      template_title: template?.title || 'Gizli Mesaj',
      template_slug: template?.slug || 'default',
      template_audience: template?.audience || [],
      template_preview_url: template?.preview_url || null,
      template_bg_audio_url: template?.bg_audio_url || null,
      expires_at: page.expires_at,
      special_date: page.special_date,
      is_active: page.is_active
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}