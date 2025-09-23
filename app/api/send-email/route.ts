import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = await rateLimit(clientId, 'API_GENERAL');
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { type, to, data } = body;

    if (!type || !to) {
      return NextResponse.json(
        { error: 'Email tipi ve alıcı adresi gerekli.' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'welcome':
        if (!data?.name) {
          return NextResponse.json(
            { error: 'İsim gerekli.' },
            { status: 400 }
          );
        }
        result = await emailService.sendWelcomeEmail(to, data.name);
        break;

      case 'order-confirmation':
        if (!data?.orderId || !data?.templateTitle || !data?.amount || !data?.recipientName) {
          return NextResponse.json(
            { error: 'Sipariş detayları eksik.' },
            { status: 400 }
          );
        }
        result = await emailService.sendOrderConfirmationEmail(to, data);
        break;

      case 'payment-success':
        if (!data?.orderId || !data?.templateTitle || !data?.amount || !data?.personalPageUrl) {
          return NextResponse.json(
            { error: 'Ödeme detayları eksik.' },
            { status: 400 }
          );
        }
        result = await emailService.sendPaymentSuccessEmail(to, data);
        break;

      case 'message-notification':
        if (!data?.senderName || !data?.recipientName || !data?.messageUrl) {
          return NextResponse.json(
            { error: 'Mesaj detayları eksik.' },
            { status: 400 }
          );
        }
        result = await emailService.sendMessageNotificationEmail(to, data);
        break;

      default:
        return NextResponse.json(
          { error: 'Geçersiz email tipi.' },
          { status: 400 }
        );
    }

    if (!result.success) {
      console.error('Email sending failed:', result.error);
      return NextResponse.json(
        { error: 'Email gönderilemedi.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email başarıyla gönderildi.',
      data: result.data
    });

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası.' },
      { status: 500 }
    );
  }
}