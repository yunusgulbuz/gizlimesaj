import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, 
  Edit,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Play,
  Pause
} from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase';

interface Template {
  id: string;
  slug: string;
  title: string;
  audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant';
  preview_url: string | null;
  bg_audio_url: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

async function getTemplates(searchParams: { 
  search?: string; 
  audience?: string; 
  status?: string;
  page?: string; 
}): Promise<{ templates: Template[]; total: number }> {
  const supabase = await createServerSupabaseClient();
  
  let query = supabase
    .from('templates')
    .select('*', { count: 'exact' });

  // Apply filters
  if (searchParams.search) {
    query = query.ilike('title', `%${searchParams.search}%`);
  }

  if (searchParams.audience && searchParams.audience !== 'all') {
    query = query.eq('audience', searchParams.audience);
  }

  if (searchParams.status === 'active') {
    query = query.eq('is_active', true);
  } else if (searchParams.status === 'inactive') {
    query = query.eq('is_active', false);
  }

  // Pagination
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const offset = (page - 1) * limit;

  const { data: templates, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching templates:', error);
    return { templates: [], total: 0 };
  }

  return {
    templates: templates as Template[] || [],
    total: count || 0
  };
}

function TemplatesGrid({ templates }: { templates: Template[] }) {
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
      <Badge className={variants[audience as keyof typeof variants]}>
        {labels[audience as keyof typeof labels] || audience}
      </Badge>
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.id} className={`relative ${!template.is_active ? 'opacity-60' : ''}`}>
          {template.preview_url && (
            <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 rounded-t-lg relative overflow-hidden">
              <iframe
                src={template.preview_url}
                className="w-full h-full border-0"
                title={`${template.title} Preview`}
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {getAudienceBadge(template.audience)}
                  <Badge variant={template.is_active ? 'default' : 'secondary'}>
                    {template.is_active ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
              </div>
              {template.bg_audio_url && (
                <Button variant="ghost" size="sm">
                  <Play className="h-4 w-4" />
                </Button>
              )}
            </div>
            {template.description && (
              <CardDescription className="line-clamp-2">
                {template.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {new Date(template.created_at).toLocaleDateString('tr-TR')}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/templates/${template.slug}`} target="_blank">
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/templates/${template.id}/edit`}>
                    <Edit className="h-4 w-4" />
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

export default async function AdminTemplatesPage({
  searchParams
}: {
  searchParams: { search?: string; audience?: string; status?: string; page?: string }
}) {
  const { templates, total } = await getTemplates(searchParams);
  const currentPage = parseInt(searchParams.page || '1');
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="container mx-auto p-6 space-y-6">
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
            <h1 className="text-2xl font-bold">Şablonlar</h1>
            <p className="text-muted-foreground">{total} şablon bulundu</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/templates/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Şablon
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
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Şablon adı ile ara..."
                  defaultValue={searchParams.search}
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue={searchParams.audience || 'all'}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Hedef kitle seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Hedef Kitleler</SelectItem>
                <SelectItem value="teen">Genç</SelectItem>
                <SelectItem value="adult">Yetişkin</SelectItem>
                <SelectItem value="classic">Klasik</SelectItem>
                <SelectItem value="fun">Eğlenceli</SelectItem>
                <SelectItem value="elegant">Zarif</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue={searchParams.status || 'all'}>
              <SelectTrigger className="w-48">
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

      {/* Templates Grid */}
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <TemplatesGrid templates={templates} />
      </Suspense>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {currentPage > 1 && (
            <Button variant="outline" asChild>
              <Link href={`/admin/templates?page=${currentPage - 1}`}>
                Önceki
              </Link>
            </Button>
          )}
          <span className="flex items-center px-4">
            Sayfa {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Button variant="outline" asChild>
              <Link href={`/admin/templates?page=${currentPage + 1}`}>
                Sonraki
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}