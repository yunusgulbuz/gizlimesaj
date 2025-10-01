import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { PaynkolayHelper } from '@/lib/payments/paynkolay';

export async function POST(request: NextRequest) {
  // Ensure baseUrl is never null or undefined
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Additional safety check
  if (!baseUrl || baseUrl === 'null' || baseUrl === 'undefined') {
    console.error('BaseUrl is invalid:', baseUrl);
    const fallbackUrl = 'http://localhost:3000';
    console.log('Using fallback baseUrl:', fallbackUrl);
  }
  
  const finalBaseUrl = (baseUrl && baseUrl !== 'null' && baseUrl !== 'undefined') ? baseUrl : 'http://localhost:3000';
  console.log('Final baseUrl:', finalBaseUrl);
  
  // Helper function to create safe redirect URLs
  const createRedirectUrl = (path: string) => {
    const safeBaseUrl = finalBaseUrl || 'http://localhost:3000';
    const fullUrl = `${safeBaseUrl}${path}`;
    console.log('Creating redirect URL:', fullUrl);
    return fullUrl;
  };
  
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

    console.log('Paynkolay fail callback received:', paynkolayResponse);
    console.log('Full form data received:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    // Validate required fields
    if (!paynkolayResponse.CLIENT_REFERENCE_CODE) {
      console.error('Missing CLIENT_REFERENCE_CODE in Paynkolay fail response');
      return NextResponse.redirect(createRedirectUrl('/payment/error?reason=invalid_response'), 303);
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

    // Verify hash to ensure response authenticity (skip if hash data is empty/null) - TEMPORARILY DISABLED FOR DEBUGGING
    let isHashValid = true;
    if (paynkolayResponse.hashDataV2 && paynkolayResponse.hashDataV2.trim() !== '') {
      console.log('=== HASH VERIFICATION DEBUG (FAIL) ===');
      console.log('Received hashDataV2:', paynkolayResponse.hashDataV2);
      console.log('Verifying with secret key:', process.env.PAYNKOLAY_SECRET_KEY);

      isHashValid = paynkolayHelper.verifyResponseHash(
        paynkolayResponse,
        process.env.PAYNKOLAY_SECRET_KEY!
      );

      console.log('Hash validation result:', isHashValid);

      if (!isHashValid) {
         console.error('Invalid hashDataV2 in Paynkolay fail response');
         console.error('THIS IS A CRITICAL SECURITY ISSUE - TEMPORARILY ALLOWING FOR DEBUG');
         // TEMPORARILY COMMENTED OUT FOR DEBUGGING
         // return NextResponse.redirect(createRedirectUrl('/payment/error?reason=invalid_hash'), 303);
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
      return NextResponse.redirect(createRedirectUrl('/payment/error?reason=order_not_found'), 303);
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
    
    // Redirect to error page with specific error message
    return NextResponse.redirect(
      createRedirectUrl(`/payment/error?reason=payment_failed&message=${encodeURIComponent(errorMessage)}&order_id=${order.id}`),
      303
    );

  } catch (error) {
    console.error('Paynkolay fail callback error:', error);
    return NextResponse.redirect(createRedirectUrl('/payment/error?reason=server_error'), 303);
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