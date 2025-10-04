'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Users,
  Settings,
  TrendingUp,
  LogOut,
  MessageSquare,
  FileQuestion,
  Loader2
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    name: 'Siparişler',
    href: '/admin/orders',
    icon: CreditCard
  },
  {
    name: 'Şablonlar',
    href: '/admin/templates',
    icon: FileText
  },
  {
    name: 'Fiyatlandırma',
    href: '/admin/pricing',
    icon: TrendingUp
  },
  {
    name: 'Kişisel Sayfalar',
    href: '/admin/pages',
    icon: Users
  },
  {
    name: 'Analitik',
    href: '/admin/analytics',
    icon: TrendingUp
  },
  {
    name: 'Özel Talepler',
    href: '/admin/requests',
    icon: FileQuestion
  },
  {
    name: 'Yorumlar',
    href: '/admin/comments',
    icon: MessageSquare
  },
  {
    name: 'Ayarlar',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  const handleNavigation = (href: string) => {
    if (pathname === href) return;

    setLoadingPath(href);
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GM</span>
            </div>
            <span className="font-semibold text-lg">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const isLoading = loadingPath === item.href && isPending;

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                disabled={isLoading}
                className={`
                  w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                  ${isLoading ? 'opacity-50 cursor-wait' : ''}
                `}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <item.icon className="h-5 w-5" />
                )}
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4 mr-2" />
              Ana Siteye Dön
            </Link>
          </Button>
        </div>
      </div>

      {/* Global Loading Bar */}
      {isPending && (
        <div className="fixed top-0 left-64 right-0 h-1 bg-gray-200 z-50">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 ease-out"
            style={{
              width: '70%',
              animation: 'loading-bar 1s ease-in-out infinite'
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
