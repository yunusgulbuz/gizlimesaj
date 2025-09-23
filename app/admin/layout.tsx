import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Users, 
  Settings,
  TrendingUp,
  LogOut
} from 'lucide-react';

// Simple admin check - in production, implement proper authentication
async function checkAdminAccess() {
  // For now, we'll allow access. In production, implement proper auth check
  // const supabase = await createServerSupabaseClient();
  // Check if user is admin
  return true;
}

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
    name: 'Ayarlar',
    href: '/admin/settings',
    icon: Settings
  }
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAccess = await checkAdminAccess();
  
  if (!hasAccess) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
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
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
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
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}