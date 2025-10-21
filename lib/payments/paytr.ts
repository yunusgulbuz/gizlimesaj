import crypto from 'crypto';

export interface PayTRConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
  merchantOkUrl: string;
  merchantFailUrl: string;
  language?: string;
  currency?: string;
}

export interface PayTRBasketItem {
  name: string;
  price: string;
  quantity: number;
}

export interface PayTRPaymentRequest {
  amount: number;
  merchantOid: string;
  userEmail: string;
  userName?: string;
  userAddress?: string;
  userPhone?: string;
  basketItems: PayTRBasketItem[];
  userIp?: string;
  noInstallment?: number;
  maxInstallment?: number;
  timeoutLimit?: number;
  debugOn?: number;
}

export interface PayTRTokenResponse {
  status: 'success' | 'failed';
  token?: string;
  reason?: string;
}

export interface PayTRCallbackData {
  merchant_oid: string;
  status: 'success' | 'failed';
  total_amount: string;
  hash: string;
  failed_reason_code?: string;
  failed_reason_msg?: string;
  test_mode?: string;
  payment_type?: string;
  currency?: string;
  payment_amount?: string;
}

/**
 * PayTR helper class for payment integration
 */
export class PayTRHelper {
  private config: PayTRConfig;

  constructor(config: PayTRConfig) {
    this.config = config;
  }

  /**
   * Calculate payment token hash for PayTR API request
   */
  calculatePaymentHash(
    merchantId: string,
    userIp: string,
    merchantOid: string,
    email: string,
    paymentAmount: string,
    userBasket: string,
    noInstallment: string,
    maxInstallment: string,
    currency: string,
    testMode: string
  ): string {
    // Hash string: merchantId + userIp + merchantOid + email + paymentAmount + userBasket + noInstallment + maxInstallment + currency + testMode
    const hashStr = `${merchantId}${userIp}${merchantOid}${email}${paymentAmount}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`;
    const paytrToken = hashStr + this.config.merchantSalt;

    const token = crypto
      .createHmac('sha256', this.config.merchantKey)
      .update(paytrToken)
      .digest('base64');

    console.log('PayTR Payment Hash Calculation:', {
      hashStr,
      merchantSalt: this.config.merchantSalt,
      token
    });

    return token;
  }

  /**
   * Encode basket items to base64 format required by PayTR
   */
  encodeBasket(items: PayTRBasketItem[]): string {
    const basketArray = items.map(item => [item.name, item.price, item.quantity]);
    const basketJson = JSON.stringify(basketArray);
    return Buffer.from(basketJson).toString('base64');
  }

  /**
   * Get token from PayTR API for iframe payment
   */
  async getPaymentToken(request: PayTRPaymentRequest): Promise<PayTRTokenResponse> {
    try {
      const userBasket = this.encodeBasket(request.basketItems);
      const paymentAmount = (request.amount * 100).toString(); // Convert to kuruş (multiply by 100)
      const userIp = request.userIp || '';
      const noInstallment = request.noInstallment?.toString() || '0';
      const maxInstallment = request.maxInstallment?.toString() || '0';
      const currency = this.config.currency || 'TL';
      const testMode = this.config.testMode ? '1' : '0';

      const token = this.calculatePaymentHash(
        this.config.merchantId,
        userIp,
        request.merchantOid,
        request.userEmail,
        paymentAmount,
        userBasket,
        noInstallment,
        maxInstallment,
        currency,
        testMode
      );

      // Add merchant_oid as query parameter to merchant_ok_url and merchant_fail_url
      const merchantOkUrl = `${this.config.merchantOkUrl}?merchant_oid=${encodeURIComponent(request.merchantOid)}`;
      const merchantFailUrl = `${this.config.merchantFailUrl}?merchant_oid=${encodeURIComponent(request.merchantOid)}`;

      const formData = new URLSearchParams({
        merchant_id: this.config.merchantId,
        merchant_key: this.config.merchantKey,
        merchant_salt: this.config.merchantSalt,
        email: request.userEmail,
        payment_amount: paymentAmount,
        merchant_oid: request.merchantOid,
        user_name: request.userName || '',
        user_address: request.userAddress || '',
        user_phone: request.userPhone || '',
        merchant_ok_url: merchantOkUrl,
        merchant_fail_url: merchantFailUrl,
        user_basket: userBasket,
        user_ip: userIp,
        timeout_limit: request.timeoutLimit?.toString() || '30',
        debug_on: request.debugOn?.toString() || '1',
        test_mode: testMode,
        lang: this.config.language || 'tr',
        no_installment: noInstallment,
        max_installment: maxInstallment,
        currency: currency,
        paytr_token: token,
      });

      console.log('PayTR API Request:', {
        url: 'https://www.paytr.com/odeme/api/get-token',
        formData: Object.fromEntries(formData)
      });

      const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`PayTR API request failed: ${response.status}`);
      }

      const result = await response.json() as PayTRTokenResponse;
      console.log('PayTR API Response:', result);

      return result;

    } catch (error) {
      console.error('PayTR token request error:', error);
      return {
        status: 'failed',
        reason: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Verify callback hash from PayTR
   */
  verifyCallbackHash(callback: PayTRCallbackData): boolean {
    try {
      const { merchant_oid, status, total_amount, hash } = callback;

      // Hash calculation: merchant_oid + merchant_salt + status + total_amount
      const hashStr = merchant_oid + this.config.merchantSalt + status + total_amount;
      const expectedHash = crypto
        .createHmac('sha256', this.config.merchantKey)
        .update(hashStr)
        .digest('base64');

      console.log('PayTR Callback Hash Verification:', {
        merchant_oid,
        status,
        total_amount,
        receivedHash: hash,
        expectedHash,
        isValid: expectedHash === hash
      });

      return expectedHash === hash;

    } catch (error) {
      console.error('PayTR callback hash verification error:', error);
      return false;
    }
  }

  /**
   * Check if callback indicates successful payment
   */
  isPaymentSuccessful(callback: PayTRCallbackData): boolean {
    return callback.status === 'success';
  }

  /**
   * Get error message from failed callback
   */
  getErrorMessage(callback: PayTRCallbackData): string {
    if (callback.failed_reason_msg) {
      return callback.failed_reason_msg;
    }
    if (callback.failed_reason_code) {
      return `Payment failed with code: ${callback.failed_reason_code}`;
    }
    return 'Payment failed for unknown reason';
  }
}

/**
 * Create PayTR helper instance from environment variables
 */
export function createPayTRHelper(): PayTRHelper {
  const config: PayTRConfig = {
    merchantId: process.env.PAYTR_MERCHANT_ID!,
    merchantKey: process.env.PAYTR_MERCHANT_KEY!,
    merchantSalt: process.env.PAYTR_MERCHANT_SALT!,
    testMode: process.env.PAYTR_TEST_MODE === '1',
    merchantOkUrl: process.env.PAYTR_MERCHANT_OK_URL!,
    merchantFailUrl: process.env.PAYTR_MERCHANT_FAIL_URL!,
    language: process.env.PAYTR_LANGUAGE || 'tr',
    currency: process.env.PAYTR_CURRENCY || 'TL',
  };

  // Validate required environment variables
  const requiredVars = ['merchantId', 'merchantKey', 'merchantSalt', 'merchantOkUrl', 'merchantFailUrl'];
  for (const varName of requiredVars) {
    if (!config[varName as keyof PayTRConfig]) {
      throw new Error(`Missing required environment variable: PAYTR_${varName.toUpperCase()}`);
    }
  }

  return new PayTRHelper(config);
}

/**
 * Format amount for PayTR (convert to kuruş - multiply by 100)
 */
export function formatPayTRAmount(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Parse PayTR amount to number (divide by 100)
 */
export function parsePayTRAmount(amount: string): number {
  return parseFloat(amount) / 100;
}
