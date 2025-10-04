'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import HeaderAuthButton from '@/components/auth/header-auth-button';
import { MobileDrawerMenu } from '@/components/mobile-drawer-menu';
import {
  Heart,
  User,
  ShoppingBag,
  Lock,
  Star,
  Menu,
  X,
  LogOut,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

const menuItems = [
  {
    href: '/account/profile',
    label: 'Kişisel Bilgiler',
    icon: User,
  },
  {
    href: '/account/orders',
    label: 'Siparişlerim',
    icon: ShoppingBag,
  },
  {
    href: '/account/favorites',
    label: 'Favorilerim',
    icon: Heart,
  },
  {
    href: '/account/reviews',
    label: 'Değerlendirmelerim',
    icon: Star,
  },
  {
    href: '/account/password',
    label: 'Şifre Değiştir',
    icon: Lock,
  },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error('Bu sayfayı görüntülemek için giriş yapmalısınız');
        router.push('/login?redirect=' + pathname);
        return;
      }

      setUser(user);
      setUserEmail(user.email || '');
      setIsLoading(false);
    };

    checkAuth();
  }, [supabase, router, pathname]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Çıkış yapıldı');
      router.push('/');
    } catch (error) {
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-rose-600" />
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">birmesajmutluluk</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/templates" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                Sürprizler
              </Link>
              <Link href="/pricing" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                Planlar
              </Link>
              <Link href="/about" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                Hakkımızda
              </Link>
              <Link href="/contact" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                İletişim
              </Link>
              <div className="hidden md:block">
                <HeaderAuthButton />
              </div>
              <MobileDrawerMenu user={user} />
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <Card className="overflow-hidden">
              <div className="border-b bg-gradient-to-r from-rose-500 to-purple-600 p-6 text-white">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <User className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold">Hesabım</h2>
                <p className="mt-1 text-sm text-white/80">{userEmail}</p>
              </div>

              <nav className="p-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-rose-50 text-rose-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 border-t pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Çıkış Yap
                  </Button>
                </div>
              </nav>
            </Card>
          </aside>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="h-full w-80 bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="border-b bg-gradient-to-r from-rose-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Hesabım</h2>
                      <p className="mt-1 text-sm text-white/80">{userEmail}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <nav className="p-4">
                  <ul className="space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-rose-50 text-rose-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-4 border-t pt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Çıkış Yap
                    </Button>
                  </div>
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
