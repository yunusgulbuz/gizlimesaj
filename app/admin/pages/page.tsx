import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Calendar
} from 'lucide-react';
import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';

interface PersonalPage {
  id: string;
  short_id: string;
  recipient_name: string;
  sender_name: string | null;
  is_active: boolean;
  created_at: string;
  expires_at: string;
  template: {
    title: string;
    slug: string;
  } | null;
  order: {
    id: string;
    short_id: string | null;
    status: string;
  } | null;
}

async function getPersonalPages(): Promise<PersonalPage[]> {
  const supabase = await createAuthSupabaseClient();

  const { data: pages, error } = await supabase
    .from('personal_pages')
    .select(`
      id,
      short_id,
      recipient_name,
      sender_name,
      is_active,
      created_at,
      expires_at,
      template:templates(title, slug),
      order:orders(id, short_id, status)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching personal pages:', error);
    return [];
  }

  return pages as PersonalPage[] || [];
}

function PersonalPagesTable({ pages }: { pages: PersonalPage[] }) {
  const getStatusBadge = (isActive: boolean, expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);

    if (!isActive) {
      return <Badge className="bg-gray-100 text-gray-800">Pasif</Badge>;
    }

    if (expiry < now) {
      return <Badge className="bg-red-100 text-red-800">Süresi Doldu</Badge>;
    }

    return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
  };

  if (pages.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Eye className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Kişisel sayfa bulunamadı</h3>
          <p className="text-muted-foreground text-center">
            Henüz hiç kişisel sayfa oluşturulmamış.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pages.map((page) => (
        <Card key={page.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{page.recipient_name}</h3>
                  {getStatusBadge(page.is_active, page.expires_at)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p>Gönderen: {page.sender_name || 'Bilinmiyor'}</p>
                    {page.template && <p>Şablon: {page.template.title}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Son: {new Date(page.expires_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>#{page.short_id}</span>
                  <span>•</span>
                  <span>Oluşturuldu: {new Date(page.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/m/${page.short_id}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Görüntüle
                  </Link>
                </Button>
                {page.order && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/orders/${page.order.id}`}>
                      Sipariş
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function AdminPagesPage() {
  const pages = await getPersonalPages();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Kişisel Sayfalar' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
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
            <h1 className="text-2xl font-bold">Kişisel Sayfalar</h1>
            <p className="text-muted-foreground">{pages.length} sayfa bulundu</p>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <PersonalPagesTable pages={pages} />
      </Suspense>
    </div>
  );
}
