'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-20" variant="shimmer" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" variant="shimmer" />
          <Skeleton className="h-4 w-64" variant="pulse" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" variant="pulse" />
              <Skeleton className="h-4 w-4 rounded-full" variant="gradient" />
            </div>
            <Skeleton className="h-8 w-20" variant="shimmer" />
            <Skeleton className="h-3 w-32" variant="pulse" />
          </div>
        ))}
      </div>

      {/* Top Templates */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <Skeleton className="h-6 w-48" variant="shimmer" />
          <Skeleton className="h-4 w-64 mt-2" variant="pulse" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" variant="gradient" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" variant="shimmer" />
                  <Skeleton className="h-3 w-24" variant="pulse" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-6 w-24" variant="shimmer" />
                <Skeleton className="h-3 w-20" variant="pulse" />
              </div>
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
            <span className="text-sm text-gray-600 font-medium">Analitik veriler yükleniyor...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
