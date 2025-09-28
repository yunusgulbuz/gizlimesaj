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
    const { event_type, user_agent, ip_address, metadata } = body;

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
    const insertData = {
      personal_page_id: personalPage.id,
      event_type,
      user_agent: user_agent || null,
      ip_address: ip_address || null,
      event_data: metadata || null,
      created_at: new Date().toISOString()
    };
    
    console.log('Inserting analytics data:', insertData);
    
    const { error: analyticsError } = await supabase
      .from('page_analytics')
      .insert(insertData);

    if (analyticsError) {
      console.error('Analytics insert error:', analyticsError);
      console.error('Error details:', JSON.stringify(analyticsError, null, 2));
      return NextResponse.json(
        { error: 'Failed to record analytics', details: analyticsError.message },
        { status: 500 }
      );
    }

    // If this is a button click event, send notification email to the buyer
    if (event_type === 'button_click' && metadata?.buttonType) {
      try {
        // Get order and buyer information
        const { data: orderData, error: orderError } = await supabase
          .from('personal_pages')
          .select(`
            order_id,
            recipient_name,
            sender_name,
            orders!inner(buyer_email, templates(title))
          `)
          .eq('id', personalPage.id)
          .single();

        if (!orderError && orderData?.orders && Array.isArray(orderData.orders) && orderData.orders.length > 0) {
          const order = orderData.orders[0];
          const personalPageUrl = `${process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000'}/m/${shortId}`;
    
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000'}/api/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: order.buyer_email,
              type: 'button-click-notification',
              data: {
                recipientName: orderData.recipient_name,
                senderName: orderData.sender_name,
                buttonType: metadata.buttonType,
                templateTitle: (order.templates && Array.isArray(order.templates) && order.templates.length > 0) 
                  ? order.templates[0].title 
                  : 'Gizli Mesaj',
                personalPageUrl: personalPageUrl,
                clickedAt: new Date().toISOString()
              }
            })
          });

          if (!emailResponse.ok) {
            console.error('Failed to send button click notification email');
          }
        }
      } catch (emailError) {
        console.error('Error sending button click notification:', emailError);
      }
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