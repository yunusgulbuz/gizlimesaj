'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-20" variant="shimmer" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" variant="shimmer" />
          <Skeleton className="h-4 w-56" variant="pulse" />
        </div>
      </div>

      {/* Settings Cards */}
      <div className="space-y-6 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border">
            <div className="p-6 border-b space-y-2">
              <Skeleton className="h-6 w-48" variant="shimmer" />
              <Skeleton className="h-4 w-64" variant="pulse" />
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" variant="pulse" />
                <Skeleton className="h-10 w-full" variant="shimmer" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" variant="pulse" />
                <Skeleton className="h-10 w-full" variant="shimmer" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" variant="pulse" />
                <Skeleton className="h-10 w-full" variant="shimmer" />
              </div>
            </div>
          </div>
        ))}

        {/* Save Button */}
        <div className="flex justify-end">
          <Skeleton className="h-11 w-40" variant="gradient" />
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
            <span className="text-sm text-gray-600 font-medium">Ayarlar yükleniyor...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
