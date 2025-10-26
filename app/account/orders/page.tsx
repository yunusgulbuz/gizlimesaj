'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShareVisualGenerator } from '@/components/share/share-visual-generator';
import {
  ShoppingBag,
  Calendar,
  Eye,
  Loader2,
  Copy,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  template_title: string;
  template_slug: string;
  recipient_name: string;
  sender_name: string;
  amount: string;
  status: string;
  short_id: string | null;
  created_at: string;
  expires_at: string | null;
  buyer_email?: string | null;
  message: string;
  template_audience?: string | string[];
}

const PAGE_SIZE = 5;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [authUser, setAuthUser] = useState<{ id: string; email: string | null } | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareOrder, setShareOrder] = useState<Order | null>(null);
  const [qrCache, setQrCache] = useState<Record<string, string>>({});
  const [isShareQrLoading, setIsShareQrLoading] = useState(false);
  const supabase = createClient();
  const appBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gizlimesaj.com';

  const getMessageUrl = (shortId: string | null) =>
    shortId ? `${appBaseUrl}/m/${shortId}` : '';

  const copyMessageLink = async (shortId: string | null) => {
    if (!shortId) {
      toast.error('Bu sipariş için paylaşılabilir link henüz hazır değil.');
      return;
    }

    const link = getMessageUrl(shortId);
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Mesaj linki kopyalandı!');
    } catch (error) {
      console.error('Copy link error:', error);
      toast.error('Link kopyalanamadı. Lütfen tekrar deneyin.');
    }
  };

  const handleShareVisual = async (order: Order) => {
    if (!order.short_id) {
      toast.error('Bu sipariş için paylaşılabilir sayfa henüz hazırlanmadı.');
      return;
    }

    setShareOrder(order);
    setIsShareDialogOpen(true);

    if (qrCache[order.short_id]) {
      return;
    }

    setIsShareQrLoading(true);

    try {
      const link = getMessageUrl(order.short_id);
      const qrEndpoint = `https://api.qrserver.com/v1/create-qr-code/?size=560x560&data=${encodeURIComponent(link)}&margin=1`;
      const response = await fetch(qrEndpoint);

      if (!response.ok) {
        throw new Error('QR kodu alınamadı');
      }

      const blob = await response.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('QR kod data URL oluşturulamadı'));
          }
        };
        reader.onerror = () => reject(new Error('QR kod data URL okunamadı'));
        reader.readAsDataURL(blob);
      });

      setQrCache((prev) => ({ ...prev, [order.short_id!]: dataUrl }));
    } catch (error) {
      console.error('Share visual QR error:', error);
      toast.error('QR kod hazırlanamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsShareQrLoading(false);
    }
  };

  const loadOrders = useCallback(
    async (pageNumber: number, append = false, userOverride?: { id: string; email: string | null }) => {
      const targetUser = userOverride ?? authUser;

      if (!targetUser) {
        if (!append) {
          setIsLoading(false);
        }
        return;
      }

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const from = (pageNumber - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const filterExpressions = [`user_id.eq.${targetUser.id}`];
        if (targetUser.email) {
          const quotedEmail = targetUser.email.replace(/"/g, '\\"');
          filterExpressions.push(`buyer_email.eq."${quotedEmail}"`);
        }

        const { data, error, count } = await supabase
          .from('orders')
          .select(
            `
              id,
              amount,
              status,
              created_at,
              expires_at,
              short_id,
              recipient_name,
              sender_name,
              message,
              buyer_email,
              templates (
                title,
                slug
              )
            `,
            { count: 'exact' }
          )
          .or(filterExpressions.join(','))
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;

        const formattedOrders: Order[] = (data || []).map((order: any) => {
          const template = Array.isArray(order.templates) ? order.templates[0] : order.templates;

          return {
            id: order.id,
            template_title: template?.title || 'Bilinmeyen Şablon',
            template_slug: template?.slug || '',
            recipient_name: order.recipient_name || 'Bilinmeyen Alıcı',
            sender_name: order.sender_name || 'Bilinmeyen Gönderen',
            amount: order.amount || '0',
            status: order.status || 'pending',
            short_id: order.short_id || null,
            created_at: order.created_at,
            expires_at: order.expires_at || null,
            buyer_email: order.buyer_email || null,
            message: order.message || '',
          };
        });

        setOrders((prev) => {
          if (!append) {
            return formattedOrders;
          }

          const merged = [...prev, ...formattedOrders];
          const unique = new Map<string, Order>();
          merged.forEach((item) => unique.set(item.id, item));
          return Array.from(unique.values());
        });

        setHasMore(
          count != null
            ? to + 1 < count
            : formattedOrders.length === PAGE_SIZE
        );
        setPage(pageNumber);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Siparişler yüklenemedi');
      } finally {
        if (append) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [authUser, supabase]
  );

  useEffect(() => {
    if (authUser) {
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          toast.error('Lütfen giriş yapın');
          setIsLoading(false);
          return;
        }

        const authInfo = { id: user.id, email: user.email ?? null };
        setAuthUser(authInfo);
        await loadOrders(1, false, authInfo);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Siparişler yüklenemedi');
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [authUser, supabase, loadOrders]);

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tamamlanan Siparişlerim</h1>
        <p className="mt-2 text-gray-600">Başarıyla tamamlanmış siparişlerinizi buradan görüntüleyebilirsiniz</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Henüz tamamlanmış siparişiniz yok
            </h3>
            <p className="mb-6 text-center text-gray-600">
              Sevdiklerinize özel mesajlar oluşturmaya başlayın
            </p>
            <Button asChild>
              <Link href="/templates">Sürprizleri İncele</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const messageUrl = getMessageUrl(order.short_id);
            const formattedCreated = new Date(order.created_at).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });
            const formattedExpires = order.expires_at
              ? new Date(order.expires_at).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              : null;

            return (
              <Card
                key={order.id}
                className="overflow-hidden border-none bg-white/90 shadow-xl shadow-purple-200/50"
              >
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 px-6 py-5 text-white">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg text-white">{order.template_title}</CardTitle>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/70">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-white/80" />
                          {formattedCreated}
                        </span>
                        {order.short_id && (
                          <span>KOD: {order.short_id.toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold">
                        ₺{parseFloat(order.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-6 py-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-inner shadow-purple-100/40">
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Gönderen</p>
                      <p className="mt-2 font-semibold text-gray-900">{order.sender_name}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-inner shadow-purple-100/40">
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Alıcı</p>
                      <p className="mt-2 font-semibold text-gray-900">{order.recipient_name}</p>
                      {order.buyer_email && (
                        <p className="mt-1 text-xs text-gray-500">{order.buyer_email}</p>
                      )}
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-inner shadow-purple-100/40">
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Sipariş tarihi</p>
                      <p className="mt-2 font-semibold text-gray-900">{formattedCreated}</p>
                      {formattedExpires && (
                        <p className="mt-1 text-xs text-gray-500">
                          Erişim: {formattedExpires} tarihine kadar
                        </p>
                      )}
                    </div>
                  </div>

                  {order.message && (
                    <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/60 p-5">
                      <p className="text-xs uppercase tracking-[0.35em] text-purple-500">
                        Mesajdan bir kesit
                      </p>
                      <p className="mt-3 max-h-24 overflow-y-auto text-sm leading-relaxed text-purple-900/90">
                        {order.message}
                      </p>
                    </div>
                  )}

                  {order.short_id && (
                    <div className="rounded-2xl border border-purple-200 bg-purple-50/50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-purple-500">
                        Mesaj linki
                      </p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <span className="flex-1 truncate text-sm font-medium text-purple-900">
                          {messageUrl}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyMessageLink(order.short_id)}
                          className="gap-2 text-purple-600 hover:bg-purple-100"
                        >
                          <Copy className="h-4 w-4" />
                          Kopyala
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      asChild
                      className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-300/40"
                    >
                      <Link href={`/m/${order.short_id}`} prefetch={false}>
                        <Eye className="h-4 w-4" />
                        Mesajı aç
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 border-purple-200 text-purple-600 hover:border-purple-300 hover:text-purple-700"
                      onClick={() => copyMessageLink(order.short_id)}
                    >
                      <Copy className="h-4 w-4" />
                      Linki kopyala
                    </Button>
                    <Button
                      variant="ghost"
                      className="gap-2 text-gray-600 hover:text-purple-600"
                      onClick={() => handleShareVisual(order)}
                    >
                      <Share2 className="h-4 w-4" />
                      Görsel indir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                className="gap-2 border-purple-200 text-purple-600 hover:border-purple-300 hover:text-purple-700"
                onClick={() => {
                  void loadOrders(page + 1, true);
                }}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  'Daha Fazla Yükle'
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog
        open={isShareDialogOpen}
        onOpenChange={(open) => {
          setIsShareDialogOpen(open);
          if (!open) {
            setShareOrder(null);
          }
        }}
      >
        <DialogContent className="w-full h-[100dvh] sm:h-auto sm:w-[95vw] max-w-none sm:max-w-7xl max-h-[95vh] overflow-y-auto px-3 pt-3 pb-3 sm:px-6 sm:pt-6 sm:pb-6 m-0 sm:m-4 rounded-none sm:rounded-lg">
          <DialogHeader className="pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-900">
              Görsel Olarak Paylaş
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {shareOrder && (
              <ShareVisualGenerator
                shortId={shareOrder.short_id!}
                recipientName={shareOrder.recipient_name}
                senderName={shareOrder.sender_name}
                templateTitle={shareOrder.template_title}
                message={shareOrder.message}
                pageUrl={shareOrder.short_id ? getMessageUrl(shareOrder.short_id) : appBaseUrl}
                qrDataUrl={shareOrder.short_id ? qrCache[shareOrder.short_id] : undefined}
              />
            )}
            {isShareQrLoading && (
              <p className="mt-4 text-center text-xs text-gray-500">
                QR kod hazırlanıyor...
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
