'use client'

import { Skeleton, SkeletonCard, SkeletonText } from '@/components/ui/skeleton'

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" variant="shimmer" />
          <Skeleton className="h-4 w-96" variant="pulse" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" variant="pulse" />
                  <Skeleton className="h-8 w-16" variant="shimmer" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" variant="gradient" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-6">
            <Skeleton className="h-6 w-32 mb-4" variant="shimmer" />
            <Skeleton className="h-64 w-full" variant="pulse" />
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-6">
            <Skeleton className="h-6 w-32 mb-4" variant="shimmer" />
            <Skeleton className="h-64 w-full" variant="pulse" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-6">
          <Skeleton className="h-6 w-40 mb-4" variant="shimmer" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" variant="gradient" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" variant="pulse" />
                  <Skeleton className="h-3 w-1/2" variant="shimmer" />
                </div>
                <Skeleton className="h-4 w-16" variant="pulse" />
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
              <span className="text-sm text-gray-600 font-medium">Yönetim paneli yükleniyor...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}