'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Sparkles,
  Trash2,
  Eye,
  ShoppingCart,
  Loader2,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AITemplate {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: 'draft' | 'purchased' | 'deleted';
  created_at: string;
  updated_at: string;
}

interface UserCredits {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
}

export default function MyAITemplatesPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [templates, setTemplates] = useState<AITemplate[]>([]);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [draftCount, setDraftCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Check auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push('/login');
        return;
      }

      // Load templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('ai_generated_templates')
        .select('id, slug, title, category, status, created_at, updated_at')
        .eq('user_id', user.id)
        .in('status', ['draft', 'purchased'])
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;
      setTemplates(templatesData || []);

      // Count drafts
      const drafts = (templatesData || []).filter((t: AITemplate) => t.status === 'draft');
      setDraftCount(drafts.length);

      // Load AI credits
      const creditsResponse = await fetch('/api/ai-templates/generate');
      if (creditsResponse.ok) {
        const creditsData = await creditsResponse.json();
        setCredits({
          totalCredits: creditsData.totalCredits || 0,
          usedCredits: creditsData.usedCredits || 0,
          remainingCredits: creditsData.remainingCredits || 0,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      const response = await fetch('/api/ai-templates/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: deleteId }),
      });

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız');
      }

      // Reload data
      await loadData();
      setDeleteId(null);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Taslak silinemedi. Lütfen tekrar deneyin.');
    } finally {
      setDeleting(false);
    }
  };

  const draftTemplates = templates.filter((t) => t.status === 'draft');
  const purchasedTemplates = templates.filter((t) => t.status === 'purchased');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Tasarımlarım</h1>
                <p className="text-sm text-gray-600">Oluşturduğunuz AI tasarımlarını yönetin</p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/ai-template-creator')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Tasarım
            </Button>
          </div>
        </div>
      </div>

      {/* Credits Info */}
      {credits && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Card className="bg-white/50 backdrop-blur-sm border-purple-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Aktif Taslaklar</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {draftCount} / 10
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {10 - draftCount} slot boş
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">AI Kullanım Kredileri</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {credits.remainingCredits}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Toplam {credits.totalCredits} krediden {credits.usedCredits} kullanıldı
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kredi Paketi</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {credits.remainingCredits === 0 ? 'Bitti' : 'Aktif'}
                  </p>
                  <Link href="/pricing" className="text-xs text-purple-600 hover:underline mt-1 inline-block">
                    {credits.remainingCredits === 0 ? 'Kredi Satın Al →' : 'Daha Fazla Kredi →'}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Templates */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Draft Templates */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Taslak Tasarımlar ({draftTemplates.length})
            </h2>
          </div>

          {draftTemplates.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Henüz taslak tasarımınız yok</p>
                <Button
                  onClick={() => router.push('/ai-template-creator')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Tasarımınızı Oluşturun
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftTemplates.map((template) => (
                <Card key={template.id} className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-semibold line-clamp-1">
                        {template.title}
                      </CardTitle>
                      <Badge variant="secondary" className="ml-2 shrink-0">
                        Taslak
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 capitalize">{template.category}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">
                      Oluşturulma: {new Date(template.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/templates/${template.slug}/preview`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Önizle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Purchased Templates */}
        {purchasedTemplates.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                Satın Alınan Tasarımlar ({purchasedTemplates.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedTemplates.map((template) => (
                <Card key={template.id} className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-semibold line-clamp-1">
                        {template.title}
                      </CardTitle>
                      <Badge variant="default" className="ml-2 bg-green-600 shrink-0">
                        Satın Alındı
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 capitalize">{template.category}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">
                      Satın Alındı: {new Date(template.updated_at).toLocaleDateString('tr-TR')}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/templates/${template.slug}/preview`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Görüntüle
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tasarımı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu taslak tasarımı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              Silindikten sonra yeni bir tasarım oluşturabilirsiniz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sil
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
