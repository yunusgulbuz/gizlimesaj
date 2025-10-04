import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import {
  Eye,
  Edit,
  Filter,
  Plus,
  ArrowLeft,
  Play
} from 'lucide-react';
import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';
import TemplateFilters from './template-filters';

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
  const supabase = await createAuthSupabaseClient();
  
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
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-base md:text-lg">{template.title}</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  {getAudienceBadge(template.audience)}
                  <Badge variant={template.is_active ? 'default' : 'secondary'} className="text-xs">
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
              <CardDescription className="line-clamp-2 text-xs md:text-sm">
                {template.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
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
  searchParams: Promise<{ search?: string; audience?: string; status?: string; page?: string }>
}) {
  const params = await searchParams;
  const { templates, total } = await getTemplates(params);
  const currentPage = parseInt(params.page || '1');
  const totalPages = Math.ceil(total / 12);

  // Breadcrumb items for admin templates page
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Şablonlar' }
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
            <h1 className="text-xl md:text-2xl font-bold">Şablonlar</h1>
            <p className="text-xs md:text-sm text-muted-foreground">{total} şablon bulundu</p>
          </div>
        </div>
        <Button asChild size="sm" className="self-start md:self-auto">
          <Link href="/admin/templates/new">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Yeni Şablon</span>
            <span className="sm:hidden">Yeni</span>
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
          <TemplateFilters />
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <TemplatesGrid templates={templates} />
      </Suspense>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {currentPage > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/templates?page=${currentPage - 1}`}>
                Önceki
              </Link>
            </Button>
          )}
          <span className="flex items-center px-3 md:px-4 text-xs md:text-sm">
            Sayfa {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Button variant="outline" size="sm" asChild>
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