import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const MERCHANT_SECRET_KEY = "_YckdxUbv4vrnMUZ6VQsr";

interface PaymentParams {
  RESPONSE_CODE: string;
  RESPONSE_DATA: string;
  REFERENCE_CODE: string;
  USE_3D: string;
  MERCHANT_NO: string;
  AUTH_CODE: string;
  CLIENT_REFERENCE_CODE: string;
  TIMESTAMP: string;
  TRANSACTION_AMOUNT: string;
  AUTHORIZATION_AMOUNT: string;
  COMMISION: string;
  COMMISION_RATE: string;
  INSTALLMENT: string;
  RND: string;
  hashData?: string;
  hashDataV2?: string;
  detail?: string;
  [key: string]: string | undefined;
}

interface OrderDetails {
  templateId?: string;
  userId?: string;
  amount?: number;
  [key: string]: unknown;
}

function verifyHash(params: PaymentParams): boolean {
  try {
    const {
      RESPONSE_CODE,
      RESPONSE_DATA,
      REFERENCE_CODE,
      USE_3D,
      MERCHANT_NO,
      AUTH_CODE,
      CLIENT_REFERENCE_CODE,
      TIMESTAMP,
      TRANSACTION_AMOUNT,
      AUTHORIZATION_AMOUNT,
      COMMISION,
      COMMISION_RATE,
      INSTALLMENT,
      RND,
      hashData,
      hashDataV2
    } = params;

    // Hash doğrulama için string oluştur
    const hashString = [
      RESPONSE_CODE,
      RESPONSE_DATA,
      REFERENCE_CODE,
      USE_3D,
      MERCHANT_NO,
      AUTH_CODE,
      CLIENT_REFERENCE_CODE,
      TIMESTAMP,
      TRANSACTION_AMOUNT,
      AUTHORIZATION_AMOUNT,
      COMMISION,
      COMMISION_RATE,
      INSTALLMENT,
      RND,
      MERCHANT_SECRET_KEY
    ].join("|");

    const hash = crypto.createHash('sha512');
    hash.update(hashString, 'utf-8');
    const calculatedHash = hash.digest('base64');

    return calculatedHash === hashDataV2;
  } catch (error) {
    console.error('Hash verification error:', error);
    return false;
  }
}

async function generateShortId(supabase: any): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Benzersizlik kontrolü
  const { data: existing } = await supabase
    .from('personal_pages')
    .select('short_id')
    .eq('short_id', result)
    .single();
    
  if (existing) {
    return generateShortId(supabase); // Recursive call if exists
  }
  
  return result;
}

export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const formData = await req.formData();
    const params: Record<string, string> = {};
    
    // Form data'yı object'e çevir
    for (const [key, value] of formData.entries()) {
      params[key] = value.toString();
    }

    console.log('Payment success params:', params);

    // Hash doğrulama
    if (!verifyHash(params as PaymentParams)) {
      console.error('Hash verification failed');
      return NextResponse.redirect(new URL('/payment/error?reason=invalid_hash', req.url));
    }

    // Ödeme başarılı mı kontrol et
    if (params.RESPONSE_CODE !== '2' || !params.AUTH_CODE || params.AUTH_CODE === '0') {
      console.error('Payment failed:', params.RESPONSE_DATA);
      return NextResponse.redirect(new URL(`/payment/error?reason=payment_failed&message=${encodeURIComponent(params.RESPONSE_DATA)}`, req.url));
    }

    // CLIENT_REFERENCE_CODE'dan sipariş bilgilerini al
    const clientRefCode = params.CLIENT_REFERENCE_CODE;
    
    // Detail parametresinden sipariş bilgilerini parse et (eğer varsa)
    let orderDetails: OrderDetails = {};
    if (params.detail) {
      try {
        orderDetails = JSON.parse(params.detail);
      } catch (e) {
        console.error('Failed to parse order details:', e);
      }
    }

    // Sipariş oluştur
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        template_id: orderDetails.templateId || 1,
        recipient_name: orderDetails.recipientName || 'Bilinmeyen',
        sender_name: orderDetails.senderName || 'Bilinmeyen',
        message: orderDetails.message || 'Mesaj bulunamadı',
        amount: parseFloat(params.AUTHORIZATION_AMOUNT),
        status: 'completed',
        payment_provider: 'paynkolay',
        total_try: 1,
        paid_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.redirect(new URL('/payment/error?reason=order_creation_failed', req.url));
    }

    // Kısa ID oluştur
    const shortId = await generateShortId(supabase);

    // Kişisel sayfa oluştur
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 gün sonra sona erer

    const { data: personalPage, error: pageError } = await supabase
      .from('personal_pages')
      .insert({
        short_id: shortId,
        template_id: orderDetails.templateId || 1,
        order_id: order.id,
        recipient_name: orderDetails.recipientName || 'Bilinmeyen',
        sender_name: orderDetails.senderName || 'Bilinmeyen',
        message: orderDetails.message || 'Mesaj bulunamadı',
        expires_at: expiresAt.toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (pageError) {
      console.error('Personal page creation error:', pageError);
      return NextResponse.redirect(new URL('/payment/error?reason=page_creation_failed', req.url));
    }

    // Başarılı ödeme sayfasına yönlendir
    return NextResponse.redirect(new URL(`/payment/success?shortId=${shortId}&orderId=${order.id}`, req.url));

  } catch (error) {
    console.error('Payment success handler error:', error);
    return NextResponse.redirect(new URL('/payment/error?reason=server_error', req.url));
  }
}