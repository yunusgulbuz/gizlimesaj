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

        <p className="text-lg text-gray-700">
          Ödeme sayfasına yönlendiriyor
        </p>
      </div>
    </div>
  );
}