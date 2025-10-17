'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface PayTRPaymentFormProps {
  token: string;
  onLoad?: () => void;
}

export function PayTRPaymentForm({ token, onLoad }: PayTRPaymentFormProps) {
  useEffect(() => {
    // This effect will run when the component mounts
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Güvenli Ödeme
          </h2>
          <p className="text-gray-600 text-sm">
            Ödeme işleminiz güvenli PayTR altyapısı ile korunmaktadır.
          </p>
        </div>

        {/* PayTR iFrame Resizer Script */}
        <Script
          src="https://www.paytr.com/js/iframeResizer.min.js"
          strategy="beforeInteractive"
          onLoad={() => {
            // Initialize iframe resizer after script loads
            if (typeof window !== 'undefined' && (window as any).iFrameResize) {
              (window as any).iFrameResize({}, '#paytriframe');
            }
          }}
        />

        {/* PayTR Payment iFrame */}
        <div className="w-full">
          <iframe
            src={`https://www.paytr.com/odeme/guvenli/${token}`}
            id="paytriframe"
            frameBorder="0"
            scrolling="no"
            style={{ width: '100%', minHeight: '500px' }}
            className="rounded-lg"
          />
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            256-bit SSL ile şifrelenmiş güvenli bağlantı
          </p>
        </div>
      </div>
    </div>
  );
}

// Also export a loading component for better UX
export function PayTRPaymentLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Ödeme Sayfası Hazırlanıyor
          </h2>
          <p className="text-gray-600 text-sm">
            Güvenli ödeme sayfasına yönlendiriliyorsunuz...
          </p>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>Bu işlem güvenli SSL bağlantısı ile korunmaktadır.</p>
        </div>
      </div>
    </div>
  );
}
