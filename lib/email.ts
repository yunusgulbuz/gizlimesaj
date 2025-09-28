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
  FROM: 'Gizli Mesaj <noreply@heartnote2.vercel.app>',
  REPLY_TO: 'destek@heartnote2.vercel.app',
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
      amount: number;
      personalPageUrl: string;
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
    amount: number;
    personalPageUrl: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ödeme Başarılı</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Gizli Mesajınız Hazır! 🎉</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; margin-bottom: 20px;">Ödemeniz başarıyla tamamlandı!</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Şablon:</strong> ${paymentDetails.templateTitle}</p>
              <p><strong>Ödenen Tutar:</strong> <span style="color: #10b981; font-weight: bold;">₺${paymentDetails.amount}</span></p>
            </div>
            
            <p>Gizli mesajınız hazır! Aşağıdaki linki sevdiğiniz kişiyle paylaşabilirsiniz:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${paymentDetails.personalPageUrl}" style="background: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Gizli Mesajı Görüntüle</a>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>💡 İpucu:</strong> Bu linki WhatsApp, SMS veya sosyal medya üzerinden paylaşabilirsiniz!</p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Teşekkürler! <a href="mailto:${EMAIL_CONFIG.REPLY_TO}" style="color: #ec4899;">destek@gizlimesaj.com</a>
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
}

// Export singleton instance
export const emailService = EmailService.getInstance();