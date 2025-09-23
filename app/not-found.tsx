import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold">404</span>
          </div>
          <CardTitle className="text-2xl">Sayfa Bulunamadı</CardTitle>
          <CardDescription className="text-base">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Ana Sayfaya Dön
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/templates">
                <Search className="h-4 w-4 mr-2" />
                Şablonları Keşfet
              </Link>
            </Button>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Eğer bu bir hata olduğunu düşünüyorsanız, lütfen{' '}
              <Link href="/contact" className="text-primary hover:underline">
                bizimle iletişime geçin
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}