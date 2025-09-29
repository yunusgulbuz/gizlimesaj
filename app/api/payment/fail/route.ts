import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    
    // Form data'yı object'e çevir
    for (const [key, value] of formData.entries()) {
      params[key] = value.toString();
    }

    console.log('Payment failed params:', params);

    // Hata mesajını al
    const errorMessage = params.RESPONSE_DATA || 'Ödeme işlemi başarısız oldu';
    const responseCode = params.RESPONSE_CODE || '0';

    // Başarısız ödeme sayfasına yönlendir
    return NextResponse.redirect(
      new URL(`/payment/fail?message=${encodeURIComponent(errorMessage)}&code=${responseCode}`, req.url)
    );

  } catch (error) {
    console.error('Payment fail handler error:', error);
    return NextResponse.redirect(new URL('/payment/fail?message=Ödeme işlemi sırasında bir hata oluştu&code=SYSTEM_ERROR', req.url));
  }
}

export async function GET(req: NextRequest) {
  // GET istekleri için de aynı işlemi yap
  const url = new URL(req.url);
  const message = url.searchParams.get('message') || 'Ödeme işlemi başarısız oldu';
  
  return NextResponse.redirect(
    new URL(`/payment/fail?message=${encodeURIComponent(message)}`, req.url)
  );
}