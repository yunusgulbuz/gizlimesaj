'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase-client';

interface SignOutButtonProps {
  label?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'ghost' | 'link' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  redirectTo?: string;
}

export default function SignOutButton({
  label = 'Çıkış Yap',
  className,
  variant = 'outline',
  size = 'sm',
  redirectTo = '/',
}: SignOutButtonProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign-out error:', error);
        toast.error('Çıkış yapılırken bir sorun oluştu');
        return;
      }

      const response = await fetch('/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event: 'SIGNED_OUT', session: null }),
      });

      if (!response.ok) {
        console.error('Session clear failed:', await response.text());
      }

      toast.success('Çıkış yapıldı');
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error('Sign-out unexpected error:', err);
      toast.error('Çıkış yapılırken beklenmeyen bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignOut}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
