import { Skeleton } from '@/components/ui/skeleton';

export default function PreviewLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Üst kontroller */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </div>

          {/* Stil seçici */}
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-12 rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Ana önizleme */}
          <div className="bg-white rounded-xl shadow-xl p-8 border-2">
            <Skeleton className="w-full aspect-[3/4] rounded-lg" />
          </div>

          {/* Alt butonlar */}
          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <Skeleton className="h-12 flex-1 rounded-lg" />
          </div>

          {/* Loading mesajı */}
          <div className="text-center pt-4">
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <span className="text-sm font-medium">Önizleme oluşturuluyor...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}