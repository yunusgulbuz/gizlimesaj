import { Resend } from 'resend';

// Initialize Resend client with fallback for build time
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build');

// Email templates
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  ORDER_CONFIRMATION: 'order-confirmation',
  PAYMENT_SUCCESS: 'payment-success',
  PAYMENT_FAILED: 'payment-failed',
  MESSAGE_NOTIFICATION: 'message-notification',
  BUTTON_CLICK_NOTIFICATION: 'button-click-notification',
  PASSWORD_RESET: 'password-reset',
} as const;

// Email configuration
export const EMAIL_CONFIG = {
  FROM: 'birmesajmutluluk <noreply@birmesajmutluluk.com>',
  REPLY_TO: 'birmesajmutluluk@gmail.com',
  DOMAIN: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;

// Email service class
export class EmailService {
  private static instance: EmailService;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send welcome email
  async sendWelcomeEmail(to: string, name: string) {
    try {
      // Check if API key is properly configured
      if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy-key-for-build') {
        console.warn('RESEND_API_KEY not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.FROM,
        to: [to],
        subject: 'Gizli Mesaj\'a Hoş Geldiniz! 🎉',
        html: this.getWelcomeEmailTemplate(name),
      });

      if (error) {
        console.error('Welcome email error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Welcome email error:', error);
      return { success: false, error };
    }
  }

  // Send order confirmation email
  async sendOrderConfirmationEmail(
    to: string,
    orderDetails: {
      orderId: string;
      templateTitle: string;
      amount: number;
      recipientName: string;
    }
  ) {
    try {
      // Check if API key is properly configured
      if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy-key-for-build') {
        console.warn('RESEND_API_KEY not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.FROM,
        to: [to],
        subject: `Siparişiniz Alındı - #${orderDetails.orderId}`,
        html: this.getOrderConfirmationTemplate(orderDetails),
      });

      if (error) {
        console.error('Order confirmation email error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Order confirmation email error:', error);
      return { success: false, error };
    }
  }

  // Send payment success email
  async sendPaymentSuccessEmail(
    to: string,
    paymentDetails: {
      orderId: string;
      templateTitle: string;
      amount: string | number;
      personalPageUrl: string;
      managementUrl?: string;
    }
  ) {
    try {
      // Check if API key is properly configured
      if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy-key-for-build') {
        console.warn('RESEND_API_KEY not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.FROM,
        to: [to],
        subject: `Ödemeniz Başarılı - #${paymentDetails.orderId}`,
        html: this.getPaymentSuccessTemplate(paymentDetails),
      });

      if (error) {
        console.error('Payment success email error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Payment success email error:', error);
      return { success: false, error };
    }
  }

  // Send message notification email
  async sendMessageNotificationEmail(
    to: string,
    messageDetails: {
      senderName: string;
      recipientName: string;
      messageUrl: string;
    }
  ) {
    try {
      // Check if API key is properly configured
      if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy-key-for-build') {
        console.warn('RESEND_API_KEY not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.FROM,
        to: [to],
        subject: `${messageDetails.senderName} size özel bir mesaj gönderdi! 💌`,
        html: this.getMessageNotificationTemplate(messageDetails),
      });

      if (error) {
        console.error('Message notification email error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Message notification email error:', error);
      return { success: false, error };
    }
  }

  // Send button click notification email
  async sendButtonClickNotificationEmail(
    to: string,
    clickDetails: {
      recipientName: string;
      senderName: string;
      buttonType: string;
      templateTitle: string;
      personalPageUrl: string;
      clickedAt: string;
    }
  ) {
    try {
      // Check if API key is properly configured
      if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy-key-for-build') {
        console.warn('RESEND_API_KEY not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.FROM,
        to: [to],
        subject: `${clickDetails.recipientName} mesajınızla etkileşime geçti! 🎉`,
        html: this.getButtonClickNotificationTemplate(clickDetails),
      });

      if (error) {
        console.error('Button click notification email error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Button click notification email error:', error);
      return { success: false, error };
    }
  }

  // Send credit purchase success email
  async sendCreditPurchaseSuccessEmail(
    to: string,
    purchaseDetails: {
      orderId: string;
      packageName: string;
      credits: number;
      amount: number;
    }
  ) {
    try {
      // Check if API key is properly configured
      if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy-key-for-build') {
        console.warn('RESEND_API_KEY not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.FROM,
        to: [to],
        subject: `AI Kredi Satın Alımınız Tamamlandı! 🎉`,
        html: this.getCreditPurchaseSuccessTemplate(purchaseDetails),
      });

      if (error) {
        console.error('Credit purchase success email error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Credit purchase success email error:', error);
      return { success: false, error };
    }
  }

  // Email templates
  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hoş Geldiniz</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Hoş Geldiniz! 🎉</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; margin-bottom: 20px;">Merhaba ${name},</p>
            
            <p>Gizli Mesaj ailesine katıldığınız için çok mutluyuz! Artık sevdiklerinize özel, zamanlı mesajlar gönderebilir ve unutulmaz anlar yaratabilirsiniz.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #ec4899; margin-top: 0;">Neler Yapabilirsiniz?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Romantik mesajlar oluşturun</li>
                <li>Doğum günü sürprizleri hazırlayın</li>
                <li>Özel anılarınızı paylaşın</li>
                <li>Zamanlı mesajlar gönderin</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${EMAIL_CONFIG.DOMAIN}/templates" style="background: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Şablonları Keşfedin</a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Herhangi bir sorunuz varsa, <a href="mailto:${EMAIL_CONFIG.REPLY_TO}" style="color: #ec4899;">destek@gizlimesaj.com</a> adresinden bize ulaşabilirsiniz.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  private getOrderConfirmationTemplate(orderDetails: {
    orderId: string;
    templateTitle: string;
    amount: number;
    recipientName: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sipariş Onayı</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Siparişiniz Alındı! ✅</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; margin-bottom: 20px;">Sipariş Detayları:</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Sipariş No:</td>
                  <td style="padding: 8px 0;">#${orderDetails.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Şablon:</td>
                  <td style="padding: 8px 0;">${orderDetails.templateTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Alıcı:</td>
                  <td style="padding: 8px 0;">${orderDetails.recipientName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Tutar:</td>
                  <td style="padding: 8px 0; color: #10b981; font-weight: bold;">₺${orderDetails.amount}</td>
                </tr>
              </table>
            </div>
            
            <p>Ödemenizi tamamladıktan sonra, kişisel mesaj sayfanızın linki size e-posta ile gönderilecektir.</p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Sorularınız için: <a href="mailto:${EMAIL_CONFIG.REPLY_TO}" style="color: #10b981;">destek@gizlimesaj.com</a>
            </p>
          </div>
        </body>
      </html>
    `;
  }

  private getPaymentSuccessTemplate(paymentDetails: {
    orderId: string;
    templateTitle: string;
    amount: string | number;
    personalPageUrl: string;
    managementUrl?: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ödeme Başarılı</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f5f5f5;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Sürpriziniz Hazır! 🎉</h1>
          </div>

          <!-- Main Content -->
          <div style="background: white; padding: 40px 30px;">
            <p style="font-size: 20px; margin: 0 0 30px 0; color: #1f2937; font-weight: 600;">Ödemeniz başarıyla tamamlandı!</p>

            <!-- Order Details -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #fde68a;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">Şablon:</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937; font-size: 15px; font-weight: 500;">${paymentDetails.templateTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">Sipariş No:</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937; font-size: 14px; font-family: monospace;">#${paymentDetails.orderId.substring(0, 8)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; color: #6b7280; font-size: 14px; font-weight: 600; border-top: 1px solid rgba(0,0,0,0.1);">Ödenen Tutar:</td>
                  <td style="padding: 12px 0 0 0; text-align: right; color: #10b981; font-size: 24px; font-weight: 700; border-top: 1px solid rgba(0,0,0,0.1);">₺${typeof paymentDetails.amount === 'string' ? paymentDetails.amount : paymentDetails.amount.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 16px; color: #4b5563; margin: 30px 0 20px 0; text-align: center;">Sürpriziniz hazır! Aşağıdaki butonlardan yönetebilir ve paylaşabilirsiniz:</p>

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${paymentDetails.personalPageUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; margin: 8px; box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3); transition: transform 0.2s;">
                🎁 Sürprizi Görüntüle
              </a>
              <br>
              <a href="${paymentDetails.managementUrl || EMAIL_CONFIG.DOMAIN + '/account/orders'}" style="display: inline-block; background: white; color: #ec4899; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; margin: 8px; border: 2px solid #ec4899; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); transition: transform 0.2s;">
                ⚙️ Yönetim Paneli
              </a>
            </div>

            <!-- Info Box -->
            <div style="background: linear-gradient(135deg, #dbeafe, #e0e7ff); border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #1e40af; font-size: 15px; line-height: 1.6;">
                <strong style="font-size: 16px;">💡 İpucu:</strong><br>
                Bu linki WhatsApp, SMS veya sosyal medya üzerinden sevdiklerinizle paylaşabilirsiniz!<br>
                <span style="font-size: 14px; color: #3730a3;">Yönetim panelinden sürprizinizi dilediğiniz zaman düzenleyebilirsiniz.</span>
              </p>
            </div>

            <!-- Support Section -->
            <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #f3f4f6; text-align: center;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0 0 10px 0;">
                Sorularınız için bize ulaşın
              </p>
              <p style="margin: 0;">
                <a href="mailto:${EMAIL_CONFIG.REPLY_TO}" style="color: #ec4899; text-decoration: none; font-weight: 600; font-size: 15px;">birmesajmutluluk@gmail.com</a>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">
              © ${new Date().getFullYear()} birmesajmutluluk.com - Tüm hakları saklıdır.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Bu email ${paymentDetails.orderId} sipariş numaralı satın alımınız için gönderilmiştir.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  private getMessageNotificationTemplate(messageDetails: {
    senderName: string;
    recipientName: string;
    messageUrl: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Özel Mesajınız Var</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Size Özel Bir Mesaj Var! 💌</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; margin-bottom: 20px;">Merhaba ${messageDetails.recipientName},</p>
            
            <p><strong>${messageDetails.senderName}</strong> size özel bir gizli mesaj hazırladı!</p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 16px; color: #92400e;">🎁 Sürprizinizi görmek için aşağıdaki butona tıklayın!</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${messageDetails.messageUrl}" style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Gizli Mesajı Aç</a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center;">
              Bu mesaj <a href="https://gizlimesaj.com" style="color: #f59e0b;">Gizli Mesaj</a> ile gönderilmiştir.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  private getButtonClickNotificationTemplate(clickDetails: {
    recipientName: string;
    senderName: string;
    buttonType: string;
    templateTitle: string;
    personalPageUrl: string;
    clickedAt: string;
  }): string {
    const buttonTypeText = clickDetails.buttonType === 'like' ? 'Beğeni' :
                          clickDetails.buttonType === 'love' ? 'Kalp' :
                          clickDetails.buttonType === 'share' ? 'Paylaşım' :
                          clickDetails.buttonType === 'download' ? 'İndirme' :
                          'Buton';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mesajınızla Etkileşim</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Harika Haber! 🎉</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; margin-bottom: 20px;">
              <strong>${clickDetails.recipientName}</strong> gizli mesajınızla etkileşime geçti!
            </p>

            <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Şablon:</strong> ${clickDetails.templateTitle}</p>
              <p><strong>Etkileşim Türü:</strong> <span style="color: #059669; font-weight: bold;">${buttonTypeText}</span></p>
              <p><strong>Tarih:</strong> ${new Date(clickDetails.clickedAt).toLocaleString('tr-TR')}</p>
            </div>

            <p>Bu, mesajınızın başarıyla ulaştığının ve beğenildiğinin göstergesi! 🎊</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${clickDetails.personalPageUrl}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Mesajı Tekrar Görüntüle</a>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>💡 İpucu:</strong> Daha fazla kişiyle gizli mesajlarınızı paylaşmak için yeni şablonlar oluşturabilirsiniz!</p>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Teşekkürler! <a href="mailto:${EMAIL_CONFIG.REPLY_TO}" style="color: #10b981;">destek@gizlimesaj.com</a>
            </p>
          </div>
        </body>
      </html>
    `;
  }

  private getCreditPurchaseSuccessTemplate(purchaseDetails: {
    orderId: string;
    packageName: string;
    credits: number;
    amount: number;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AI Kredi Satın Alımı Başarılı</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #a855f7, #ec4899); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">AI Krediniz Hazır! ✨</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; margin-bottom: 20px;">Satın alımınız başarıyla tamamlandı!</p>

            <div style="background: linear-gradient(135deg, #fae8ff, #fce7f3); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 10px;">🎁</div>
              <div style="font-size: 42px; font-weight: bold; color: #a855f7; margin-bottom: 5px;">${purchaseDetails.credits}</div>
              <div style="font-size: 18px; color: #86198f; font-weight: 600;">AI Kredi</div>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Paket:</td>
                  <td style="padding: 8px 0;">${purchaseDetails.packageName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Sipariş No:</td>
                  <td style="padding: 8px 0;">#${purchaseDetails.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Ödenen Tutar:</td>
                  <td style="padding: 8px 0; color: #10b981; font-weight: bold;">₺${purchaseDetails.amount}</td>
                </tr>
              </table>
            </div>

            <p>AI krediniz hesabınıza yüklendi! Artık yapay zeka destekli özel şablonlar oluşturabilirsiniz.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${EMAIL_CONFIG.DOMAIN}/ai-template-creator" style="background: linear-gradient(135deg, #a855f7, #ec4899); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(168,85,247,0.4);">AI Şablon Oluştur</a>
            </div>

            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>💡 İpucu:</strong> Bir AI şablon oluşturma işlemi 1 kredi harcar. Her kredi ile benzersiz, kişiselleştirilmiş şablonlar yaratabilirsiniz!</p>
            </div>

            <div style="border-top: 2px solid #f1f5f9; margin-top: 30px; padding-top: 20px;">
              <h3 style="color: #a855f7; margin-top: 0;">AI Şablonlarla Neler Yapabilirsiniz?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #64748b;">
                <li style="margin-bottom: 8px;">🎨 Yapay zeka ile özel tasarımlar oluşturun</li>
                <li style="margin-bottom: 8px;">💝 Kişiye özel romantik mesajlar yazın</li>
                <li style="margin-bottom: 8px;">🎂 Doğum günü sürprizleri hazırlayın</li>
                <li style="margin-bottom: 8px;">✨ Benzersiz animasyonlar ekleyin</li>
              </ul>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
              Teşekkürler! <br>
              Sorularınız için: <a href="mailto:${EMAIL_CONFIG.REPLY_TO}" style="color: #a855f7;">birmesajmutluluk@gmail.com</a>
            </p>
          </div>
        </body>
      </html>
    `;
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();