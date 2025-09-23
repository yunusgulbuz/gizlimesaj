import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-pulse"></div>
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-white animate-spin" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Yükleniyor...</h3>
            <p className="text-sm text-muted-foreground">
              Lütfen bekleyin, sayfa hazırlanıyor.
            </p>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}