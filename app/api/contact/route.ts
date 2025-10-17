import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Lütfen tüm alanları doldurun' },
        { status: 400 }
      );
    }

    // Send email to birmesajmutluluk@gmail.com
    const { data, error } = await resend.emails.send({
      from: 'birmesajmutluluk <onboarding@resend.dev>', // Resend default sender
      to: 'birmesajmutluluk@gmail.com',
      replyTo: email, // User's email for easy reply
      subject: `[İletişim Formu] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #f43f5e 0%, #9333ea 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .info-row {
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #e5e7eb;
              }
              .info-row:last-child {
                border-bottom: none;
              }
              .label {
                font-weight: 600;
                color: #6b7280;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
              }
              .value {
                color: #111827;
                font-size: 16px;
              }
              .message-box {
                background: white;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #9333ea;
                margin-top: 10px;
                white-space: pre-wrap;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎉 Yeni İletişim Formu Mesajı</h1>
            </div>
            <div class="content">
              <div class="info-row">
                <div class="label">Gönderen</div>
                <div class="value">${name}</div>
              </div>

              <div class="info-row">
                <div class="label">E-posta Adresi</div>
                <div class="value"><a href="mailto:${email}" style="color: #9333ea;">${email}</a></div>
              </div>

              <div class="info-row">
                <div class="label">Konu</div>
                <div class="value">${subject}</div>
              </div>

              <div class="info-row">
                <div class="label">Mesaj</div>
                <div class="message-box">${message}</div>
              </div>
            </div>

            <div class="footer">
              <p>Bu mesaj birmesajmutluluk.com iletişim formu üzerinden gönderilmiştir.</p>
              <p>Göndericiye yanıt vermek için "Yanıtla" butonunu kullanabilirsiniz.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Mail gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Mesajınız başarıyla gönderildi!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}
