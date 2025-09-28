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
  hashData?: string;
  hashDataV2?: string;
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
  CURRENCY_CODE?: string; // Paynkolay response'ında bu parametre olmayabilir
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
   * Generate random string for RND parameter - formatted as dd.mm.yyyy HH:MM:SS
   */
  generateRnd(): string {
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, '0');

    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1); // Months are 0-indexed
    const year = now.getFullYear();

    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Calculate hash for payment request (SHA1 based) - Paynkolay dokümantasyonuna göre düzeltildi
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
    // Paynkolay dokümantasyonuna göre: sx + clientRefCode + amount + successUrl + failUrl + rnd + merchantSecretKey
    const hashString = `${sx}${clientRefCode}${amount}${successUrl}${failUrl}${rnd}${secretKey}`;
    console.log('Hash hesaplama için kullanılan string:', hashString);
    
    const hash = crypto.createHash('sha1').update(hashString, 'utf8').digest('hex');
    const hashBase64 = Buffer.from(hash, 'hex').toString('base64');
    
    console.log('Hesaplanan hash (hex):', hash);
    console.log('Hesaplanan hash (base64):', hashBase64);
    
    return hashBase64;
  }

  /**
   * Calculate hashDataV2 for payment request (SHA512 based) - Updated to match documentation
   */
  calculateHashV2(
    sx: string,
    clientRefCode: string,
    amount: string,
    successUrl: string,
    failUrl: string,
    rnd: string,
    customerKey: string = '',
    cardHolderIP: string = '',
    secretKey: string
  ): string {
    // PHP örneğine göre: sx|clientRefCode|amount|successUrl|failUrl|rnd|customerKey|secretKey (cardHolderIP dahil değil)
    const hashString = `${sx}|${clientRefCode}|${amount}|${successUrl}|${failUrl}|${rnd}|${customerKey}|${secretKey}`;
    
    console.log('HashV2 hesaplama için kullanılan string:', hashString);
    
    // SHA-512 hash hesapla ve base64 encode et
    const hash = crypto.createHash('sha512');
    hash.update(hashString, 'utf-8');
    const hashDataV2 = hash.digest('base64');
    
    console.log('Hesaplanan hashDataV2:', hashDataV2);
    
    return hashDataV2;
  }

  /**
   * Verify response hash from Paynkolay (Paynkolay dokümantasyonuna göre düzeltildi)
   */
  verifyResponseHash(response: PaynkolayResponse, secretKey: string): boolean {
    try {
      const {
        MERCHANT_NO,
        REFERENCE_CODE,
        AUTH_CODE,
        RESPONSE_CODE,
        USE_3D,
        RND,
        INSTALLMENT,
        AUTHORIZATION_AMOUNT,
        CURRENCY_CODE,
        hashDataV2
      } = response;

      // Paynkolay dokümantasyonuna göre hashDataV2 için: MERCHANT_NO|REFERENCE_CODE|AUTH_CODE|RESPONSE_CODE|USE_3D|RND|INSTALLMENT|AUTHORIZATION_AMOUNT|CURRENCY_CODE|MERCHANT_SECRET_KEY
      // Boş değerler için varsayılan değerler kullan - dokümantasyona göre boş değerler boş string olarak kalmalı
      const authCode = AUTH_CODE || '';
      const authAmount = AUTHORIZATION_AMOUNT || '';
      const installment = INSTALLMENT || '';
      // CURRENCY_CODE response'da yoksa TRY kullan
      const currencyCode = CURRENCY_CODE || 'TRY';
      
      const expectedHashString = `${MERCHANT_NO}|${REFERENCE_CODE}|${authCode}|${RESPONSE_CODE}|${USE_3D}|${RND}|${installment}|${authAmount}|${currencyCode}|${secretKey}`;
      
      console.log('HashDataV2 doğrulama için kullanılan string:', expectedHashString);
      console.log('Gelen response parametreleri:', {
        MERCHANT_NO,
        REFERENCE_CODE,
        AUTH_CODE,
        RESPONSE_CODE,
        USE_3D,
        RND,
        INSTALLMENT,
        AUTHORIZATION_AMOUNT,
        CURRENCY_CODE
      });
      
      // SHA512 kullanarak hash hesapla ve base64'e çevir
      const expectedHashV2 = crypto.createHash('sha512').update(expectedHashString, 'utf8').digest('base64');

      console.log('Beklenen hashDataV2:', expectedHashV2);
      console.log('Gelen hashDataV2:', hashDataV2);

      return expectedHashV2 === hashDataV2;
    } catch (error) {
      console.error('HashDataV2 doğrulama hatası:', error);
      return false;
    }
  }

  /**
   * Create form data for Paynkolay payment - Updated to use hashDataV2
   */
  createPaymentFormData(request: PaynkolayPaymentRequest): PaynkolayFormData {
    const rnd = this.generateRnd();
    const amount = request.amount.toFixed(2);
    const customerKey = request.customerKey || '';
    const cardHolderIP = request.cardHolderIP || '';
    
    console.log('=== PAYMENT FORM DATA CREATION ===');
    console.log('sx:', this.config.sx);
    console.log('clientRefCode:', request.clientRefCode);
    console.log('amount:', amount);
    console.log('successUrl:', this.config.successUrl);
    console.log('failUrl:', this.config.failUrl);
    console.log('rnd:', rnd);
    console.log('customerKey:', customerKey);
    console.log('secretKey:', this.config.secretKey);
    
    const hashDataV2 = this.calculateHashV2(
      this.config.sx,
      request.clientRefCode,
      amount,
      this.config.successUrl,
      this.config.failUrl,
      rnd,
      customerKey,
      '', // cardHolderIP hash hesaplamada kullanılmıyor
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
      hashDataV2,
    };

    console.log('Final form data:', formData);

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