import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  TrendingUp,
  Eye,
  Users,
  DollarSign
} from 'lucide-react';
import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalPageViews: number;
  activePages: number;
  topTemplates: Array<{
    template_id: string;
    template_title: string;
    order_count: number;
    revenue: number;
  }>;
  recentPageViews: Array<{
    id: string;
    personal_page_id: string;
    viewed_at: string;
    ip: string | null;
  }>;
}

async function getAnalytics(): Promise<AnalyticsData> {
  const supabase = await createAuthSupabaseClient();

  // Total revenue
  const { data: orders } = await supabase
    .from('orders')
    .select('amount, status, template_id, template:templates(title)')
    .eq('status', 'completed');

  const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.amount) || 0), 0) || 0;
  const totalOrders = orders?.length || 0;

  // Page views
  const { count: totalPageViews } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true });

  // Active pages
  const { count: activePages } = await supabase
    .from('personal_pages')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Top templates by revenue
  const templateStats = new Map<string, { title: string; count: number; revenue: number }>();

  orders?.forEach((order: any) => {
    const templateId = order.template_id;
    const templateTitle = order.template?.title || 'Bilinmeyen';
    const amount = Number(order.amount) || 0;

    if (templateStats.has(templateId)) {
      const stats = templateStats.get(templateId)!;
      stats.count += 1;
      stats.revenue += amount;
    } else {
      templateStats.set(templateId, {
        title: templateTitle,
        count: 1,
        revenue: amount
      });
    }
  });

  const topTemplates = Array.from(templateStats.entries())
    .map(([template_id, stats]) => ({
      template_id,
      template_title: stats.title,
      order_count: stats.count,
      revenue: stats.revenue
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Recent page views
  const { data: recentPageViews } = await supabase
    .from('page_views')
    .select('id, personal_page_id, viewed_at, ip')
    .order('viewed_at', { ascending: false })
    .limit(10);

  return {
    totalRevenue,
    totalOrders,
    totalPageViews: totalPageViews || 0,
    activePages: activePages || 0,
    topTemplates,
    recentPageViews: recentPageViews || []
  };
}

function StatCard({ title, value, description, icon: Icon }: {
  title: string;
  value: string | number;
  description: string;
  icon: any;
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
      </CardContent>
    </Card>
  );
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Analitik' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Analitik</h1>
          <p className="text-muted-foreground">İstatistikler ve performans metrikleri</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam Gelir"
          value={`₺${analytics.totalRevenue.toFixed(2)}`}
          description="Tamamlanan siparişler"
          icon={DollarSign}
        />
        <StatCard
          title="Toplam Sipariş"
          value={analytics.totalOrders}
          description="Başarılı siparişler"
          icon={TrendingUp}
        />
        <StatCard
          title="Sayfa Görüntüleme"
          value={analytics.totalPageViews}
          description="Tüm sayfalar"
          icon={Eye}
        />
        <StatCard
          title="Aktif Sayfalar"
          value={analytics.activePages}
          description="Şu anda aktif"
          icon={Users}
        />
      </div>

      {/* Top Templates */}
      <Card>
        <CardHeader>
          <CardTitle>En Popüler Şablonlar</CardTitle>
          <CardDescription>Gelire göre en çok tercih edilen şablonlar</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.topTemplates.length > 0 ? (
            <div className="space-y-4">
              {analytics.topTemplates.map((template, index) => (
                <div key={template.template_id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                    <div>
                      <p className="font-medium">{template.template_title}</p>
                      <p className="text-sm text-muted-foreground">{template.order_count} sipariş</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₺{template.revenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Toplam gelir</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Henüz veri yok</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Page Views */}
      <Card>
        <CardHeader>
          <CardTitle>Son Sayfa Görüntülemeleri</CardTitle>
          <CardDescription>En son görüntülenen kişisel sayfalar</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentPageViews.length > 0 ? (
            <div className="space-y-2">
              {analytics.recentPageViews.map((view) => (
                <div key={view.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                  <div>
                    <span className="font-mono">#{view.personal_page_id.substring(0, 8)}</span>
                    {view.ip && <span className="text-muted-foreground ml-2">• {view.ip}</span>}
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(view.viewed_at).toLocaleString('tr-TR')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Henüz veri yok</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
