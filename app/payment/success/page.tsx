'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Copy, Share2, ExternalLink } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const shortId = searchParams.get('shortId');
  const orderId = searchParams.get('orderId');
  const [copied, setCopied] = useState(false);

  const personalPageUrl = shortId ? `${window.location.origin}/m/${shortId}` : '';

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

  const shareTwitter = () => {
    const message = `Sana özel bir mesajım var!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(personalPageUrl)}`, '_blank');
  };

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

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareWhatsApp}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={shareTwitter}
              className="bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Twitter</span>
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