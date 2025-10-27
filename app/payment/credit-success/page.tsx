'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

export default function CreditSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [userCredits, setUserCredits] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        // Get order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;
        setOrder(orderData);

        // Get user credits
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: creditsData } = await supabase
            .from('user_ai_credits')
            .select('*')
            .eq('user_id', user.id)
            .single();

          setUserCredits(creditsData);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [orderId, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!order || !orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sipariş Bulunamadı</h1>
          <p className="text-gray-600 mb-6">
            Sipariş bilgilerine ulaşılamadı.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Paketlere Dön
          </Link>
        </div>
      </div>
    );
  }

  const credits = order.text_fields?.credits || 0;
  const packageName = order.text_fields?.package_name || 'AI Kredi Paketi';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Ödeme Başarılı!</h1>
            <p className="text-purple-100">
              AI krediniz başarıyla hesabınıza eklendi
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Credits Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Satın Alınan Paket</h3>
                    <p className="text-sm text-gray-600">{packageName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">
                    +{credits}
                  </div>
                  <p className="text-sm text-gray-600">AI Kredisi</p>
                </div>
              </div>

              {userCredits && (
                <div className="pt-4 border-t border-purple-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Toplam Krediniz:</span>
                    <span className="text-lg font-semibold text-purple-600">
                      {userCredits.remaining_credits} AI Kredisi
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sipariş No:</span>
                <span className="font-medium text-gray-900">{order.short_id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tutar:</span>
                <span className="font-medium text-gray-900">₺{order.total_try}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Durum:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ödeme Başarılı
                </span>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong>💡 Bilgi:</strong> AI kredileriniz asla bitmez ve süresiz kullanabilirsiniz.
                Her AI template oluşturma veya düzenleme işlemi 1 kredi harcar.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/ai-template-creator"
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center px-6 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Sparkles className="inline-block w-5 h-5 mr-2" />
                AI Tasarım Oluştur
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/my-ai-templates"
                  className="block text-center px-4 py-3 border-2 border-purple-200 text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  Tasarımlarım
                </Link>
                <Link
                  href="/pricing"
                  className="block text-center px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Daha Fazla Kredi
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sorularınız mı var?{' '}
            <Link href="/contact" className="text-purple-600 hover:text-purple-700 font-medium">
              Bizimle iletişime geçin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
