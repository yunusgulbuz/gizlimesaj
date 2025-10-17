import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isValidShortId } from '@/lib/shortid';
import { pageViewRateLimit } from '@/lib/rateLimit';

function pickDesignStyle(slug: string): 'modern' | 'classic' | 'minimalist' | 'eglenceli' {
  if (slug.includes('classic')) return 'classic';
  if (slug.includes('minimal')) return 'minimalist';
  if (slug.includes('fun') || slug.includes('teen') || slug.includes('eglenceli')) return 'eglenceli';
  return 'modern';
}

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

    // Check if this is a request from success page (owner verification needed)
    const { searchParams } = new URL(request.url);
    const checkOwner = searchParams.get('checkOwner') === 'true';

    // Validate short ID format
    if (!isValidShortId(shortId)) {
      return NextResponse.json(
        { error: 'Invalid short ID format' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get personal page with template info and order data using proper joins
    const { data: personalPage, error } = await supabase
      .from('personal_pages')
      .select(`
        *,
        templates (
          title,
          slug,
          audience,
          preview_url,
          bg_audio_url
        ),
        orders!inner (
          user_id,
          text_fields,
          design_style,
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

    // If checkOwner is true, verify that the current user is the owner
    if (checkOwner) {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized - Authentication required' },
          { status: 401 }
        );
      }

      const orderUserId = personalPage.orders?.user_id;
      if (!orderUserId || orderUserId !== user.id) {
        return NextResponse.json(
          { error: 'Forbidden - You do not have permission to view this page' },
          { status: 403 }
        );
      }
    }

    const page = personalPage;

    // Check if page is expired
    const now = new Date();
    const expiresAt = new Date(personalPage.expires_at);
    
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
    const template = personalPage.templates;
    const order = personalPage.orders;
    const templateSlug = template?.slug || 'default';
    
    return NextResponse.json({
      id: personalPage.id,
      short_id: personalPage.short_id,
      recipient_name: personalPage.recipient_name,
      sender_name: personalPage.sender_name,
      message: personalPage.message,
      template_title: template?.title || 'Gizli Mesaj',
      template_slug: templateSlug,
      template_audience: template?.audience || [],
      template_preview_url: template?.preview_url || null,
      template_bg_audio_url: order?.bg_audio_url || personalPage.bg_audio_url || template?.bg_audio_url || null,
      design_style: order?.design_style || personalPage.design_style || pickDesignStyle(templateSlug),
      text_fields: {
        ...personalPage.text_fields,
        ...order?.text_fields
      },
      share_preview_meta: personalPage.share_preview_meta || null,
      expires_at: personalPage.expires_at,
      special_date: personalPage.special_date,
      is_active: personalPage.is_active
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}