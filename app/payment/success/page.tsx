'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Copy, Share2, ExternalLink, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const merchantOid = searchParams.get('merchant_oid');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shortId, setShortId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const personalPageUrl = shortId ? `${window.location.origin}/m/${shortId}` : '';

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
        // Order is already completed, show success immediately
        setShortId(initialOrder.short_id);
        setOrderId(initialOrder.id);
        setLoading(false);
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
          setShortId(order.short_id);
          setOrderId(order.id);
          setLoading(false);
        } else if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setError('Sipariş işlemi tamamlanamadı. Lütfen müşteri hizmetleri ile iletişime geçin.');
          setLoading(false);
        }
      }, 1000); // Check every second

      return () => clearInterval(pollInterval);
    };

    checkOrderStatus();
  }, [merchantOid]);

  const copyToClipboard = async () => {
    if (personalPageUrl) {
      await navigator.clipboard.writeText(personalPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const message = `Sana özel bir mesajım var! ${personalPageUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareInstagram = () => {
    // Instagram doesn't support direct URL sharing like WhatsApp/Twitter
    // We'll copy the URL and open Instagram, user can paste it in their story/post
    copyToClipboard();
    // Open Instagram web (mobile will redirect to app)
    window.open('https://www.instagram.com/', '_blank');
  };

  const shareTwitter = () => {
    const message = `Sana özel bir mesajım var!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(personalPageUrl)}`, '_blank');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Ödeme Başarılı! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Kişisel mesaj sayfanız hazırlandı ve artık paylaşabilirsiniz.
        </p>

        {/* Order Info */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Sipariş No: <span className="font-mono font-semibold">{orderId}</span>
            </p>
          </div>
        )}

        {/* Personal Page URL */}
        {personalPageUrl && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kişisel Mesaj Linkiniz:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={personalPageUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                title="Kopyala"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-1">✓ Kopyalandı!</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          {personalPageUrl && (
            <Link
              href={`/m/${shortId}`}
              className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mesajı Görüntüle</span>
            </Link>
          )}

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={shareWhatsApp}
              className="bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-xs">WhatsApp</span>
            </button>
            <button
              onClick={shareInstagram}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center justify-center space-x-1"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-xs">Instagram</span>
            </button>
            <button
              onClick={shareTwitter}
              className="bg-blue-400 text-white py-2 px-3 rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center space-x-1"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-xs">Twitter</span>
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}