import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import GoogleAuthButton from '@/components/auth/google-auth-button';
import LoginForm from './login-form';

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-900">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Hoş Geldiniz
            </CardTitle>
            <CardDescription className="text-gray-600">
              Gizli Mesaj hesabınıza giriş yapın
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Suspense fallback={<div className="animate-pulse">Yükleniyor...</div>}>
              <LoginForm />
            </Suspense>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">veya</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <GoogleAuthButton className="w-full" />
            </div>

            {/* Sign up link */}
            <div className="text-center text-sm text-gray-600">
              Hesabınız yok mu?{' '}
              <Link href="/register" className="font-medium text-pink-600 hover:text-pink-500 transition-colors">
                Kayıt Olun
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            Giriş yaparak{' '}
            <Link href="/terms" className="underline hover:text-gray-700">
              Kullanım Şartları
            </Link>{' '}
            ve{' '}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Gizlilik Politikası
            </Link>
            &apos;nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}
