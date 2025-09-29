import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { PaynkolayHelper } from '@/lib/payments/paynkolay';

export async function POST(request: NextRequest) {
  // Ensure baseUrl is never null or undefined
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000';
  
  // Additional safety check
  const finalBaseUrl = (baseUrl && baseUrl !== 'null' && baseUrl !== 'undefined') ? baseUrl : 'http://localhost:3000';
  console.log('Final baseUrl:', finalBaseUrl);
  
  try {
    const formData = await request.formData();
    
    // Extract Paynkolay response parameters
    const paynkolayResponse = {
      RESPONSE_CODE: formData.get('RESPONSE_CODE') as string,
      RESPONSE_DATA: formData.get('RESPONSE_DATA') as string,
      USE_3D: formData.get('USE_3D') as string,
      RND: formData.get('RND') as string,
      MERCHANT_NO: formData.get('MERCHANT_NO') as string,
      AUTH_CODE: formData.get('AUTH_CODE') as string,
      REFERENCE_CODE: formData.get('REFERENCE_CODE') as string,
      CLIENT_REFERENCE_CODE: formData.get('CLIENT_REFERENCE_CODE') as string,
      TIMESTAMP: formData.get('TIMESTAMP') as string,
      TRANSACTION_AMOUNT: formData.get('TRANSACTION_AMOUNT') as string,
      AUTHORIZATION_AMOUNT: formData.get('AUTHORIZATION_AMOUNT') as string,
      COMMISION: formData.get('COMMISION') as string,
      COMMISION_RATE: formData.get('COMMISION_RATE') as string,
      INSTALLMENT: formData.get('INSTALLMENT') as string,
      hashData: formData.get('hashData') as string,
      hashDataV2: formData.get('hashDataV2') as string,
      BANK_RESULT: formData.get('BANK_RESULT') as string || undefined,
    };

    console.log('Paynkolay success callback received:', paynkolayResponse);

    // Validate required fields
    if (!paynkolayResponse.CLIENT_REFERENCE_CODE) {
      console.error('Missing CLIENT_REFERENCE_CODE in Paynkolay success response');
      return NextResponse.redirect(`${finalBaseUrl}/payment/error?reason=invalid_response`);
    }

    const supabase = await createServerSupabaseClient();
    
    // Get Paynkolay configuration
    const paynkolayConfig = {
      sx: process.env.PAYNKOLAY_SX!,
      secretKey: process.env.PAYNKOLAY_SECRET_KEY!,
      baseUrl: process.env.PAYNKOLAY_BASE_URL!,
      successUrl: process.env.PAYNKOLAY_SUCCESS_URL!,
      failUrl: process.env.PAYNKOLAY_FAIL_URL!,
      use3D: process.env.PAYNKOLAY_USE_3D === 'true',
      transactionType: process.env.PAYNKOLAY_TRANSACTION_TYPE as 'sales' | 'presales',
      language: process.env.PAYNKOLAY_LANGUAGE || 'tr'
    };
    
    const paynkolayHelper = new PaynkolayHelper(paynkolayConfig);

    // Verify hash if present
    if (paynkolayResponse.hashDataV2 && paynkolayResponse.RND) {
      const isValidHash = paynkolayHelper.verifyResponseHash(paynkolayResponse, paynkolayConfig.secretKey);
      if (!isValidHash) {
        console.error('Invalid hashDataV2 in Paynkolay success response');
        return NextResponse.redirect(`${finalBaseUrl}/payment/error?reason=invalid_hash`);
      }
    } else {
      console.warn('HashDataV2 is empty in Paynkolay success response, skipping hash validation');
    }

    // Find the order by payment reference (CLIENT_REFERENCE_CODE ile payment_reference eşleştirmesi)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_reference', paynkolayResponse.CLIENT_REFERENCE_CODE)
      .single();

    if (orderError || !order) {
      console.error('Order not found for reference:', paynkolayResponse.CLIENT_REFERENCE_CODE);
      return NextResponse.redirect(`${finalBaseUrl}/payment/error?reason=order_not_found`);
    }

    // Check if payment is successful
    const isPaymentSuccessful = paynkolayHelper.isPaymentSuccessful(paynkolayResponse);

    if (isPaymentSuccessful) {
      // Update order status to completed
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          payment_response: paynkolayResponse,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Failed to update order status:', updateError);
        return NextResponse.redirect(`${finalBaseUrl}/payment/error?reason=update_failed`);
      }

      // Create personal page record
      const { error: pageError } = await supabase
        .from('personal_pages')
        .insert({
          order_id: order.id,
          short_id: order.short_id,
          template_id: order.template_id,
          recipient_name: order.recipient_name,
          sender_name: order.sender_name,
          message: order.message,
          special_date: order.special_date,
          expires_at: order.expires_at,
          is_active: true,
          created_at: new Date().toISOString()
        });

      if (pageError) {
        console.error('Failed to create personal page:', pageError);
        // Don't redirect to error, payment was successful
      } else {
        // Send payment success email with personal page link
        try {
          const personalPageUrl = `${finalBaseUrl}/m/${order.short_id}`;
          
          const emailResponse = await fetch(`${finalBaseUrl}/api/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: order.buyer_email,
              type: 'payment-success',
              data: {
                orderId: order.id,
                templateTitle: order.templates?.title || 'Gizli Mesaj',
                amount: order.total_amount,
                personalPageUrl: personalPageUrl
              }
            })
          });

          if (!emailResponse.ok) {
            console.error('Failed to send payment success email');
          }
        } catch (emailError) {
          console.error('Error sending payment success email:', emailError);
        }
      }

      console.log('Payment successful for order:', order.id);
      return NextResponse.redirect(`${finalBaseUrl}/success/${order.short_id}`);
    } else {
      // Payment failed
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'failed',
          payment_response: paynkolayResponse,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Failed to update order status:', updateError);
      }

      const errorMessage = paynkolayHelper.getErrorMessage(paynkolayResponse);
      console.log('Payment failed for order:', order.id, 'Error:', errorMessage);
      
      return NextResponse.redirect(
        `${finalBaseUrl}/payment/error?reason=payment_failed&message=${encodeURIComponent(errorMessage)}`
      );
    }

  } catch (error) {
    console.error('Paynkolay success callback error:', error);
    return NextResponse.redirect(`${finalBaseUrl}/payment/error?reason=server_error`);
  }
}

// Handle GET requests (in case Paynkolay sends GET instead of POST)
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  // Convert URL parameters to FormData format for consistency
  const formData = new FormData();
  searchParams.forEach((value, key) => {
    formData.append(key, value);
  });

  // Create a new request with FormData
  const newRequest = new NextRequest(request.url, {
    method: 'POST',
    body: formData,
    headers: request.headers,
  });

  return POST(newRequest);
}