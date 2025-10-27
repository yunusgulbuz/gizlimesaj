'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { CreditCard, Lock } from 'lucide-react';

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
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="w-full max-w-5xl mx-auto bg-white shadow-2xl flex-1 flex flex-col my-4 rounded-2xl overflow-hidden">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">
              Güvenli Ödeme
            </h2>
          </div>
          <p className="text-purple-100 text-xs">
            PayTR güvenli altyapısı ile korunmaktadır
          </p>
        </div>

        {/* PayTR iFrame Resizer Script */}
        <Script
          src="https://www.paytr.com/js/iframeResizer.min.js"
          strategy="beforeInteractive"
          onLoad={() => {
            // Initialize iframe resizer after script loads
            if (typeof window !== 'undefined' && (window as any).iFrameResize) {
              (window as any).iFrameResize({
                log: false,
                checkOrigin: false,
                heightCalculationMethod: 'taggedElement',
                minHeight: 1000,
                autoResize: true,
                sizeHeight: true,
                sizeWidth: false,
                tolerance: 50
              }, '#paytriframe');
            }
          }}
        />

        {/* PayTR Payment iFrame - Full screen */}
        <div className="flex-1 w-full relative overflow-auto" style={{ minHeight: '1000px', maxHeight: 'calc(100vh - 200px)' }}>
          <iframe
            src={`https://www.paytr.com/odeme/guvenli/${token}`}
            id="paytriframe"
            frameBorder="0"
            scrolling="no"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '1000px',
              border: 'none'
            }}
            className="bg-white"
          />
        </div>

        {/* Compact Footer */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-2">
            <Lock className="w-3.5 h-3.5 text-green-600" />
            <span className="font-medium">256-bit SSL</span>
            <span className="text-gray-400">•</span>
            <span className="hidden sm:inline">Güvenli bağlantı</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              PCI-DSS
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              3D Secure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component is no longer exported - handled in payment-form.tsx
