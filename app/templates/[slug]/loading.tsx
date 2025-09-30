import { Skeleton } from '@/components/ui/skeleton';

export default function TemplateDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header skeleton - Heartnote Studio branding */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section - Template info */}
          <section className="mb-8">
            <div className="mx-auto max-w-4xl text-center">
              {/* Category badges */}
              <div className="mb-4 flex flex-wrap justify-center gap-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
              
              {/* Title and description */}
              <Skeleton className="mx-auto mb-4 h-10 w-3/4" />
              <Skeleton className="mx-auto mb-6 h-5 w-2/3" />
              
              {/* Rating and comments */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600 md:text-sm">
                <div className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 shadow-sm ring-1 ring-white/60">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-3 w-3 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 shadow-sm ring-1 ring-white/60">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
          </section>

          {/* ResizableLayout skeleton - Form and Preview */}
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Form Section */}
              <div className="space-y-6">
                {/* Form card */}
                <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-md backdrop-blur">
                  <Skeleton className="mb-6 h-7 w-48" />
                  
                  {/* Form fields */}
                  <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </div>
                    ))}
                    
                    {/* Duration and pricing */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </div>
                    </div>
                    
                    {/* Submit button */}
                    <div className="pt-4">
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-6">
                {/* Preview card */}
                <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-md backdrop-blur">
                  <div className="mb-4 flex items-center justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                  
                  {/* Preview content */}
                  <div className="aspect-[3/4] w-full">
                    <Skeleton className="h-full w-full rounded-lg" />
                  </div>
                  
                  {/* Preview controls */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
                
                {/* Design styles */}
                <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-md backdrop-blur">
                  <Skeleton className="mb-4 h-6 w-32" />
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="rounded-lg border p-3">
                        <Skeleton className="mb-2 h-5 w-20" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <section className="mt-8">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-md backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
                
                {/* Comment items */}
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="mb-2 flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Skeleton key={j} className="h-3 w-3 rounded-full" />
                          ))}
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="mt-1 h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Loading message */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <span className="text-sm font-medium">Şablon hazırlanıyor...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}