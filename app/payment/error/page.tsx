import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface PaymentErrorPageProps {
  searchParams: Promise<{ reason?: string; message?: string }>;
}

export default async function PaymentErrorPage({ searchParams }: PaymentErrorPageProps) {
  const { reason = 'unknown_error', message = '' } = await searchParams;

  const getErrorInfo = (reason: string) => {
    switch (reason) {
      case 'invalid_hash':
        return {
          title: 'Güvenlik Hatası',
          description: 'Ödeme işlemi güvenlik kontrolünden geçemedi. Bu durum genellikle işlemin güvenilir olmadığını gösterir.',
          suggestion: 'Lütfen tekrar deneyin veya destek ekibiyle iletişime geçin.'
        };
      case 'payment_failed':
        return {
          title: 'Ödeme Başarısız',
          description: message ? decodeURIComponent(message) : 'Ödeme işlemi tamamlanamadı.',
          suggestion: 'Kart bilgilerinizi kontrol ederek tekrar deneyin.'
        };
      case 'order_creation_failed':
        return {
          title: 'Sipariş Oluşturulamadı',
          description: 'Ödeme başarılı olmasına rağmen sipariş kaydedilemedi.',
          suggestion: 'Lütfen destek ekibiyle iletişime geçin. Ödemeniz iade edilecektir.'
        };
      case 'page_creation_failed':
        return {
          title: 'Sayfa Oluşturulamadı',
          description: 'Kişisel mesaj sayfanız oluşturulamadı.',
          suggestion: 'Lütfen destek ekibiyle iletişime geçin.'
        };
      case 'server_error':
        return {
          title: 'Sunucu Hatası',
          description: 'Sistem hatası oluştu.',
          suggestion: 'Lütfen birkaç dakika sonra tekrar deneyin.'
        };
      default:
        return {
          title: 'Bilinmeyen Hata',
          description: 'Beklenmeyen bir hata oluştu.',
          suggestion: 'Lütfen destek ekibiyle iletişime geçin.'
        };
    }
  };

  const errorInfo = getErrorInfo(reason);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Warning Icon */}
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto" />
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {errorInfo.title}
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 mb-4">
          {errorInfo.description}
        </p>

        {/* Suggestion */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-800">
            <strong>Önerimiz:</strong> {errorInfo.suggestion}
          </p>
        </div>

        {/* Error Code */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            Hata Kodu: <span className="font-mono font-semibold">{reason}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Link
            href="javascript:history.back()"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tekrar Dene</span>
          </Link>

          <Link
            href="/"
            className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>

        {/* Support Info */}
        <div className="text-sm text-gray-500">
          <p>Bu hata devam ederse, lütfen aşağıdaki bilgilerle destek ekibiyle iletişime geçin:</p>
          <div className="mt-2 p-3 bg-gray-50 rounded text-left">
            <p><strong>Hata Kodu:</strong> {reason}</p>
            <p><strong>Zaman:</strong> {new Date().toLocaleString('tr-TR')}</p>
            {message && <p><strong>Detay:</strong> {decodeURIComponent(message)}</p>}
          </div>
          <p className="mt-3">
            <a href="mailto:destek@gizlimesaj.com" className="text-blue-500 hover:underline">
              destek@gizlimesaj.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}