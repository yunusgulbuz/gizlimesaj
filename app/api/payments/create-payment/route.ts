import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { checkoutRateLimit } from '@/lib/rateLimit';
import { generateShortId } from '@/lib/shortid';

interface PaymentRequest {
  template_id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  special_date?: string;
  expires_in_hours?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = checkoutRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many payment attempts' },
        { status: 429 }
      );
    }

    const body: PaymentRequest = await request.json();
    const {
      template_id,
      recipient_name,
      sender_name,
      message,
      special_date,
      expires_in_hours = 72
    } = body;

    // Validate required fields
    if (!template_id || !recipient_name || !sender_name || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get template details and pricing
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('id, title, price, is_active')
      .eq('id', template_id)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    if (!template.is_active) {
      return NextResponse.json(
        { error: 'Template is not available' },
        { status: 400 }
      );
    }

    // Generate unique short ID for the personal page
    const shortId = generateShortId();

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expires_in_hours);

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        template_id,
        recipient_name,
        sender_name,
        message,
        special_date: special_date || null,
        expires_at: expiresAt.toISOString(),
        short_id: shortId,
        amount: template.price,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // In a real implementation, you would integrate with a payment provider here
    // For now, we'll simulate a payment URL
    const paymentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/payment/${order.id}`;

    return NextResponse.json({
      success: true,
      order_id: order.id,
      payment_url: paymentUrl,
      amount: template.price,
      short_id: shortId
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}