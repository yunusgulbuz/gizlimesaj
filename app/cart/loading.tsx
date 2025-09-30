import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Heart } from 'lucide-react';

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <ShoppingBag className="h-8 w-8 text-pink-500" />
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Sol taraf - Sepet öğeleri */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sepet öğeleri */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-start space-x-4">
                    {/* Ürün görseli */}
                    <div className="relative">
                      <Skeleton className="h-24 w-24 rounded-lg" />
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg animate-pulse"></div>
                    </div>
                    
                    {/* Ürün bilgileri */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-full" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                        <div className="text-right space-y-1">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Önerilen ürünler */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <Skeleton className="h-6 w-40" />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ taraf - Sepet özeti */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                <Skeleton className="h-6 w-32 mb-4" />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Kupon kodu */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 space-y-3">
                <Skeleton className="h-5 w-28" />
                <div className="flex space-x-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>

              {/* Güvenlik mesajı */}
              <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-rose-500 rounded-full animate-pulse"></div>
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}