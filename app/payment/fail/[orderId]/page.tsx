'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { XCircle, Loader2, RefreshCw } from 'lucide-react';

interface OrderData {
  id: string;
  status: string;
  buyer_email: string;
  total_amount: number;
  payment_response?: {
    failed_reason_msg?: string;
  };
  templates?: {
    title: string;
  };
}

export default function PaymentFailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          throw new Error('Sipariş bulunamadı');
        }

        const data = await response.json();
        setOrderData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Sipariş bilgileri alınırken bir hata oluştu');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const retryPayment = () => {
    if (orderData) {
      router.push(`/payment/${orderId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <Loader2 className="w-16 h-16 text-gray-500 mx-auto animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Yükleniyor...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bir Sorun Oluştu
          </h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <Link
            href="/"
            className="inline-block bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const failureMessage = orderData?.payment_response?.failed_reason_msg || 'Ödeme işlemi tamamlanamadı';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Failure Icon */}
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        </div>

        {/* Failure Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Ödeme Başarısız
        </h1>
        <p className="text-gray-600 mb-6">
          {failureMessage}
        </p>

        {/* Order Info */}
        {orderData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Sipariş No: <span className="font-mono font-semibold">{orderData.id}</span>
            </p>
            {orderData.templates && (
              <p className="text-sm text-gray-600">
                Şablon: <span className="font-semibold">{orderData.templates.title}</span>
              </p>
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-blue-800 font-medium mb-2">
            Ödemeniz neden başarısız olmuş olabilir?
          </p>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Kart limitiniz yetersiz olabilir</li>
            <li>Kart bilgileriniz yanlış girilmiş olabilir</li>
            <li>3D Secure doğrulaması tamamlanmamış olabilir</li>
            <li>İnternet bağlantınız kesilmiş olabilir</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={retryPayment}
            className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tekrar Dene</span>
          </button>

          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>

        {/* Contact Support */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Sorun devam ediyorsa,{' '}
            <a
              href="mailto:destek@birmesajmutluluk.com"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              müşteri hizmetleri
            </a>
            {' '}ile iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
}
