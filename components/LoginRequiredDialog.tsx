'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginRequiredDialog({
  open,
  onOpenChange,
}: LoginRequiredDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Giriş Yapın</DialogTitle>
          <DialogDescription>
            Satın alma işlemi için önce giriş yapmanız gerekmektedir
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          <Button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
            size="lg"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Giriş Yap
          </Button>

          <Button
            onClick={handleSignup}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Hesap Oluştur
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500">
          Giriş yaparak <span className="text-rose-500">kullanım koşullarını</span> ve{' '}
          <span className="text-rose-500">gizlilik politikasını</span> kabul etmiş olursunuz
        </p>
      </DialogContent>
    </Dialog>
  );
}
