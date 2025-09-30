'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function AdminPricingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" variant="shimmer" />
            <Skeleton className="h-4 w-80" variant="pulse" />
          </div>
          <Skeleton className="h-10 w-40 rounded-lg" variant="gradient" />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-6">
              {/* Plan Header */}
              <div className="text-center mb-6">
                <Skeleton className="h-6 w-24 mx-auto mb-2" variant="shimmer" />
                <div className="flex items-baseline justify-center space-x-1">
                  <Skeleton className="h-12 w-16" variant="gradient" />
                  <Skeleton className="h-6 w-8" variant="pulse" />
                </div>
                <Skeleton className="h-4 w-32 mx-auto mt-2" variant="pulse" />
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex items-center space-x-3">
                    <Skeleton className="h-5 w-5 rounded-full" variant="gradient" />
                    <Skeleton className="h-4 flex-1" variant="pulse" />
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Skeleton className="h-12 w-full rounded-lg" variant="gradient" />
            </div>
          ))}
        </div>

        {/* Settings Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-6 mb-6">
          <Skeleton className="h-6 w-32 mb-4" variant="shimmer" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" variant="pulse" />
                <Skeleton className="h-10 w-full" variant="gradient" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" variant="pulse" />
                <Skeleton className="h-10 w-full" variant="gradient" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-28 mb-2" variant="pulse" />
                <Skeleton className="h-10 w-full" variant="gradient" />
              </div>
              <div>
                <Skeleton className="h-4 w-36 mb-2" variant="pulse" />
                <Skeleton className="h-20 w-full" variant="gradient" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-6">
          <Skeleton className="h-6 w-40 mb-4" variant="shimmer" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-12 w-20 mx-auto mb-2" variant="gradient" />
                <Skeleton className="h-4 w-24 mx-auto" variant="pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        <div className="fixed bottom-8 right-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-pink-100">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">Fiyatlandırma yükleniyor...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}