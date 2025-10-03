'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Calendar,
  Eye,
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  template_title: string;
  template_slug: string;
  recipient_name: string;
  amount: string;
  status: string;
  short_id: string | null;
  created_at: string;
  expires_at: string | null;
}

const statusConfig = {
  pending: { label: 'Beklemede', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Tamamlandı', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  failed: { label: 'Başarısız', icon: XCircle, color: 'bg-red-100 text-red-700' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          toast.error('Lütfen giriş yapın');
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            amount,
            status,
            created_at,
            expires_at,
            short_id,
            recipient_name,
            sender_name,
            templates (
              title,
              slug
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedOrders: Order[] = (data || []).map((order: any) => {
          const template = order.templates;

          return {
            id: order.id,
            template_title: template?.title || 'Bilinmeyen Şablon',
            template_slug: template?.slug || '',
            recipient_name: order.recipient_name || 'Bilinmeyen Alıcı',
            amount: order.amount || '0',
            status: order.status || 'pending',
            short_id: order.short_id || null,
            created_at: order.created_at,
            expires_at: order.expires_at || null,
          };
        });

        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Siparişler yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Siparişlerim</h1>
        <p className="mt-2 text-gray-600">Tüm siparişlerinizi buradan görüntüleyebilirsiniz</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Henüz siparişiniz yok
            </h3>
            <p className="mb-6 text-center text-gray-600">
              Sevdiklerinize özel mesajlar oluşturmaya başlayın
            </p>
            <Button asChild>
              <Link href="/templates">Şablonları İncele</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
            const statusLabel = statusConfig[order.status as keyof typeof statusConfig]?.label || order.status;
            const statusColor = statusConfig[order.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-700';

            return (
              <Card key={order.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{order.template_title}</CardTitle>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.created_at).toLocaleDateString('tr-TR')}
                        </span>
                        <span>•</span>
                        <span>Alıcı: {order.recipient_name}</span>
                      </div>
                    </div>
                    <Badge className={statusColor}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {statusLabel}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-sm text-gray-600">Tutar</p>
                      <p className="text-lg font-bold text-gray-900">
                        ₺{parseFloat(order.amount).toFixed(2)}
                      </p>
                    </div>

                    {order.status === 'completed' && order.short_id && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/m/${order.short_id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Görüntüle
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {order.expires_at && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-600">
                        <Clock className="mr-1 inline h-3 w-3" />
                        Erişim süresi: {new Date(order.expires_at).toLocaleDateString('tr-TR')} tarihine kadar
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
