import { Skeleton } from '@/components/ui/skeleton';
import { Heart, UserPlus, Shield } from 'lucide-react';

export default function RegisterLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo ve başlık */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-pulse"></div>
            <Heart className="absolute inset-0 m-auto h-8 w-8 text-white fill-white" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-8 w-56 mx-auto" />
            <Skeleton className="h-4 w-72 mx-auto" />
          </div>
        </div>

        {/* Register formu */}
        <div className="bg-white rounded-2xl shadow-xl border p-8 space-y-6">
          {/* Hoş geldin mesajı */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <UserPlus className="h-5 w-5 text-pink-600" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-52" />
              </div>
            </div>
          </div>

          {/* Form alanları */}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-12 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-4 mt-0.5" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-4 mt-0.5" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>
          </div>

          {/* Güvenlik bilgisi */}
          <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya</span>
              </div>
            </div>
            
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Alt link */}
          <div className="text-center space-y-2">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </div>

        {/* Loading animasyonu */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}