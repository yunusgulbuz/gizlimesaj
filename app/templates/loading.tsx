import { Skeleton, SkeletonCard, SkeletonText } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';

export default function TemplatesLoading() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-rose-200/60 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-purple-200/50 blur-3xl" />
        <div className="absolute left-1/2 bottom-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      {/* Header Skeleton */}
      <header className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-purple-600">
                <Heart className="h-5 w-5 text-white" />
              </span>
              <div className="flex flex-col">
                <Skeleton variant="shimmer" className="h-5 w-20 mb-1" />
                <Skeleton variant="default" className="h-3 w-24" />
              </div>
            </div>
            <div className="hidden items-center space-x-6 md:flex">
              <Skeleton variant="shimmer" className="h-4 w-16" />
              <Skeleton variant="shimmer" className="h-4 w-12" />
              <Skeleton variant="shimmer" className="h-4 w-14" />
              <Skeleton variant="gradient" className="h-10 w-20 rounded-lg" />
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section Skeleton */}
        <section className="container mx-auto px-4 pb-12 pt-10 sm:pb-14">
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Badge */}
              <Skeleton variant="gradient" className="h-6 w-40 rounded-full" />
              
              {/* Title */}
              <div className="space-y-3">
                <Skeleton variant="shimmer" className="h-12 w-full max-w-4xl" />
                <Skeleton variant="shimmer" className="h-12 w-3/4 max-w-3xl" />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Skeleton variant="default" className="h-6 w-full max-w-2xl" />
                <Skeleton variant="default" className="h-6 w-4/5 max-w-xl" />
              </div>

              {/* Highlight Cards */}
              <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="min-w-[220px] border-none bg-white/80 shadow-md backdrop-blur sm:min-w-0 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Skeleton variant="gradient" className="h-10 w-10 rounded-full flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton variant="shimmer" className="h-4 w-24" />
                        <Skeleton variant="default" className="h-3 w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Statistics Section */}
              <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Skeleton variant="gradient" className="h-4 w-4 rounded-full" />
                  <Skeleton variant="shimmer" className="h-4 w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton variant="gradient" className="h-4 w-4 rounded-full" />
                  <Skeleton variant="shimmer" className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton variant="gradient" className="h-4 w-4 rounded-full" />
                  <Skeleton variant="shimmer" className="h-4 w-28" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Sort Section */}
        <section className="container mx-auto px-4 pb-10">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Skeleton variant="gradient" className="h-4 w-4" />
                <Skeleton variant="shimmer" className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton variant="default" className="h-4 w-12" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} variant="shimmer" className="h-8 w-16 rounded-full" />
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="gradient" className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </section>

        {/* Template kartları grid */}
        <section className="container mx-auto px-4 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {/* Görsel skeleton */}
                <Skeleton variant="gradient" className="w-full aspect-square" />

                {/* İçerik skeleton */}
                <div className="p-4 space-y-3">
                  <SkeletonText lines={1} className="w-3/4" variant="shimmer" />
                  <SkeletonText lines={2} className="w-full" variant="default" />

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center space-x-2">
                      <Skeleton variant="gradient" className="h-5 w-5 rounded-full" />
                      <Skeleton variant="shimmer" className="h-4 w-16" />
                    </div>
                    <Skeleton variant="gradient" className="h-8 w-20 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading mesajı */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-3 text-gray-600 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <span className="text-sm font-medium bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                Şablonlar yükleniyor...
              </span>
            </div>
          </div>

          {/* İlerleme çubuğu */}
          <div className="mt-6 flex justify-center">
            <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 animate-shimmer bg-[length:200%_100%]"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}