import { Loader2 } from 'lucide-react';

export default function PaymentLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">
            Ödeme sayfası hazırlanıyor
          </h3>
          <p className="text-sm text-gray-600">Lütfen bekleyin...</p>
        </div>
      </div>
    </div>
  );
}