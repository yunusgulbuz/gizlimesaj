'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, Home } from 'lucide-react';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Ödeme işlemi başarısız oldu';
  const code = searchParams.get('code') || '0';

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
          {decodeURIComponent(message)}
        </p>

        {/* Error Code */}
        {code !== '0' && (
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">
              Hata Kodu: <span className="font-mono font-semibold">{code}</span>
            </p>
          </div>
        )}

        {/* Common Error Messages */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">Olası Nedenler:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Kart bilgileri hatalı girildi</li>
            <li>• Kartınızda yeterli bakiye bulunmuyor</li>
            <li>• Kartınız online ödemelere kapalı</li>
            <li>• 3D Secure doğrulaması başarısız</li>
            <li>• Banka tarafından işlem reddedildi</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tekrar Dene</span>
          </button>

          <Link
            href="/"
            className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-sm text-gray-500">
          <p>Sorun devam ederse, lütfen bankanızla iletişime geçin.</p>
          <p className="mt-2">
            Destek için: <a href="mailto:destek@gizlimesaj.com" className="text-blue-500 hover:underline">destek@gizlimesaj.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}