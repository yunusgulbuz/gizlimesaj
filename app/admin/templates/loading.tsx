'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function AdminTemplatesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-8 w-40 mb-2" variant="shimmer" />
            <Skeleton className="h-4 w-64" variant="pulse" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" variant="gradient" />
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-40" variant="gradient" />
            <Skeleton className="h-10 w-32" variant="gradient" />
            <Skeleton className="h-10 w-28" variant="gradient" />
            <Skeleton className="h-10 w-36" variant="gradient" />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 overflow-hidden">
              {/* Template Preview */}
              <Skeleton className="h-48 w-full" variant="gradient" />
              
              {/* Template Info */}
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" variant="shimmer" />
                <Skeleton className="h-4 w-full" variant="pulse" />
                <Skeleton className="h-4 w-2/3" variant="pulse" />
                
                {/* Stats */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" variant="gradient" />
                    <Skeleton className="h-4 w-8" variant="pulse" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" variant="gradient" />
                    <Skeleton className="h-4 w-12" variant="pulse" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Skeleton className="h-8 w-16 rounded" variant="gradient" />
                  <Skeleton className="h-8 w-20 rounded" variant="gradient" />
                  <Skeleton className="h-8 w-8 rounded" variant="gradient" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <Skeleton className="h-4 w-40" variant="pulse" />
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
              <span className="text-sm text-gray-600 font-medium">Şablonlar yükleniyor...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}