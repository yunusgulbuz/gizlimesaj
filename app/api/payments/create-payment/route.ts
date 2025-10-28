import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';
import { checkoutRateLimit } from '@/lib/rateLimit';
import { generateShortId } from '@/lib/shortid';
import { createPayTRHelper } from '@/lib/payments/paytr';
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
  ai_template_id?: string; // AI template ID
  share_preview_meta?: {
    title: string;
    description: string;
    siteName: string;
    image: string;
    category: string;
    presetId: string;
    isCustom: boolean;
  } | null; // Share preview metadata
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
      bg_audio_url,
      ai_template_id,
      share_preview_meta
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

      // Initialize PayTR payment for existing order
      try {
        const paytrHelper = createPayTRHelper();
        // Generate alphanumeric merchant_oid (remove dashes from UUID)
        const merchantOid = `ORDER${existingOrder.id.replace(/-/g, '')}${Date.now()}`;

        const tokenResponse = await paytrHelper.getPaymentToken({
          amount: parseFloat(existingOrder.total_try),
          merchantOid,
          userEmail: existingOrder.buyer_email || normalizedBuyerEmail,
          userName: existingOrder.sender_name || '',
          userAddress: 'Türkiye', // Required field for PayTR
          userPhone: '05555555555', // Default for test
          basketItems: [
            {
              name: `Sipariş #${existingOrder.short_id}`,
              price: parseFloat(existingOrder.total_try).toFixed(2),
              quantity: 1
            }
          ],
          userIp: request.headers.get('x-forwarded-for') ||
                 request.headers.get('x-real-ip') ||
                 '127.0.0.1'
        });

        if (tokenResponse.status === 'success' && tokenResponse.token) {
          // Update order with payment reference
          await supabase
            .from('orders')
            .update({
              payment_reference: merchantOid,
              payment_provider: 'paytr',
              updated_at: new Date().toISOString()
            })
            .eq('id', existingOrder.id);

          return NextResponse.json({
            success: true,
            order_id: existingOrder.id,
            payment_token: tokenResponse.token,
            payment_type: 'iframe',
            amount: parseFloat(existingOrder.total_try),
            short_id: existingOrder.short_id
          });
        } else {
          throw new Error(tokenResponse.reason || 'Failed to get payment token');
        }

      } catch (error) {
        console.error('Payment initialization error:', error);
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

    let template: any;
    let templatePrice: number;

    // Check if this is an AI template
    if (ai_template_id) {
      console.log('Processing AI template:', ai_template_id);

      // Get AI template details
      const { data: aiTemplate, error: aiTemplateError } = await supabase
        .from('ai_generated_templates')
        .select('id, title, is_active')
        .eq('id', ai_template_id)
        .single();

      console.log('AI Template query result:', { aiTemplate, aiTemplateError });

      if (aiTemplateError || !aiTemplate) {
        console.log('AI Template not found error:', aiTemplateError);
        return NextResponse.json(
          { error: 'AI Template not found' },
          { status: 404 }
        );
      }

      if (!aiTemplate.is_active) {
        return NextResponse.json(
          { error: 'AI Template is not available' },
          { status: 400 }
        );
      }

      template = aiTemplate;

      // Get AI template pricing
      const { data: aiPricing, error: aiPricingError } = await supabase
        .from('ai_template_pricing')
        .select('price_try')
        .eq('duration_id', duration_id)
        .eq('is_active', true)
        .single();

      console.log('AI Template pricing result:', { aiPricing, aiPricingError });

      if (aiPricingError || !aiPricing) {
        console.log('AI Template pricing not found error:', aiPricingError);
        return NextResponse.json(
          { error: 'AI Template pricing not found for selected duration' },
          { status: 404 }
        );
      }

      templatePrice = parseFloat(aiPricing.price_try);
    } else {
      // Regular template flow
      const { data: regularTemplate, error: templateError } = await supabase
        .from('templates')
        .select('id, title, is_active')
        .eq('id', template_id)
        .single();

      console.log('Template query result:', { regularTemplate, templateError });

      if (templateError || !regularTemplate) {
        console.log('Template not found error:', templateError);
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }

      if (!regularTemplate.is_active) {
        return NextResponse.json(
          { error: 'Template is not available' },
          { status: 400 }
        );
      }

      template = regularTemplate;

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

      templatePrice = parseFloat(templatePricing.price_try);
    }

    // Generate unique short ID for the personal page
    const shortId = generateShortId();

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expires_in_hours);

    // Create order record
    const orderData: any = {
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
      payment_provider: 'paytr', // PayTR as payment provider
      created_at: new Date().toISOString(),
      text_fields: text_fields || {},
      design_style: design_style || (ai_template_id ? 'ai-generated' : 'modern'),
      bg_audio_url: bg_audio_url || null,
      share_preview_meta: share_preview_meta || null,
      user_id: currentUserId
    };

    // Set either ai_template_id or template_id, not both
    if (ai_template_id) {
      orderData.ai_template_id = ai_template_id;
    } else {
      orderData.template_id = template_id;
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Initialize PayTR payment
    try {
      const paytrHelper = createPayTRHelper();
      // Generate alphanumeric merchant_oid (remove dashes from UUID)
      const merchantOid = `ORDER${order.id.replace(/-/g, '')}${Date.now()}`;

      const tokenResponse = await paytrHelper.getPaymentToken({
        amount: templatePrice,
        merchantOid,
        userEmail: normalizedBuyerEmail,
        userName: sender_name,
        userAddress: 'Türkiye', // Required field for PayTR
        userPhone: '05555555555', // Default for test
        basketItems: [
          {
            name: `Sipariş #${shortId}`,
            price: templatePrice.toFixed(2),
            quantity: 1
          }
        ],
        userIp: request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               '127.0.0.1'
      });

      if (tokenResponse.status === 'success' && tokenResponse.token) {
        // Update order with payment reference and provider
        await supabase
          .from('orders')
          .update({
            payment_reference: merchantOid,
            payment_provider: 'paytr',
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);

        return NextResponse.json({
          success: true,
          order_id: order.id,
          payment_token: tokenResponse.token,
          payment_type: 'iframe',
          amount: templatePrice,
          short_id: shortId
        });
      } else {
        throw new Error(tokenResponse.reason || 'Failed to get payment token');
      }

    } catch (paymentError) {
      console.error('Payment initialization error:', paymentError);

      // Fallback to demo payment URL if payment provider fails
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
