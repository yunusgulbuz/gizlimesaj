import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import {
  Eye,
  Filter,
  Download,
  ArrowLeft
} from 'lucide-react';
import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';
import OrderFilters from './order-filters';

interface Order {
  id: string;
  recipient_name: string;
  sender_name: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  created_at: string;
  expires_at: string | null;
  template: {
    title: string;
    audience: string;
  } | null;
}

async function getOrders(searchParams: {
  search?: string;
  status?: string;
  page?: string;
}): Promise<{ orders: Order[]; total: number }> {
  const supabase = await createAuthSupabaseClient();
  
  let query = supabase
    .from('orders')
    .select(`
      id,
      recipient_name,
      sender_name,
      amount,
      status,
      created_at,
      expires_at,
      template:templates(title, audience)
    `, { count: 'exact' });

  // Apply filters
  if (searchParams.search) {
    query = query.or(`recipient_name.ilike.%${searchParams.search}%,sender_name.ilike.%${searchParams.search}%`);
  }

  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status);
  }

  // Pagination
  const page = parseInt(searchParams.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: orders, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching orders:', {
      error,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    return { orders: [], total: 0 };
  }

  return {
    orders: orders as Order[] || [],
    total: count || 0
  };
}

function OrdersTable({ orders }: { orders: Order[] }) {
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

  const getAudienceBadge = (audience: string) => {
    const variants = {
      teen: 'bg-blue-100 text-blue-800',
      adult: 'bg-green-100 text-green-800',
      classic: 'bg-gray-100 text-gray-800',
      fun: 'bg-yellow-100 text-yellow-800',
      elegant: 'bg-purple-100 text-purple-800'
    };

    const labels = {
      teen: 'Genç',
      adult: 'Yetişkin',
      classic: 'Klasik',
      fun: 'Eğlenceli',
      elegant: 'Zarif'
    };

    return (
      <Badge variant="outline" className={variants[audience as keyof typeof variants]}>
        {labels[audience as keyof typeof labels] || audience}
      </Badge>
    );
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-sm md:text-base">{order.recipient_name}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Gönderen: {order.sender_name || 'Bilinmiyor'}
                </p>
                {order.template && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs md:text-sm font-medium">{order.template.title}</span>
                    {getAudienceBadge(order.template.audience)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4">
                <div className="text-left md:text-right">
                  <p className="font-semibold text-base md:text-lg">₺{order.amount}</p>
                  {order.expires_at && (
                    <p className="text-xs text-muted-foreground">
                      Son: {new Date(order.expires_at).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/orders/${order.id}`}>
                    <Eye className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Detay</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>
}) {
  const params = await searchParams;
  const { orders, total } = await getOrders(params);
  const currentPage = parseInt(params.page || '1');
  const totalPages = Math.ceil(total / 20);

  // Breadcrumb items for admin orders page
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Siparişler' }
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Geri</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Siparişler</h1>
            <p className="text-xs md:text-sm text-muted-foreground">{total} sipariş bulundu</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="self-start md:self-auto">
          <Download className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Dışa Aktar</span>
          <span className="sm:hidden">Dışa Al</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderFilters />
        </CardContent>
      </Card>

      {/* Orders List */}
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <OrdersTable orders={orders} />
      </Suspense>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {currentPage > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/orders?page=${currentPage - 1}`}>
                Önceki
              </Link>
            </Button>
          )}
          <span className="flex items-center px-3 md:px-4 text-xs md:text-sm">
            Sayfa {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/orders?page=${currentPage + 1}`}>
                Sonraki
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}