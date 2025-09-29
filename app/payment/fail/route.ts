import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Paynkolay'dan gelen form verilerini al
    const message = formData.get('message') as string || 'Ödeme işlemi başarısız oldu';
    const code = formData.get('code') as string || '0';
    const error = formData.get('error') as string;
    const errorDescription = formData.get('error_description') as string;
    
    // Hata mesajını belirle
    let finalMessage = message;
    if (error && errorDescription) {
      finalMessage = errorDescription;
    } else if (error) {
      finalMessage = error;
    }
    
    // URL parametreleri oluştur
    const params = new URLSearchParams();
    params.set('message', encodeURIComponent(finalMessage));
    if (code && code !== '0') {
      params.set('code', code);
    }
    
    // Fail sayfasına yönlendir
    return NextResponse.redirect(
      new URL(`/payment/fail?${params.toString()}`, request.url)
    );
  } catch (error) {
    console.error('Payment fail POST error:', error);
    
    // Hata durumunda genel hata mesajıyla yönlendir
    const params = new URLSearchParams();
    params.set('message', encodeURIComponent('Ödeme işlemi sırasında bir hata oluştu'));
    params.set('code', 'SYSTEM_ERROR');
    
    return NextResponse.redirect(
      new URL(`/payment/fail?${params.toString()}`, request.url)
    );
  }
}

export async function GET(request: NextRequest) {
  // GET istekleri için mevcut sayfayı göster
  const { searchParams } = new URL(request.url);
  const message = searchParams.get('message') || 'Ödeme işlemi başarısız oldu';
  const code = searchParams.get('code') || '0';
  
  // Eğer parametreler yoksa varsayılan değerlerle yönlendir
  if (!searchParams.has('message')) {
    const params = new URLSearchParams();
    params.set('message', encodeURIComponent(message));
    params.set('code', code);
    
    return NextResponse.redirect(
      new URL(`/payment/fail?${params.toString()}`, request.url)
    );
  }
  
  // Parametreler varsa normal sayfayı göster
  return NextResponse.next();
}