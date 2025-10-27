'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { PayTRPaymentForm } from '@/components/ui/paytr-payment-form';

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
  payment_url?: string;
  payment_token?: string; // PayTR iframe token
  payment_type?: 'iframe'; // PayTR uses iframe
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

        const result: PaymentResponse = await response.json();

        if (!response.ok) {
          console.error('Payment API error:', result);
          throw new Error(result.error || 'Ödeme başlatılamadı');
        }

        if (result.success) {
          setPaymentData(result);
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Bir Sorun Oluştu</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center w-full">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 animate-spin" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Ödeme Hazırlanıyor</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8">
            Güvenli ödeme sayfasına yönlendiriliyorsunuz...
          </p>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-center">256-bit SSL güvenli bağlantı</span>
          </div>
        </div>
      </div>
    );
  }

  // Show PayTR iFrame
  if (paymentData?.payment_token) {
    return <PayTRPaymentForm token={paymentData.payment_token} />;
  }

  // Show payment error
  if (paymentData?.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Bilgi</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-2">{paymentData.error}</p>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Sipariş ID: {paymentData.order_id}
          </p>
          <button
            onClick={() => window.location.href = '/templates'}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            Şablonlara Dön
          </button>
        </div>
      </div>
    );
  }

  // Show generic error
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center w-full">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Bir Sorun Oluştu</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
        >
          Sayfayı Yenile
        </button>
      </div>
    </div>
  );
}