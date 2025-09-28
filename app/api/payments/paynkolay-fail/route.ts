import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createPaynkolayHelper } from '@/lib/payments/paynkolay';

export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!paynkolayResponse.CLIENT_REFERENCE_CODE) {
      console.error('Missing CLIENT_REFERENCE_CODE in Paynkolay fail response');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/payment/error?reason=invalid_response`);
    }

    const supabase = await createServerSupabaseClient();
    const paynkolayHelper = createPaynkolayHelper();

    // Verify hash to ensure response authenticity
    const isHashValid = paynkolayHelper.verifyResponseHash(
      paynkolayResponse, 
      process.env.PAYNKOLAY_SECRET_KEY!
    );

    if (!isHashValid) {
      console.error('Invalid hash in Paynkolay fail response');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/payment/error?reason=invalid_hash`);
    }

    // Find the order by payment reference
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_reference', paynkolayResponse.CLIENT_REFERENCE_CODE)
      .single();

    if (orderError || !order) {
      console.error('Order not found for reference:', paynkolayResponse.CLIENT_REFERENCE_CODE);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/payment/error?reason=order_not_found`);
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
      `${process.env.NEXT_PUBLIC_SITE_URL}/payment/error?reason=payment_failed&message=${encodeURIComponent(errorMessage)}&order_id=${order.id}`
    );

  } catch (error) {
    console.error('Paynkolay fail callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/payment/error?reason=server_error`);
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