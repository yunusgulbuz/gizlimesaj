import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
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

    // Get personal page with template info using the stored function
    const { data: personalPage, error } = await supabase
      .rpc('get_page_by_short_id', { page_short_id: shortId });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (!personalPage || personalPage.length === 0) {
      return NextResponse.json(
        { error: 'Personal page not found' },
        { status: 404 }
      );
    }

    const page = personalPage[0];

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
    return NextResponse.json({
      id: page.id,
      short_id: page.short_id,
      recipient_name: page.recipient_name,
      sender_name: page.sender_name,
      message: page.message,
      template_title: page.template_title,
      template_preview_url: page.template_preview_url,
      template_bg_audio_url: page.template_bg_audio_url,
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