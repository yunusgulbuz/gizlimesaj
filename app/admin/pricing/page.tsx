import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';

interface TemplatePricing {
  id: number;
  template_id: string;
  duration_id: number;
  price_try: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  template: {
    title: string;
    slug: string;
    audience: string;
  };
  duration: {
    label: string;
    days: number;
  };
}

interface Duration {
  id: number;
  label: string;
  days: number;
  is_active: boolean;
}

interface Template {
  id: string;
  title: string;
  slug: string;
  audience: string;
  is_active: boolean;
}

async function getTemplatePricing(searchParams: { 
  search?: string; 
  template?: string; 
  duration?: string;
  status?: string;
  page?: string; 
}): Promise<{ pricing: TemplatePricing[]; total: number }> {
  const supabase = await createAuthSupabaseClient();
  
  let query = supabase
    .from('template_pricing')
    .select(`
      *,
      template:templates(title, slug, audience),
      duration:durations(label, days)
    `, { count: 'exact' });

  // Apply filters
  if (searchParams.search) {
    query = query.or(`template.title.ilike.%${searchParams.search}%,duration.label.ilike.%${searchParams.search}%`);
  }

  if (searchParams.template && searchParams.template !== 'all') {
    query = query.eq('template_id', searchParams.template);
  }

  if (searchParams.duration && searchParams.duration !== 'all') {
    query = query.eq('duration_id', searchParams.duration);
  }

  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('is_active', searchParams.status === 'active');
  }

  // Pagination
  const page = parseInt(searchParams.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data: pricing, error, count } = await query;

  if (error) {
    console.error('Error fetching template pricing:', error);
    return { pricing: [], total: 0 };
  }

  return { 
    pricing: pricing || [], 
    total: count || 0 
  };
}

async function getTemplates(): Promise<Template[]> {
  const supabase = await createAuthSupabaseClient();
  
  const { data: templates, error } = await supabase
    .from('templates')
    .select('id, title, slug, audience, is_active')
    .eq('is_active', true)
    .order('title');

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return templates || [];
}

async function getDurations(): Promise<Duration[]> {
  const supabase = await createAuthSupabaseClient();
  
  const { data: durations, error } = await supabase
    .from('durations')
    .select('*')
    .eq('is_active', true)
    .order('days');

  if (error) {
    console.error('Error fetching durations:', error);
    return [];
  }

  return durations || [];
}

const audienceLabels = {
  teen: { label: "Genç", color: "bg-blue-100 text-blue-800" },
  adult: { label: "Yetişkin", color: "bg-green-100 text-green-800" },
  classic: { label: "Klasik", color: "bg-gray-100 text-gray-800" },
  fun: { label: "Eğlenceli", color: "bg-yellow-100 text-yellow-800" },
  elegant: { label: "Zarif", color: "bg-purple-100 text-purple-800" }
};

function PricingTable({ pricing }: { pricing: TemplatePricing[] }) {
  if (pricing.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Fiyatlandırma bulunamadı</h3>
          <p className="text-muted-foreground text-center mb-4">
            Henüz hiç fiyatlandırma tanımlanmamış.
          </p>
          <Button asChild>
            <Link href="/admin/pricing/new">
              <Plus className="h-4 w-4 mr-2" />
              İlk Fiyatlandırmayı Ekle
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pricing.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{item.template.title}</h3>
                  <Badge 
                    variant="secondary" 
                    className={audienceLabels[item.template.audience as keyof typeof audienceLabels]?.color}
                  >
                    {audienceLabels[item.template.audience as keyof typeof audienceLabels]?.label}
                  </Badge>
                  <Badge variant={item.is_active ? "default" : "secondary"}>
                    {item.is_active ? "Aktif" : "Pasif"}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{item.duration.label} ({item.duration.days} gün)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-green-600">₺{item.price_try}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/pricing/${item.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function AdminPricingPage({
  searchParams
}: {
  searchParams: Promise<{ 
    search?: string; 
    template?: string; 
    duration?: string;
    status?: string;
    page?: string;
  }>
}) {
  const params = await searchParams;
  const { pricing, total } = await getTemplatePricing(params);
  const templates = await getTemplates();
  const durations = await getDurations();
  const currentPage = parseInt(params.page || '1');
  const totalPages = Math.ceil(total / 20);

  // Breadcrumb items for admin pricing page
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Fiyatlandırma' }
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
            <h1 className="text-2xl font-bold">Fiyatlandırma Yönetimi</h1>
            <p className="text-muted-foreground">{total} fiyatlandırma bulundu</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/pricing/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Fiyatlandırma
          </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Şablon veya süre ara..."
                defaultValue={params.search}
                className="pl-10"
              />
            </div>
            <Select defaultValue={params.template || 'all'}>
              <SelectTrigger>
                <SelectValue placeholder="Şablon seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Şablonlar</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue={params.duration || 'all'}>
              <SelectTrigger>
                <SelectValue placeholder="Süre seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Süreler</SelectItem>
                {durations.map((duration) => (
                  <SelectItem key={duration.id} value={duration.id.toString()}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue={params.status || 'all'}>
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Table */}
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <PricingTable pricing={pricing} />
      </Suspense>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {currentPage > 1 && (
            <Button variant="outline" asChild>
              <Link href={`/admin/pricing?page=${currentPage - 1}`}>
                Önceki
              </Link>
            </Button>
          )}
          <span className="flex items-center px-4">
            Sayfa {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Button variant="outline" asChild>
              <Link href={`/admin/pricing?page=${currentPage + 1}`}>
                Sonraki
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}