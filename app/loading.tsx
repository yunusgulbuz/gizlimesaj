'use client';

import { Heart } from 'lucide-react';
import { Skeleton, SkeletonCard, SkeletonText } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton variant="gradient" className="h-8 w-32" />
            <div className="flex items-center space-x-4">
              <Skeleton variant="shimmer" className="h-10 w-24 rounded-lg" />
              <Skeleton variant="shimmer" className="h-10 w-20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero section skeleton */}
        <div className="text-center space-y-6 mb-16">
          <div className="relative flex justify-center mb-8">
            {/* Ana logo animasyonu */}
            <div className="relative">
              {/* Dış halka - pulse */}
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 animate-ping"></div>

              {/* Orta halka - yavaş pulse */}
              <div className="absolute inset-2 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-40 animate-pulse"></div>

              {/* İç kalp - spin */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                <Heart className="relative h-12 w-12 text-white fill-white animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              HeartNote
            </h3>
            <p className="text-gray-600 font-medium">
              Duygularınız hazırlanıyor...
            </p>
            
            {/* Alt loading dots - senkronize */}
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>

            {/* İlerleme çubuğu */}
            <div className="flex justify-center mt-8">
              <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-shimmer bg-[length:200%_100%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-12">
          {/* Featured templates section */}
          <div className="space-y-6">
            <div className="text-center">
              <SkeletonText lines={1} className="mx-auto w-64" variant="gradient" />
              <div className="mt-2">
                <SkeletonText lines={1} className="mx-auto w-96" variant="shimmer" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>

          {/* How it works section */}
          <div className="space-y-8">
            <div className="text-center">
              <SkeletonText lines={1} className="mx-auto w-48" variant="gradient" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center space-y-4">
                  <Skeleton variant="gradient" className="w-16 h-16 rounded-full mx-auto" />
                  <SkeletonText lines={1} className="w-32 mx-auto" variant="shimmer" />
                  <SkeletonText lines={2} className="w-full" variant="default" />
                </div>
              ))}
            </div>
          </div>

          {/* Categories section */}
          <div className="space-y-6">
            <div className="text-center">
              <SkeletonText lines={1} className="mx-auto w-40" variant="gradient" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="shimmer" className="h-10 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}