import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isValidShortId } from '@/lib/shortid';
import { apiRateLimit } from '@/lib/rateLimit';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
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

    const { shortId } = await params;

    // Validate short ID format
    if (!isValidShortId(shortId)) {
      return NextResponse.json(
        { error: 'Invalid short ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { event_type, user_agent, ip_address } = body;

    // Validate required fields
    if (!event_type) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // First, verify the personal page exists and is active
    const { data: personalPage, error: pageError } = await supabase
      .from('personal_pages')
      .select('id, is_active, expires_at')
      .eq('short_id', shortId)
      .single();

    if (pageError || !personalPage) {
      return NextResponse.json(
        { error: 'Personal page not found' },
        { status: 404 }
      );
    }

    if (!personalPage.is_active) {
      return NextResponse.json(
        { error: 'Personal page is not active' },
        { status: 410 }
      );
    }

    // Check if page is expired
    const now = new Date();
    const expiresAt = new Date(personalPage.expires_at);
    
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Personal page has expired' },
        { status: 410 }
      );
    }

    // Insert analytics record
    const { error: analyticsError } = await supabase
      .from('page_analytics')
      .insert({
        personal_page_id: personalPage.id,
        event_type,
        user_agent: user_agent || null,
        ip_address: ip_address || null,
        created_at: new Date().toISOString()
      });

    if (analyticsError) {
      console.error('Analytics insert error:', analyticsError);
      return NextResponse.json(
        { error: 'Failed to record analytics' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}