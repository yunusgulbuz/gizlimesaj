'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase-client';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const syncServerSession = async (session: Session) => {
    try {
      const response = await fetch('/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event: 'SIGNED_IN', session }),
      });

      if (!response.ok) {
        console.error('Session sync failed:', await response.text());
      }
    } catch (error) {
      console.error('Session sync error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error('E-posta veya şifre hatalı');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Lütfen e-posta adresinizi doğrulayın');
        } else {
          toast.error('Giriş yapılırken bir hata oluştu');
        }
        return;
      }

      if (data.user) {
        toast.success('Başarıyla giriş yapıldı!');

        if (data.session) {
          await syncServerSession(data.session);
        }
        
        // Check if user is admin
        const { data: adminData } = await supabase
          .from('admins')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (adminData) {
          router.push('/admin');
        } else {
          router.push('/');
        }

        router.refresh();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Beklenmeyen bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Lütfen e-posta adresinizi girin');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error('Şifre sıfırlama e-postası gönderilemedi');
        return;
      }

      toast.success('Şifre sıfırlama e-postası gönderildi');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Bir hata oluştu');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          E-posta Adresi
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-11"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Şifre
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 h-11"
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-pink-600 hover:text-pink-500 transition-colors"
          disabled={isLoading}
        >
          Şifremi Unuttum
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Giriş Yapılıyor...
          </>
        ) : (
          'Giriş Yap'
        )}
      </Button>
    </form>
  );
}
