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
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">Ödeme sayfası hazırlanıyor...</p>
          </div>
        )}

        {!isLoading && paymentData && paymentData.payment_form_data && paymentData.payment_url && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Güvenli Ödeme Sayfasına Yönlendiriliyorsunuz
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Paynkolay güvenli ödeme sayfasına yönlendirileceksiniz...
            </p>
            
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