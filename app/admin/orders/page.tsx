import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { 
  Eye, 
  Search,
  Filter,
  Download,
  ArrowLeft
} from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';

interface Order {
  id: string;
  recipient_name: string;
  sender_name: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'expired';
  created_at: string;
  expires_at: string;
  template: {
    title: string;
    audience: string;
  };
  duration: {
    name: string;
    hours: number;
  };
}

async function getOrders(searchParams: { 
  search?: string; 
  status?: string; 
  page?: string; 
}): Promise<{ orders: Order[]; total: number }> {
  const supabase = await createServerSupabaseClient();
  
  let query = supabase
    .from('orders')
    .select(`
      *,
      template:templates(title, audience),
      duration:durations(name, hours)
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
    console.error('Error fetching orders:', error);
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
      paid: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      pending: 'Bekliyor',
      paid: 'Ödendi',
      expired: 'Süresi Doldu'
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
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{order.recipient_name}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Gönderen: {order.sender_name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{order.template.title}</span>
                  {getAudienceBadge(order.template.audience)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {order.duration.name} • {new Date(order.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-lg">₺{order.total_amount}</p>
                  <p className="text-xs text-muted-foreground">
                    Son: {new Date(order.expires_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/orders/${order.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Detay
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
  searchParams: { search?: string; status?: string; page?: string }
}) {
  const { orders, total } = await getOrders(searchParams);
  const currentPage = parseInt(searchParams.page || '1');
  const totalPages = Math.ceil(total / 20);

  // Breadcrumb items for admin orders page
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Siparişler' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Siparişler</h1>
            <p className="text-muted-foreground">{total} sipariş bulundu</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Dışa Aktar
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
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="İsim ile ara..."
                  defaultValue={searchParams.search}
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue={searchParams.status || 'all'}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="pending">Bekliyor</SelectItem>
                <SelectItem value="paid">Ödendi</SelectItem>
                <SelectItem value="expired">Süresi Doldu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <OrdersTable orders={orders} />
      </Suspense>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {currentPage > 1 && (
            <Button variant="outline" asChild>
              <Link href={`/admin/orders?page=${currentPage - 1}`}>
                Önceki
              </Link>
            </Button>
          )}
          <span className="flex items-center px-4">
            Sayfa {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Button variant="outline" asChild>
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