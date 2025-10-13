'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, Home, RefreshCw } from 'lucide-react';

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reason = searchParams.get('reason') || 'unknown_error';
  const message = searchParams.get('message') || '';
  const orderId = searchParams.get('order_id');

  const getErrorMessage = (reason: string) => {
    switch (reason) {
      case 'invalid_hash':
        return 'Güvenlik hatası oluştu';
      case 'payment_failed':
        return message ? decodeURIComponent(message) : 'Ödeme işlemi başarısız';
      case 'order_creation_failed':
        return 'Sipariş oluşturulamadı';
      case 'page_creation_failed':
        return 'Sayfa oluşturulamadı';
      case 'server_error':
        return 'Sunucu hatası oluştu';
      default:
        return 'Bir hata oluştu';
    }
  };

  const handleRetry = () => {
    if (orderId) {
      router.push(`/payment/${orderId}`);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          İşlem Başarısız
        </h1>

        <p className="text-gray-600 mb-8">
          {getErrorMessage(reason)}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </button>

          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Sorun devam ederse{' '}
          <a href="mailto:destek@gizlimesaj.com" className="text-purple-600 hover:underline">
            destek ekibiyle
          </a>{' '}
          iletişime geçin
        </p>
      </div>
    </div>
  );
}
