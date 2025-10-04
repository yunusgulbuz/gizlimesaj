'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function PagesLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" variant="shimmer" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" variant="shimmer" />
            <Skeleton className="h-4 w-32" variant="pulse" />
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-40" variant="shimmer" />
                  <Skeleton className="h-5 w-20 rounded-full" variant="gradient" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-full" variant="pulse" />
                  <Skeleton className="h-4 w-full" variant="pulse" />
                </div>
                <Skeleton className="h-3 w-64" variant="pulse" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-28" variant="shimmer" />
                <Skeleton className="h-9 w-24" variant="shimmer" />
              </div>
            </div>
          </div>
        ))}
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
            <span className="text-sm text-gray-600 font-medium">Sayfalar yükleniyor...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
