'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const merchantOid = searchParams.get('merchant_oid');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOrderStatus = async () => {
      if (!merchantOid) {
        setError('Sipariş bilgisi bulunamadı');
        setLoading(false);
        return;
      }

      const supabase = createClient();

      // First, try to fetch the order immediately
      const fetchOrder = async () => {
        try {
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('id, short_id, status')
            .eq('payment_reference', merchantOid)
            .single();

          if (orderError) {
            console.error('Order fetch error:', orderError);
            return null;
          }

          return order;
        } catch (err) {
          console.error('Fetch order error:', err);
          return null;
        }
      };

      // Try immediate fetch first
      const initialOrder = await fetchOrder();

      if (initialOrder && initialOrder.status === 'completed' && initialOrder.short_id) {
        // Order is already completed, redirect to success page
        router.push(`/success/${initialOrder.short_id}`);
        return;
      }

      // If not completed yet, start polling (max 30 seconds)
      const maxAttempts = 30;
      let attempts = 0;

      const pollInterval = setInterval(async () => {
        attempts++;

        const order = await fetchOrder();

        if (order && order.status === 'completed' && order.short_id) {
          clearInterval(pollInterval);
          router.push(`/success/${order.short_id}`);
        } else if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setError('Sipariş işlemi tamamlanamadı. Lütfen müşteri hizmetleri ile iletişime geçin.');
          setLoading(false);
        }
      }, 1000); // Check every second

      return () => clearInterval(pollInterval);
    };

    checkOrderStatus();
  }, [merchantOid, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader2 className="w-16 h-16 text-green-500 mx-auto animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Siparişiniz Hazırlanıyor...
          </h2>
          <p className="text-gray-600">
            Lütfen bekleyin, kişisel mesaj sayfanız oluşturuluyor.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bir Hata Oluştu
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // This should never be reached as we always redirect
  return null;
}