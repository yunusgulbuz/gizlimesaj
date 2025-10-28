import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createPayTRHelper } from '@/lib/payments/paytr';

export async function POST(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000';

  try {
    const formData = await request.formData();

    // Extract PayTR callback parameters
    const paytrCallback = {
      merchant_oid: formData.get('merchant_oid') as string,
      status: formData.get('status') as 'success' | 'failed',
      total_amount: formData.get('total_amount') as string,
      hash: formData.get('hash') as string,
      failed_reason_code: formData.get('failed_reason_code') as string || undefined,
      failed_reason_msg: formData.get('failed_reason_msg') as string || undefined,
      test_mode: formData.get('test_mode') as string || undefined,
      payment_type: formData.get('payment_type') as string || undefined,
      currency: formData.get('currency') as string || undefined,
      payment_amount: formData.get('payment_amount') as string || undefined,
    };

    console.log('PayTR callback received:', paytrCallback);
    console.log('Full form data:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    // Validate required fields
    if (!paytrCallback.merchant_oid || !paytrCallback.status || !paytrCallback.hash) {
      console.error('Missing required fields in PayTR callback');
      return new Response('OK', { status: 200 }); // Return OK to prevent PayTR retries
    }

    const supabase = await createServerSupabaseClient();
    const paytrHelper = createPayTRHelper();

    // Verify callback hash
    const isValidHash = paytrHelper.verifyCallbackHash(paytrCallback);

    if (!isValidHash) {
      console.error('Invalid hash in PayTR callback - SECURITY ALERT');
      // For production, you might want to log this to a security monitoring service
      return new Response('OK', { status: 200 }); // Still return OK to prevent retries
    }

    // Find order by payment reference
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, templates(*)')
      .eq('payment_reference', paytrCallback.merchant_oid)
      .single();

    // If order has ai_template_id, fetch the AI template separately
    if (order && order.ai_template_id) {
      const { data: aiTemplate } = await supabase
        .from('ai_generated_templates')
        .select('*')
        .eq('id', order.ai_template_id)
        .single();

      if (aiTemplate) {
        order.ai_generated_templates = aiTemplate;
      }
    }

    if (orderError || !order) {
      console.error('Order not found for reference:', paytrCallback.merchant_oid);
      return new Response('OK', { status: 200 }); // Return OK to prevent retries
    }

    // Check if payment is successful
    const isPaymentSuccessful = paytrHelper.isPaymentSuccessful(paytrCallback);

    if (isPaymentSuccessful) {
      // Update order status to completed
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          payment_response: paytrCallback,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Failed to update order status:', updateError);
        return new Response('OK', { status: 200 });
      }

      // Check if this is a credit purchase
      const isCreditPurchase = order.text_fields?.order_type === 'credit_purchase';

      if (isCreditPurchase) {
        // Add credits to user account
        const credits = order.text_fields?.credits || 0;
        const packageName = order.text_fields?.package_name || 'AI Kredi Paketi';

        console.log(`Adding ${credits} credits to user ${order.user_id}`);

        try {
          // Call the database function to add credits
          const { error: creditError } = await supabase.rpc('add_user_credits', {
            p_user_id: order.user_id,
            p_credits: credits,
            p_order_id: order.id,
            p_description: `${packageName} satın alımı`
          });

          if (creditError) {
            console.error('Failed to add credits:', creditError);
            // Don't fail the callback, payment was successful
          } else {
            console.log(`Successfully added ${credits} credits to user ${order.user_id}`);
          }
        } catch (creditErr) {
          console.error('Error adding credits:', creditErr);
        }

        // Send credit purchase success email
        try {
          const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: order.buyer_email,
              type: 'credit-purchase-success',
              data: {
                orderId: order.id,
                packageName: packageName,
                credits: credits,
                amount: (order.total_try || 0) // Already in TL
              }
            })
          });

          if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            console.error('Failed to send credit purchase success email:', {
              status: emailResponse.status,
              statusText: emailResponse.statusText,
              body: errorText
            });
          } else {
            console.log('Credit purchase success email sent successfully to:', order.buyer_email);
          }
        } catch (emailError) {
          console.error('Error sending credit purchase success email:', emailError);
        }

        console.log('Credit purchase successful for order:', order.id);
        return new Response('OK', { status: 200 });
      }

      // Regular template purchase - create personal page record
      const personalPageData: any = {
        order_id: order.id,
        short_id: order.short_id,
        recipient_name: order.recipient_name,
        sender_name: order.sender_name,
        message: order.message,
        special_date: order.special_date,
        start_at: new Date().toISOString(),
        expires_at: order.expires_at,
        is_active: true,
        created_at: new Date().toISOString(),
        text_fields: order.text_fields || {},
        design_style: order.design_style || 'modern',
        bg_audio_url: order.bg_audio_url || null,
        share_preview_meta: order.share_preview_meta || null
      };

      // Check if this is an AI template or regular template
      if (order.ai_template_id && order.ai_generated_templates) {
        // AI template - store the template code
        personalPageData.template_id = order.ai_template_id;
        personalPageData.ai_template_code = order.ai_generated_templates.template_code;
      } else {
        // Regular template
        personalPageData.template_id = order.template_id;
      }

      const { error: pageError } = await supabase
        .from('personal_pages')
        .insert(personalPageData);

      if (pageError) {
        console.error('Failed to create personal page:', pageError);
        // Don't fail the callback, payment was successful
      } else {
        // Send payment success email
        try {
          const personalPageUrl = `${baseUrl}/m/${order.short_id}`;
          const managementUrl = `${baseUrl}/success/${order.short_id}`;
          const amountInTL = (order.total_try || 0).toFixed(2);

          const templateTitle = order.ai_generated_templates?.title || order.templates?.title || 'Gizli Mesaj';

          const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: order.buyer_email,
              type: 'payment-success',
              data: {
                orderId: order.id,
                templateTitle: templateTitle,
                amount: amountInTL,
                personalPageUrl: personalPageUrl,
                managementUrl: managementUrl
              }
            })
          });

          if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            console.error('Failed to send payment success email:', {
              status: emailResponse.status,
              statusText: emailResponse.statusText,
              body: errorText
            });
          } else {
            console.log('Payment success email sent successfully to:', order.buyer_email);
          }
        } catch (emailError) {
          console.error('Error sending payment success email:', emailError);
        }
      }

      console.log('Payment successful for order:', order.id);
      return new Response('OK', { status: 200 });

    } else {
      // Payment failed
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'failed',
          payment_response: paytrCallback,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Failed to update order status:', updateError);
      }

      const errorMessage = paytrHelper.getErrorMessage(paytrCallback);
      console.log('Payment failed for order:', order.id, 'Error:', errorMessage);

      return new Response('OK', { status: 200 });
    }

  } catch (error) {
    console.error('PayTR callback processing error:', error);
    // Return OK even on error to prevent PayTR from retrying
    return new Response('OK', { status: 200 });
  }
}

// PayTR might also send GET requests in some cases
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Convert URL parameters to FormData
  const formData = new FormData();
  searchParams.forEach((value, key) => {
    formData.append(key, value);
  });

  // Create a new POST request with the FormData
  const newRequest = new NextRequest(request.url, {
    method: 'POST',
    body: formData,
    headers: request.headers,
  });

  return POST(newRequest);
}
