'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function AdminOrdersLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-2" variant="shimmer" />
          <Skeleton className="h-4 w-64" variant="pulse" />
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-32" variant="gradient" />
            <Skeleton className="h-10 w-40" variant="gradient" />
            <Skeleton className="h-10 w-28" variant="gradient" />
            <Skeleton className="h-10 w-36" variant="gradient" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-pink-100 p-4">
            <div className="grid grid-cols-6 gap-4">
              <Skeleton className="h-4 w-20" variant="shimmer" />
              <Skeleton className="h-4 w-24" variant="shimmer" />
              <Skeleton className="h-4 w-16" variant="shimmer" />
              <Skeleton className="h-4 w-20" variant="shimmer" />
              <Skeleton className="h-4 w-18" variant="shimmer" />
              <Skeleton className="h-4 w-16" variant="shimmer" />
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-pink-50">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="grid grid-cols-6 gap-4 items-center">
                  <Skeleton className="h-4 w-16" variant="pulse" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" variant="pulse" />
                    <Skeleton className="h-3 w-24" variant="shimmer" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" variant="gradient" />
                  <Skeleton className="h-4 w-20" variant="pulse" />
                  <Skeleton className="h-4 w-16" variant="pulse" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8 rounded" variant="gradient" />
                    <Skeleton className="h-8 w-8 rounded" variant="gradient" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <Skeleton className="h-4 w-32" variant="pulse" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-10 rounded" variant="gradient" />
            <Skeleton className="h-10 w-10 rounded" variant="gradient" />
            <Skeleton className="h-10 w-10 rounded" variant="gradient" />
            <Skeleton className="h-10 w-10 rounded" variant="gradient" />
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
              <span className="text-sm text-gray-600 font-medium">Siparişler yükleniyor...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}