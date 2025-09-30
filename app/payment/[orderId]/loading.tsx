import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Lock } from 'lucide-react';

export default function PaymentLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Güvenlik mesajı */}
        <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="h-6 w-6 animate-pulse" />
            <p className="font-semibold">Güvenli ödeme sayfası hazırlanıyor...</p>
            <Lock className="h-5 w-5" />
          </div>
        </div>

        {/* Ana kart */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
            <Skeleton className="h-8 w-48 mx-auto bg-white/30" />
          </div>

          {/* İçerik */}
          <div className="p-8 space-y-6">
            {/* Sipariş özeti */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>

            {/* Ödeme formu */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />

              {/* Kart bilgileri skeleton */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Buton */}
              <div className="pt-4">
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </div>

            {/* Alt bilgi */}
            <div className="flex items-center justify-center space-x-2 pt-4 border-t">
              <Lock className="h-4 w-4 text-gray-400" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>

        {/* Loading animasyonu */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <span className="text-sm font-medium">Şifreleniyor...</span>
          </div>
        </div>
      </div>
    </div>
  );
}