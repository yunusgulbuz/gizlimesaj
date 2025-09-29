import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    
    for (const [key, value] of formData.entries()) {
      params[key] = value.toString();
    }

    console.log('Payment fail params:', params);

    const reason = 'payment_failed';
    const message = params.RESPONSE_DATA || 'Ödeme işlemi başarısız oldu.';

    return NextResponse.redirect(new URL(`/payment/error?reason=${reason}&message=${encodeURIComponent(message)}`, req.url));

  } catch (error) {
    console.error('Payment fail handler error:', error);
    return NextResponse.redirect(new URL('/payment/error?reason=server_error', req.url));
  }
}