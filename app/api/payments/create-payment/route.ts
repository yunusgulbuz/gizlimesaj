import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';
import { checkoutRateLimit } from '@/lib/rateLimit';
import { generateShortId } from '@/lib/shortid';
import { createPaynkolayHelper } from '@/lib/payments/paynkolay';
import type { TemplateTextFields } from '@/templates/shared/types';

interface PaymentRequest {
  template_id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  special_date?: string;
  expires_in_hours?: number;
  buyer_email: string;
  order_id?: string; // For existing orders
  duration_id?: number; // Add duration_id for proper pricing
  text_fields?: TemplateTextFields; // Form data fields
  design_style?: string; // Selected design style
  bg_audio_url?: string; // Background audio URL
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

    const requestBody = await request.json() as PaymentRequest;
    console.log('Payment request body:', JSON.stringify(requestBody, null, 2));

    const {
      template_id,
      recipient_name,
      sender_name,
      message,
      special_date,
      expires_in_hours = 24,
      buyer_email,
      order_id,
      duration_id,
      text_fields,
      design_style,
      bg_audio_url
    } = requestBody;

    console.log('Extracted template_id:', template_id, 'Type:', typeof template_id);

    const supabase = await createServerSupabaseClient();
    const authSupabase = await createAuthSupabaseClient();
    const {
      data: authData,
    } = await authSupabase.auth.getUser();

    const currentUserId = authData?.user?.id ?? null;
    const currentUserEmail = authData?.user?.email ?? null;
    const normalizedBuyerEmail = buyer_email || currentUserEmail || '';

    // Handle existing order payment
    if (order_id) {
      console.log('Processing payment for existing order:', order_id);
      
      // Get existing order
      const { data: existingOrder, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', order_id)
        .single();

      if (orderError || !existingOrder) {
        console.error('Existing order not found:', orderError);
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      if (!existingOrder.user_id && currentUserId) {
        await supabase
          .from('orders')
          .update({ user_id: currentUserId, buyer_email: existingOrder.buyer_email || normalizedBuyerEmail })
          .eq('id', existingOrder.id);
      }

      if (existingOrder.status !== 'pending') {
        return NextResponse.json(
          { error: 'Order is not in pending status' },
          { status: 400 }
        );
      }

      // Initialize Paynkolay payment for existing order
      try {
        const paynkolayHelper = createPaynkolayHelper();
        const clientRefCode = `ORDER_${existingOrder.id}_${Date.now()}`;
        
        const paymentFormData = paynkolayHelper.createPaymentFormData({
          amount: parseFloat(existingOrder.total_try),
          clientRefCode,
          customerKey: existingOrder.id.toString(),
          merchantCustomerNo: existingOrder.id.toString(),
          cardHolderIP: request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       '127.0.0.1'
        });

        // Update order with payment reference
        await supabase
          .from('orders')
          .update({ 
            payment_reference: clientRefCode,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingOrder.id);

        return NextResponse.json({
           success: true,
           order_id: existingOrder.id,
           payment_form_data: paymentFormData,
           payment_url: process.env.PAYNKOLAY_BASE_URL!,
           amount: parseFloat(existingOrder.total_try),
           short_id: existingOrder.short_id
         });

      } catch (error) {
        console.error('Paynkolay payment initialization error:', error);
        return NextResponse.json(
          { error: 'Payment initialization failed' },
          { status: 500 }
        );
      }
    }

    // Validate required fields for new orders
    if (!template_id || !recipient_name || !sender_name || !message || !normalizedBuyerEmail || !duration_id) {
      console.log('Missing fields validation:', {
        template_id: !!template_id,
        recipient_name: !!recipient_name,
        sender_name: !!sender_name,
        message: !!message,
        buyer_email: !!normalizedBuyerEmail,
        duration_id: !!duration_id
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Looking for template with ID:', template_id);

    // Get template details
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('id, title, is_active')
      .eq('id', template_id)
      .single();

    console.log('Template query result:', { template, templateError });

    if (templateError || !template) {
      console.log('Template not found error:', templateError);
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

    // Get template pricing based on template_id and duration_id
    const { data: templatePricing, error: pricingError } = await supabase
      .from('template_pricing')
      .select('price_try')
      .eq('template_id', template_id)
      .eq('duration_id', duration_id)
      .eq('is_active', true)
      .single();

    console.log('Template pricing result:', { templatePricing, pricingError });

    if (pricingError || !templatePricing) {
      console.log('Template pricing not found error:', pricingError);
      return NextResponse.json(
        { error: 'Template pricing not found for selected duration' },
        { status: 404 }
      );
    }

    const templatePrice = parseFloat(templatePricing.price_try);

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
        amount: templatePrice,
        total_try: templatePrice, // Add required total_try field (price in Turkish Lira)
        buyer_email: normalizedBuyerEmail,
        status: 'pending',
        payment_provider: 'paynkolay', // Add required payment_provider field
        created_at: new Date().toISOString(),
        text_fields: text_fields || {},
        design_style: design_style || 'modern',
        bg_audio_url: bg_audio_url || null,
        user_id: currentUserId
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

    // Initialize Paynkolay payment
    try {
      const paynkolayHelper = createPaynkolayHelper();
      const clientRefCode = `ORDER_${order.id}_${Date.now()}`;
      
      const paymentFormData = paynkolayHelper.createPaymentFormData({
        amount: templatePrice,
        clientRefCode,
        customerKey: order.id.toString(),
        merchantCustomerNo: order.id.toString(),
        cardHolderIP: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1'
      });

      // Update order with payment reference and provider
      await supabase
        .from('orders')
        .update({ 
          payment_reference: clientRefCode,
          payment_provider: 'paynkolay',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      return NextResponse.json({
        success: true,
        order_id: order.id,
        payment_form_data: paymentFormData,
        payment_url: process.env.PAYNKOLAY_BASE_URL!,
        amount: templatePrice,
        short_id: shortId
      });

    } catch (paynkolayError) {
      console.error('Paynkolay initialization error:', paynkolayError);
      
      // Fallback to demo payment URL if Paynkolay fails
      const paymentUrl = `${process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000'}/payment/${order.id}`;
      
      return NextResponse.json({
        success: true,
        order_id: order.id,
        payment_url: paymentUrl,
        amount: templatePrice,
        short_id: shortId,
        error: 'Payment provider temporarily unavailable, using demo mode'
      });
    }

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
