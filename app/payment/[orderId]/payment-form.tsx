'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { PaynkolayFormData } from '@/lib/payments/paynkolay';

interface PaymentFormProps {
  order: {
    id: string;
    short_id: string;
    templates: {
      title: string;
      price: number;
    };
  };
}

interface PaymentResponse {
  success: boolean;
  order_id: string;
  payment_form_data?: PaynkolayFormData;
  payment_url?: string;
  amount: number;
  short_id: string;
  error?: string;
}

export default function PaymentForm({ order }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Call our API to get payment form data for existing order
        const response = await fetch('/api/payments/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: order.id
          }),
        });

        if (!response.ok) {
          throw new Error('Ödeme başlatılamadı');
        }

        const result: PaymentResponse = await response.json();
        
        if (result.success) {
          setPaymentData(result);
          
          // If we have payment form data, auto-submit after showing loading
          if (result.payment_form_data && result.payment_url) {
            setTimeout(() => {
              if (formRef.current) {
                formRef.current.submit();
              }
            }, 1500);
          }
        } else {
          throw new Error(result.error || 'Ödeme verileri alınamadı');
        }

      } catch (error) {
        console.error('Payment initialization error:', error);
        setError(error instanceof Error ? error.message : 'Ödeme başlatılamadı');
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [order.id]);

  return (
    <Card className="bg-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Ödeme İşlemi</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30 animate-pulse scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse scale-125 delay-75"></div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 animate-pulse">
                🔐 Güvenli Ödeme Hazırlanıyor
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-blue-700 font-medium">Bağlantı kuruluyor...</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-400 to-purple-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                  <span>SSL Güvenlik</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                  <span>3D Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                  <span>PCI DSS</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && paymentData && paymentData.payment_form_data && paymentData.payment_url && (
          <div className="text-center py-8">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20 animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                🔒 Güvenli Ödeme Sayfasına Yönlendiriliyorsunuz
              </h3>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <p className="text-gray-700 text-sm font-medium mb-2">
                  ✨ Paynkolay güvenli ödeme sistemine bağlanıyor...
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                  <span>256-bit SSL şifreleme aktif</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 space-y-1">
                <p>• Kart bilgileriniz güvenle korunur</p>
                <p>• 3D Secure doğrulama desteklenir</p>
                <p>• Anında ödeme onayı</p>
              </div>
            </div>
            
            {/* Hidden form for Paynkolay */}
            <form
              ref={formRef}
              method="POST"
              action={paymentData.payment_url}
              className="hidden"
            >
              <input type="hidden" name="sx" value={paymentData.payment_form_data.sx} />
              <input type="hidden" name="amount" value={paymentData.payment_form_data.amount} />
              <input type="hidden" name="clientRefCode" value={paymentData.payment_form_data.clientRefCode} />
              <input type="hidden" name="successUrl" value={paymentData.payment_form_data.successUrl} />
              <input type="hidden" name="failUrl" value={paymentData.payment_form_data.failUrl} />
              <input type="hidden" name="rnd" value={paymentData.payment_form_data.rnd} />
              <input type="hidden" name="use3D" value={paymentData.payment_form_data.use3D} />
              <input type="hidden" name="transactionType" value={paymentData.payment_form_data.transactionType} />
              {paymentData.payment_form_data.hashData && (
                <input type="hidden" name="hashData" value={paymentData.payment_form_data.hashData} />
              )}
              {paymentData.payment_form_data.hashDataV2 && (
                <input type="hidden" name="hashDataV2" value={paymentData.payment_form_data.hashDataV2} />
              )}
              
              {paymentData.payment_form_data.language && (
                <input type="hidden" name="language" value={paymentData.payment_form_data.language} />
              )}
              {paymentData.payment_form_data.customerKey && (
                <input type="hidden" name="customerKey" value={paymentData.payment_form_data.customerKey} />
              )}
              {paymentData.payment_form_data.MerchantCustomerNo && (
                <input type="hidden" name="MerchantCustomerNo" value={paymentData.payment_form_data.MerchantCustomerNo} />
              )}
              {paymentData.payment_form_data.cardHolderIP && (
                <input type="hidden" name="cardHolderIP" value={paymentData.payment_form_data.cardHolderIP} />
              )}
            </form>

            <button
              type="button"
              onClick={() => formRef.current?.submit()}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Ödeme Sayfasına Git
            </button>
          </div>
        )}

        {!isLoading && paymentData && paymentData.error && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ödeme Sistemi Geçici Olarak Kullanılamıyor
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {paymentData.error}
            </p>
            <p className="text-xs text-gray-500">
              Sipariş ID: {paymentData.order_id}
            </p>
          </div>
        )}

        {!isLoading && !paymentData && !error && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ödeme Başlatılamadı
            </h3>
            <p className="text-gray-600 text-sm">
              Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Lock className="h-3 w-3" />
          <span>256-bit SSL ile güvenli ödeme</span>
        </div>
      </CardContent>
    </Card>
  );
}