import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  try {
    const formData = await request.formData();
    
    // Extract error information from form data
    const message = formData.get('message') as string || 'Ödeme işlemi başarısız oldu';
    const code = formData.get('code') as string || '0';
    
    // Redirect to the fail page with query parameters
    const redirectUrl = new URL('/payment/fail', baseUrl);
    redirectUrl.searchParams.set('message', message);
    if (code !== '0') {
      redirectUrl.searchParams.set('code', code);
    }
    
    return NextResponse.redirect(redirectUrl.toString());
    
  } catch (error) {
    console.error('Payment fail POST handler error:', error);
    
    // Fallback redirect to generic fail page
    const redirectUrl = new URL('/payment/fail', baseUrl);
    redirectUrl.searchParams.set('message', 'Ödeme işlemi başarısız oldu');
    
    return NextResponse.redirect(redirectUrl.toString());
  }
}

// Handle GET requests by redirecting to the page
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Extract query parameters and preserve them
  const message = url.searchParams.get('message') || 'Ödeme işlemi başarısız oldu';
  const code = url.searchParams.get('code') || '0';
  
  const redirectUrl = new URL('/payment/fail', baseUrl);
  redirectUrl.searchParams.set('message', message);
  if (code !== '0') {
    redirectUrl.searchParams.set('code', code);
  }
  
  return NextResponse.redirect(redirectUrl.toString());
}