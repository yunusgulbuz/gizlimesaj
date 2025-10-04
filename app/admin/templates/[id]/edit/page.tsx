'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface TemplateFormData {
  title: string;
  slug: string;
  audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant';
  description: string;
  preview_url: string;
  bg_audio_url: string;
  is_active: boolean;
}

export default function EditTemplatePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<TemplateFormData>({
    title: '',
    slug: '',
    audience: 'teen',
    description: '',
    preview_url: '',
    bg_audio_url: '',
    is_active: true
  });

  useEffect(() => {
    params.then(({ id }) => {
      setTemplateId(id);
      fetchTemplate(id);
    });
  }, []);

  const fetchTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/templates/${id}`);
      if (!response.ok) {
        throw new Error('Şablon bulunamadı');
      }
      const data = await response.json();
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        audience: data.audience || 'teen',
        description: data.description || '',
        preview_url: data.preview_url || '',
        bg_audio_url: data.bg_audio_url || '',
        is_active: data.is_active ?? true
      });
    } catch (error) {
      console.error('Error fetching template:', error);
      toast.error('Şablon yüklenirken bir hata oluştu');
      router.push('/admin/templates');
    } finally {
      setIsFetching(false);
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Şablonlar', href: '/admin/templates' },
    { label: 'Düzenle' }
  ];

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateId) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Şablon güncellenemedi');
      }

      toast.success('Şablon başarıyla güncellendi!');
      router.push('/admin/templates');
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Şablon güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const audienceOptions = [
    { value: 'teen', label: 'Genç' },
    { value: 'adult', label: 'Yetişkin' },
    { value: 'classic', label: 'Klasik' },
    { value: 'fun', label: 'Eğlenceli' },
    { value: 'elegant', label: 'Zarif' }
  ];

  if (isFetching) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/templates">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Şablonlara Dön
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Şablon Düzenle</h1>
            <p className="text-muted-foreground">Şablon bilgilerini güncelleyin</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
              <CardDescription>Şablonun temel bilgilerini girin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Şablon Adı *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Örn: Romantik Doğum Günü"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="romantik-dogum-gunu"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL&apos;de görünecek kısım. Otomatik oluşturulur.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Hedef Kitle *</Label>
                <Select
                  value={formData.audience}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, audience: value as TemplateFormData['audience'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Hedef kitle seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {audienceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Şablon hakkında kısa bir açıklama..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Media & Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Medya ve Ayarlar</CardTitle>
              <CardDescription>Şablonun görsel ve ses ayarları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preview_url">Önizleme URL&apos;si</Label>
                <Input
                  id="preview_url"
                  type="url"
                  value={formData.preview_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, preview_url: e.target.value }))}
                  placeholder="https://example.com/preview"
                />
                <p className="text-xs text-muted-foreground">
                  Şablonun önizlemesi için iframe URL&apos;si
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bg_audio_url">Arka Plan Ses URL&apos;si</Label>
                <Input
                  id="bg_audio_url"
                  type="url"
                  value={formData.bg_audio_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, bg_audio_url: e.target.value }))}
                  placeholder="https://example.com/audio.mp3"
                />
                <p className="text-xs text-muted-foreground">
                  Şablonda çalacak arka plan müziği
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="is_active">Şablon aktif</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        {formData.preview_url && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Önizleme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={formData.preview_url}
                  className="w-full h-full border-0"
                  title="Template Preview"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/templates">İptal</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Kaydediliyor...</span>
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Güncelle
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
