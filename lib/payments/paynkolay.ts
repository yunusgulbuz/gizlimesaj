import crypto from 'crypto';

export interface PaynkolayFormData {
  sx: string;
  amount: string;
  clientRefCode: string;
  successUrl: string;
  failUrl: string;
  rnd: string;
  use3D: string;
  transactionType: string;
  language?: string;
  hashData: string;
  // Optional fields
  second?: string;
  cardcampaign?: string;
  bin?: string;
  detail?: string;
  agentCode?: string;
  instalments?: string;
  MerchantCustomerNo?: string;
  customerKey?: string;
  ECOMM_PLATFORM?: string;
  pIsCommissionPaidByCustomer?: string;
  currencyCode?: string;
  cardHolderIP?: string;
}

export interface PaynkolayConfig {
  sx: string;
  secretKey: string;
  baseUrl: string;
  successUrl: string;
  failUrl: string;
  use3D: boolean;
  transactionType: 'sales' | 'presales';
  language: string;
}

export interface PaynkolayPaymentRequest {
  amount: number;
  clientRefCode: string;
  customerKey?: string;
  merchantCustomerNo?: string;
  cardHolderIP?: string;
  instalments?: number;
  currencyCode?: string;
}

export interface PaynkolayResponse {
  RESPONSE_CODE: string;
  RESPONSE_DATA: string;
  USE_3D: string;
  RND: string;
  MERCHANT_NO: string;
  AUTH_CODE: string;
  REFERENCE_CODE: string;
  CLIENT_REFERENCE_CODE: string;
  TIMESTAMP: string;
  TRANSACTION_AMOUNT: string;
  AUTHORIZATION_AMOUNT: string;
  COMMISION: string;
  COMMISION_RATE: string;
  INSTALLMENT: string;
  hashData: string;
  hashDataV2: string;
  BANK_RESULT?: string;
}

/**
 * Paynkolay helper class for payment integration
 */
export class PaynkolayHelper {
  private config: PaynkolayConfig;

  constructor(config: PaynkolayConfig) {
    this.config = config;
  }

  /**
   * Generate random string for RND parameter
   */
  generateRnd(): string {
    return Date.now().toString();
  }

  /**
   * Calculate hash for payment request
   */
  calculateHash(
    sx: string,
    clientRefCode: string,
    amount: string,
    successUrl: string,
    failUrl: string,
    rnd: string,
    secretKey: string
  ): string {
    const hashString = `${sx}${clientRefCode}${amount}${successUrl}${failUrl}${rnd}${secretKey}`;
    const hash = crypto.createHash('sha1').update(hashString).digest('hex');
    return Buffer.from(hash, 'hex').toString('base64');
  }

  /**
   * Calculate hashDataV2 for payment request (SHA512 based)
   */
  calculateHashV2(
    sx: string,
    clientRefCode: string,
    amount: string,
    successUrl: string,
    failUrl: string,
    rnd: string,
    customerKey: string = '',
    secretKey: string
  ): string {
    const hashString = `${sx}|${clientRefCode}|${amount}|${successUrl}|${failUrl}|${rnd}|${customerKey}|${secretKey}`;
    return crypto.createHash('sha512').update(hashString, 'utf8').digest('base64');
  }

  /**
   * Verify response hash from Paynkolay
   */
  verifyResponseHash(response: PaynkolayResponse, secretKey: string): boolean {
    try {
      const {
        RESPONSE_CODE,
        CLIENT_REFERENCE_CODE,
        TRANSACTION_AMOUNT,
        AUTH_CODE,
        RND,
        hashData
      } = response;

      const expectedHashString = `${RESPONSE_CODE}${CLIENT_REFERENCE_CODE}${TRANSACTION_AMOUNT}${AUTH_CODE}${RND}${secretKey}`;
      const expectedHash = crypto.createHash('sha1').update(expectedHashString).digest('hex');
      const expectedHashBase64 = Buffer.from(expectedHash, 'hex').toString('base64');

      return expectedHashBase64 === hashData;
    } catch (error) {
      console.error('Error verifying response hash:', error);
      return false;
    }
  }

  /**
   * Create form data for Paynkolay payment
   */
  createPaymentFormData(request: PaynkolayPaymentRequest): PaynkolayFormData {
    const rnd = this.generateRnd();
    const amount = request.amount.toFixed(2);
    
    const hashData = this.calculateHash(
      this.config.sx,
      request.clientRefCode,
      amount,
      this.config.successUrl,
      this.config.failUrl,
      rnd,
      this.config.secretKey
    );

    const formData: PaynkolayFormData = {
      sx: this.config.sx,
      amount,
      clientRefCode: request.clientRefCode,
      successUrl: this.config.successUrl,
      failUrl: this.config.failUrl,
      rnd,
      use3D: this.config.use3D.toString(),
      transactionType: this.config.transactionType,
      language: this.config.language,
      hashData,
    };

    // Add optional fields if provided
    if (request.customerKey) {
      formData.customerKey = request.customerKey;
    }
    
    if (request.merchantCustomerNo) {
      formData.MerchantCustomerNo = request.merchantCustomerNo;
    }
    
    if (request.cardHolderIP) {
      formData.cardHolderIP = request.cardHolderIP;
    }
    
    if (request.instalments) {
      formData.instalments = request.instalments.toString();
    }
    
    if (request.currencyCode) {
      formData.currencyCode = request.currencyCode;
    }

    // Add platform identifier
    formData.ECOMM_PLATFORM = 'GizliMesaj';
    
    // Enable detailed form (for customer info collection)
    formData.detail = 'true';

    return formData;
  }

  /**
   * Check if payment response is successful
   */
  isPaymentSuccessful(response: PaynkolayResponse): boolean {
    return !!(
      response.RESPONSE_CODE === '2' &&
      response.AUTH_CODE &&
      response.AUTH_CODE !== '0' &&
      response.AUTH_CODE.trim() !== ''
    );
  }

  /**
   * Get payment error message from response
   */
  getErrorMessage(response: PaynkolayResponse): string {
    if (response.RESPONSE_CODE === '0') {
      return response.RESPONSE_DATA || 'Ödeme işlemi başarısız oldu.';
    }
    return 'Bilinmeyen hata oluştu.';
  }
}

/**
 * Create Paynkolay helper instance from environment variables
 */
export function createPaynkolayHelper(): PaynkolayHelper {
  const config: PaynkolayConfig = {
    sx: process.env.PAYNKOLAY_SX!,
    secretKey: process.env.PAYNKOLAY_SECRET_KEY!,
    baseUrl: process.env.PAYNKOLAY_BASE_URL!,
    successUrl: process.env.PAYNKOLAY_SUCCESS_URL!,
    failUrl: process.env.PAYNKOLAY_FAIL_URL!,
    use3D: process.env.PAYNKOLAY_USE_3D === 'true',
    transactionType: (process.env.PAYNKOLAY_TRANSACTION_TYPE as 'sales' | 'presales') || 'sales',
    language: process.env.PAYNKOLAY_LANGUAGE || 'tr',
  };

  // Validate required environment variables
  const requiredVars = ['sx', 'secretKey', 'baseUrl', 'successUrl', 'failUrl'];
  for (const varName of requiredVars) {
    if (!config[varName as keyof PaynkolayConfig]) {
      throw new Error(`Missing required environment variable: PAYNKOLAY_${varName.toUpperCase()}`);
    }
  }

  return new PaynkolayHelper(config);
}

/**
 * Format amount for Paynkolay (ensure 2 decimal places)
 */
export function formatPaynkolayAmount(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Parse Paynkolay amount to number
 */
export function parsePaynkolayAmount(amount: string): number {
  return parseFloat(amount);
}