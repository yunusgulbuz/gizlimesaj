import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, CreditCard, Shield } from 'lucide-react';

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Sol taraf - Sepet özeti */}
            <div className="lg:col-span-2 space-y-6">
              {/* Güvenlik mesajı */}
              <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Güvenli Ödeme</p>
                    <p className="text-sm opacity-90">256-bit SSL şifreleme ile korunuyor</p>
                  </div>
                </div>
              </div>

              {/* Sepet öğeleri */}
              <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <ShoppingCart className="h-5 w-5 text-gray-400" />
                  <Skeleton className="h-6 w-32" />
                </div>
                
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>

              {/* Ödeme formu */}
              <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <Skeleton className="h-6 w-40" />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ taraf - Özet */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                <Skeleton className="h-6 w-32 mb-4" />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
                
                <Skeleton className="h-12 w-full mt-6" />
              </div>

              {/* Güven rozetleri */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <Skeleton className="h-5 w-32 mx-auto" />
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((badge) => (
                    <Skeleton key={badge} className="h-8 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}