import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { PaynkolayHelper } from '@/lib/payments/paynkolay';

// Handle POST requests from Paynkolay
// This is a fallback in case the FAIL_URL environment variable points here instead of /api/payments/paynkolay/fail
export async function POST(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const finalBaseUrl = (baseUrl && baseUrl !== 'null' && baseUrl !== 'undefined') ? baseUrl : 'http://localhost:3000';
  
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

    console.log('Paynkolay fail callback received at /payment/error:', paynkolayResponse);

    // Validate required fields
    if (!paynkolayResponse.CLIENT_REFERENCE_CODE) {
      console.error('Missing CLIENT_REFERENCE_CODE in Paynkolay fail response');
      return NextResponse.redirect(`${finalBaseUrl}/payment/error?reason=invalid_response`, 303);
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

    // Verify hash to ensure response authenticity (skip if hash data is empty/null)
    let isHashValid = true;
    if (paynkolayResponse.hashDataV2 && paynkolayResponse.hashDataV2.trim() !== '') {
      isHashValid = paynkolayHelper.verifyResponseHash(
        paynkolayResponse, 
        process.env.PAYNKOLAY_SECRET_KEY!
      );

      if (!isHashValid) {
         console.error('Invalid hashDataV2 in Paynkolay fail response');
         return NextResponse.redirect(`${finalBaseUrl}/payment/error?reason=invalid_hash`, 303);
       }
    } else {
      console.warn('HashDataV2 is empty in Paynkolay fail response, skipping hash validation');
    }

    // Find the order by payment reference
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_reference', paynkolayResponse.CLIENT_REFERENCE_CODE)
      .single();

    if (orderError || !order) {
      console.error('Order not found for reference:', paynkolayResponse.CLIENT_REFERENCE_CODE);
      return NextResponse.redirect(`${finalBaseUrl}/payment/error?reason=order_not_found`, 303);
    }

    // Update order status to failed
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

    // Get error message from Paynkolay response
    const errorMessage = paynkolayHelper.getErrorMessage(paynkolayResponse);
    console.log('Payment failed for order:', order.id, 'Error:', errorMessage);
    
    // Redirect to error page with specific error message (use 303 to convert POST to GET)
    return NextResponse.redirect(
      `${finalBaseUrl}/payment/error?reason=payment_failed&message=${encodeURIComponent(errorMessage)}&order_id=${order.id}`,
      303
    );

  } catch (error) {
    console.error('Paynkolay fail callback error at /payment/error:', error);
    return NextResponse.redirect(`${finalBaseUrl}/payment/error?reason=server_error`, 303);
  }
}
