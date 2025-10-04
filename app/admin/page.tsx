import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp,
  Settings,
  Plus,
  Eye,
  LucideIcon
} from 'lucide-react';
import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activePages: number;
  totalTemplates: number;
  recentOrders: Array<{
    id: string;
    recipient_name: string;
    template_title: string;
    amount: number;
    status: string;
    created_at: string;
  }>;
}

interface Order {
  id: string;
  recipient_name: string;
  amount: number;
  status: string;
  created_at: string;
  template: {
    title: string;
  }[] | null;
}

async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createAuthSupabaseClient();

  // Get total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Get total revenue
  const { data: revenueData } = await supabase
    .from('orders')
    .select('amount')
    .eq('status', 'completed');

  const totalRevenue = revenueData?.reduce((sum: number, order: { amount: number }) => sum + order.amount, 0) || 0;

  // Get active pages
  const { count: activePages } = await supabase
    .from('personal_pages')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Get total templates
  const { count: totalTemplates } = await supabase
    .from('templates')
    .select('*', { count: 'exact', head: true });

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      id,
      recipient_name,
      amount,
      status,
      created_at,
      template:templates(title)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    totalOrders: totalOrders || 0,
    totalRevenue,
    activePages: activePages || 0,
    totalTemplates: totalTemplates || 0,
    recentOrders: recentOrders?.map((order: Order) => ({
      id: order.id,
      recipient_name: order.recipient_name,
      template_title: order.template?.[0]?.title || 'Bilinmeyen Şablon',
      amount: order.amount,
      status: order.status,
      created_at: order.created_at
    })) || []
  };
}

function StatsCard({ title, value, description, icon: Icon, trend }: {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center pt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentOrdersTable({ orders }: { orders: DashboardStats['recentOrders'] }) {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      canceled: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      pending: 'Bekliyor',
      completed: 'Tamamlandı',
      failed: 'Başarısız',
      canceled: 'İptal'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border rounded-lg gap-3 md:gap-0">
          <div className="space-y-1 flex-1">
            <div className="flex items-start justify-between md:block">
              <p className="font-medium text-sm md:text-base">{order.recipient_name}</p>
              <div className="md:hidden">
                {getStatusBadge(order.status)}
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">{order.template_title}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString('tr-TR')}
            </p>
          </div>
          <div className="flex items-center justify-between md:gap-4">
            <div className="flex items-center gap-3">
              <p className="font-medium text-sm md:text-base">₺{order.amount}</p>
              <div className="hidden md:block">
                {getStatusBadge(order.status)}
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/orders/${order.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  // Breadcrumb items for admin dashboard
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim' }
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Paneli</h1>
          <p className="text-muted-foreground text-sm md:text-base">Gizli Mesaj yönetim paneli</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="flex-1 md:flex-none">
            <Link href="/admin/templates/new">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Yeni Şablon</span>
              <span className="sm:hidden">Şablon</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex-1 md:flex-none">
            <Link href="/admin/settings">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Ayarlar</span>
              <span className="sm:hidden">Ayar</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Toplam Sipariş"
          value={stats.totalOrders}
          description="Tüm zamanlar"
          icon={CreditCard}
        />
        <StatsCard
          title="Toplam Gelir"
          value={`₺${stats.totalRevenue}`}
          description="Ödenen siparişler"
          icon={TrendingUp}
        />
        <StatsCard
          title="Aktif Sayfalar"
          value={stats.activePages}
          description="Şu anda aktif"
          icon={Users}
        />
        <StatsCard
          title="Şablonlar"
          value={stats.totalTemplates}
          description="Mevcut şablonlar"
          icon={FileText}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" className="h-20 md:h-24" asChild>
          <Link href="/admin/orders" className="flex flex-col items-center gap-1 md:gap-2">
            <CreditCard className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm text-center">Siparişleri Yönet</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 md:h-24" asChild>
          <Link href="/admin/templates" className="flex flex-col items-center gap-1 md:gap-2">
            <FileText className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm text-center">Şablonları Yönet</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 md:h-24" asChild>
          <Link href="/admin/pages" className="flex flex-col items-center gap-1 md:gap-2">
            <Users className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm text-center">Kişisel Sayfalar</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 md:h-24" asChild>
          <Link href="/admin/analytics" className="flex flex-col items-center gap-1 md:gap-2">
            <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm text-center">Analitik</span>
          </Link>
        </Button>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Son Siparişler</CardTitle>
          <CardDescription>En son gelen 5 sipariş</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Yükleniyor...</div>}>
            <RecentOrdersTable orders={stats.recentOrders} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}