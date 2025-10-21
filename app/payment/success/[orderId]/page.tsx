'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Copy, Share2, ExternalLink, Loader2 } from 'lucide-react';

interface OrderData {
  id: string;
  short_id: string;
  status: string;
  buyer_email: string;
  total_amount: number;
  templates?: {
    title: string;
  };
}

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max (30 * 1000ms)

    const checkOrderStatus = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          throw new Error('Sipariş bulunamadı');
        }

        const data = await response.json();

        // Check if personal page is created
        if (data.status === 'completed' && data.short_id) {
          setOrderData(data);
          setLoading(false);
          if (intervalId) {
            clearInterval(intervalId);
          }
        } else if (attempts >= maxAttempts) {
          setError('Mesaj sayfası oluşturulurken bir sorun oluştu. Lütfen müşteri hizmetleri ile iletişime geçin.');
          setLoading(false);
          if (intervalId) {
            clearInterval(intervalId);
          }
        }

        attempts++;
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Sipariş bilgileri alınırken bir hata oluştu');
        setLoading(false);
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    };

    // Initial check
    checkOrderStatus();

    // Poll every second
    intervalId = setInterval(checkOrderStatus, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [orderId]);

  const personalPageUrl = orderData?.short_id
    ? `${window.location.origin}/m/${orderData.short_id}`
    : '';

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
    copyToClipboard();
    window.open('https://www.instagram.com/', '_blank');
  };

  const shareTwitter = () => {
    const message = `Sana özel bir mesajım var!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(personalPageUrl)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <Loader2 className="w-16 h-16 text-purple-500 mx-auto animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ödemeniz Alındı!
          </h1>
          <p className="text-gray-600 mb-4">
            Kişisel mesaj sayfanız hazırlanıyor...
          </p>
          <p className="text-sm text-gray-500">
            Bu işlem birkaç saniye sürebilir.
          </p>
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
        {orderData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Sipariş No: <span className="font-mono font-semibold">{orderData.id}</span>
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
          {personalPageUrl && orderData && (
            <Link
              href={`/m/${orderData.short_id}`}
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
