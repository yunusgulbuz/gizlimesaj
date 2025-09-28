import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Paynkolay test ortamı bilgileri
const PAYNKOLAY_CONFIG = {
  sx: "118591467|bScbGDYCtPf7SS1N6PQ6/+58rFhW1WpsWINqvkJFaJlu6bMH2tgPKDQtjeA5vClpzJP24uA0vx7OX53cP3SgUspa4EvYix+1C3aXe++8glUvu9Oyyj3v300p5NP7ro/9K57Zcw==",
  merchantSecretKey: "_YckdxUbv4vrnMUZ6VQsr",
  testUrl: "https://paynkolaytest.nkolayislem.com.tr/Vpos",
  successUrl: process.env.NODE_ENV === 'production' 
    ? "https://gizlimesaj.com/payment/success" 
    : "http://localhost:3000/payment/success",
  failUrl: process.env.NODE_ENV === 'production' 
    ? "https://gizlimesaj.com/payment/fail" 
    : "http://localhost:3000/payment/fail"
};

function getClientIp(req: NextRequest): string {
  const headers = [
    'x-client-ip',
    'x-forwarded-for',
    'x-forwarded',
    'x-cluster-client-ip',
    'forwarded-for',
    'forwarded',
  ];

  for (const header of headers) {
    const headerValue = req.headers.get(header);
    if (headerValue) {
      const ipList = headerValue.split(',');
      const ip = ipList[0].trim();
      // Basit IP validasyonu
      if (ip && ip !== '::1' && ip !== '127.0.0.1') {
        return ip;
      }
    }
  }

  return '127.0.0.1'; // Fallback IP
}

function getFormattedDate(): string {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

function generateHashData(params: {
  sx: string;
  clientRefCode: string;
  amount: string;
  successUrl: string;
  failUrl: string;
  rnd: string;
  customerKey: string;
  cardHolderIP: string;
  merchantSecretKey: string;
}): string {
  const hashStrParts = [
    params.sx,
    params.clientRefCode,
    params.amount,
    params.successUrl,
    params.failUrl,
    params.rnd,
    params.customerKey,
    params.cardHolderIP,
    params.merchantSecretKey
  ];
  
  const hashStr = hashStrParts.join("|");
  const hash = crypto.createHash('sha512');
  hash.update(hashStr, 'utf-8');
  return hash.digest('base64');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId, amount, recipientName, message, senderName, designStyle } = body;

    // Validasyon
    if (!templateId || !amount || !recipientName || !message || !senderName) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Müşteri IP adresini al
    const cardHolderIP = getClientIp(req);
    
    // Benzersiz referans kodu oluştur
    const clientRefCode = `GM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Timestamp oluştur
    const rnd = getFormattedDate();
    
    // Hash data oluştur
    const hashDataV2 = generateHashData({
      sx: PAYNKOLAY_CONFIG.sx,
      clientRefCode,
      amount: amount.toString(),
      successUrl: PAYNKOLAY_CONFIG.successUrl,
      failUrl: PAYNKOLAY_CONFIG.failUrl,
      rnd,
      customerKey: "",
      cardHolderIP,
      merchantSecretKey: PAYNKOLAY_CONFIG.merchantSecretKey
    });

    // Ödeme form parametreleri
    const paymentParams = {
      sx: PAYNKOLAY_CONFIG.sx,
      successUrl: PAYNKOLAY_CONFIG.successUrl,
      failUrl: PAYNKOLAY_CONFIG.failUrl,
      amount: amount.toString(),
      clientRefCode,
      use3D: "true",
      rnd,
      transactionType: "sales",
      cardHolderIP,
      hashDataV2,
      // Ek bilgiler (sipariş detayları için)
      detail: JSON.stringify({
        templateId,
        recipientName,
        message,
        senderName,
        designStyle
      })
    };

    return NextResponse.json({
      success: true,
      paymentUrl: PAYNKOLAY_CONFIG.testUrl,
      paymentParams,
      clientRefCode
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Ödeme oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}