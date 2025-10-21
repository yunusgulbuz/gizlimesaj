'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const merchantOid = searchParams.get('merchant_oid');

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('Ödeme işlemi başarısız oldu.');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!merchantOid) {
        setErrorMessage('Sipariş bilgisi bulunamadı.');
        setLoading(false);
        return;
      }

      const supabase = createClient();

      try {
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('id, payment_response')
          .eq('payment_reference', merchantOid)
          .single();

        if (orderError || !order) {
          console.error('Order fetch error:', orderError);
          setErrorMessage('Sipariş bilgileri alınamadı.');
          setLoading(false);
          return;
        }

        setOrderId(order.id);

        // Extract error message from payment response if available
        if (order.payment_response?.failed_reason_msg) {
          setErrorMessage(order.payment_response.failed_reason_msg);
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setErrorMessage('Bir hata oluştu. Lütfen müşteri hizmetleri ile iletişime geçin.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [merchantOid]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader2 className="w-16 h-16 text-red-500 mx-auto animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bilgiler Yükleniyor...
          </h2>
          <p className="text-gray-600">
            Lütfen bekleyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Ödeme Başarısız
        </h1>
        <p className="text-gray-600 mb-6">
          {errorMessage}
        </p>

        {/* Order Info */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Sipariş No: <span className="font-mono font-semibold">{orderId}</span>
            </p>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Ne yapabilirsiniz?</strong>
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1 text-left">
            <li>• Kart bilgilerinizi kontrol edin</li>
            <li>• Kartınızın limitini kontrol edin</li>
            <li>• Farklı bir kart deneyin</li>
            <li>• Daha sonra tekrar deneyin</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full block bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tekrar Dene
          </Link>

          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
