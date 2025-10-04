import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  CreditCard,
  User,
  Package,
  Calendar,
  Mail,
  ExternalLink,
  FileText,
  Music,
  Palette
} from 'lucide-react';
import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';
import OrderStatusUpdater from './order-status-updater';

interface OrderDetails {
  id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  buyer_email: string | null;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  payment_provider: 'iyzico' | 'stripe' | 'paynkolay';
  payment_reference: string | null;
  payment_response: any;
  special_date: string | null;
  design_style: string;
  bg_audio_url: string | null;
  text_fields: any;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  expires_at: string | null;
  short_id: string | null;
  template: {
    id: string;
    title: string;
    slug: string;
    audience: string;
  } | null;
  personal_pages: Array<{
    id: string;
    short_id: string;
    is_active: boolean;
    expires_at: string;
  }>;
}

async function getOrderDetails(orderId: string): Promise<OrderDetails | null> {
  const supabase = await createAuthSupabaseClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      template:templates(id, title, slug, audience),
      personal_pages(id, short_id, is_active, expires_at)
    `)
    .eq('id', orderId)
    .single();

  if (error || !order) {
    console.error('Error fetching order:', error);
    return null;
  }

  return order as OrderDetails;
}

const statusConfig = {
  pending: {
    label: 'Bekliyor',
    className: 'bg-yellow-100 text-yellow-800',
    description: 'Ödeme bekleniyor'
  },
  completed: {
    label: 'Tamamlandı',
    className: 'bg-green-100 text-green-800',
    description: 'Ödeme alındı ve sayfa oluşturuldu'
  },
  failed: {
    label: 'Başarısız',
    className: 'bg-red-100 text-red-800',
    description: 'Ödeme başarısız oldu'
  },
  canceled: {
    label: 'İptal Edildi',
    className: 'bg-gray-100 text-gray-800',
    description: 'Sipariş iptal edildi'
  }
};

const audienceLabels = {
  teen: { label: "Genç", color: "bg-blue-100 text-blue-800" },
  adult: { label: "Yetişkin", color: "bg-green-100 text-green-800" },
  classic: { label: "Klasik", color: "bg-gray-100 text-gray-800" },
  fun: { label: "Eğlenceli", color: "bg-yellow-100 text-yellow-800" },
  elegant: { label: "Zarif", color: "bg-purple-100 text-purple-800" }
};

export default async function OrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const order = await getOrderDetails(id);

  if (!order) {
    notFound();
  }

  const status = statusConfig[order.status];
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Siparişler', href: '/admin/orders' },
    { label: `Sipariş #${order.short_id || id.substring(0, 8)}` }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Sipariş Detayları</h1>
            <p className="text-muted-foreground">#{order.short_id || id}</p>
          </div>
        </div>
        <Badge className={status.className}>
          {status.label}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Sipariş Bilgileri
            </CardTitle>
            <CardDescription>{status.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Sipariş Tarihi</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleString('tr-TR')}</p>
              </div>
              {order.paid_at && (
                <div>
                  <p className="text-sm text-muted-foreground">Ödeme Tarihi</p>
                  <p className="font-medium">{new Date(order.paid_at).toLocaleString('tr-TR')}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Toplam Tutar</p>
                <p className="font-medium text-lg">₺{order.amount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ödeme Yöntemi</p>
                <p className="font-medium uppercase">{order.payment_provider}</p>
              </div>
            </div>

            {order.payment_reference && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Ödeme Referansı</p>
                  <p className="font-mono text-sm">{order.payment_reference}</p>
                </div>
              </>
            )}

            {order.expires_at && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Son Geçerlilik Tarihi</p>
                  <p className="font-medium">{new Date(order.expires_at).toLocaleString('tr-TR')}</p>
                </div>
              </>
            )}

            <Separator />
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Müşteri Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Alıcı Adı</p>
              <p className="font-medium">{order.recipient_name}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Gönderen Adı</p>
              <p className="font-medium">{order.sender_name}</p>
            </div>
            {order.buyer_email && (
              <>
                <Separator />
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{order.buyer_email}</p>
                  </div>
                </div>
              </>
            )}
            {order.special_date && (
              <>
                <Separator />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Özel Tarih</p>
                    <p className="font-medium">{order.special_date}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Template Information */}
        {order.template && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Şablon Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Şablon Adı</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-medium">{order.template.title}</p>
                  <Badge className={audienceLabels[order.template.audience as keyof typeof audienceLabels]?.color}>
                    {audienceLabels[order.template.audience as keyof typeof audienceLabels]?.label}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Tasarım Stili</p>
                  <p className="font-medium capitalize">{order.design_style}</p>
                </div>
              </div>
              {order.bg_audio_url && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Arka Plan Müziği</p>
                      <a
                        href={order.bg_audio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Müziği Dinle
                      </a>
                    </div>
                  </div>
                </>
              )}
              <Separator />
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href={`/templates/${order.template.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Şablonu Görüntüle
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Message Content */}
        <Card>
          <CardHeader>
            <CardTitle>Mesaj İçeriği</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Ana Mesaj</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{order.message}</p>
              </div>
            </div>

            {order.text_fields && Object.keys(order.text_fields).length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Ek Alanlar</p>
                  <div className="space-y-2">
                    {Object.entries(order.text_fields).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-muted-foreground capitalize">{key}</p>
                        <p className="text-sm">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Personal Pages */}
        {order.personal_pages && order.personal_pages.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Oluşturulan Kişisel Sayfalar</CardTitle>
              <CardDescription>Bu siparişe ait oluşturulan sayfalar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.personal_pages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">#{page.short_id}</p>
                      <p className="text-sm text-muted-foreground">
                        {page.is_active ? 'Aktif' : 'Pasif'} •
                        Son: {new Date(page.expires_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/m/${page.short_id}`} target="_blank">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Görüntüle
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/pages/${page.id}`}>
                          Detay
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Response (for debugging) */}
        {order.payment_response && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Ödeme Yanıtı
              </CardTitle>
              <CardDescription>Ödeme sağlayıcısından gelen ham yanıt</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(order.payment_response, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
