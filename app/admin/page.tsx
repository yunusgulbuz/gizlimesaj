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
  Eye
} from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activePages: number;
  totalTemplates: number;
  recentOrders: Array<{
    id: string;
    recipient_name: string;
    template_title: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
}

async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient();

  // Get total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Get total revenue
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'paid');

  const totalRevenue = revenueData?.reduce((sum: number, order: any) => sum + order.total_amount, 0) || 0;

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
      total_amount,
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
    recentOrders: recentOrders?.map((order: any) => ({
      id: order.id,
      recipient_name: order.recipient_name,
      template_title: order.template?.title || 'Bilinmeyen Şablon',
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at
    })) || []
  };
}

function StatsCard({ title, value, description, icon: Icon, trend }: {
  title: string;
  value: string | number;
  description: string;
  icon: any;
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
      paid: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status === 'pending' ? 'Bekliyor' : status === 'paid' ? 'Ödendi' : 'Süresi Doldu'}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <p className="font-medium">{order.recipient_name}</p>
            <p className="text-sm text-muted-foreground">{order.template_title}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString('tr-TR')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">₺{order.total_amount}</p>
              {getStatusBadge(order.status)}
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
    <div className="container mx-auto p-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Paneli</h1>
          <p className="text-muted-foreground">Gizli Mesaj yönetim paneli</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/templates/new">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Şablon
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="h-4 w-4 mr-2" />
              Ayarlar
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" className="h-20" asChild>
          <Link href="/admin/orders" className="flex flex-col items-center gap-2">
            <CreditCard className="h-6 w-6" />
            <span>Siparişleri Yönet</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20" asChild>
          <Link href="/admin/templates" className="flex flex-col items-center gap-2">
            <FileText className="h-6 w-6" />
            <span>Şablonları Yönet</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20" asChild>
          <Link href="/admin/pages" className="flex flex-col items-center gap-2">
            <Users className="h-6 w-6" />
            <span>Kişisel Sayfalar</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20" asChild>
          <Link href="/admin/analytics" className="flex flex-col items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            <span>Analitik</span>
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