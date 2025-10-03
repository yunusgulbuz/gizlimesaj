'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TemplateCardPreview from '@/app/templates/_components/template-card-preview-client';
import {
  Heart,
  Loader2,
  Eye,
  Trash2,
  ArrowRight,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

interface Favorite {
  id: string;
  created_at: string;
  template: {
    id: string;
    slug: string;
    title: string;
    audience: string[];
    preview_url: string | null;
    bg_audio_url: string | null;
  };
  stats?: {
    averageRating: number;
    totalRatings: number;
  };
  price?: string | null;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          toast.error('Lütfen giriş yapın');
          return;
        }

        const { data, error } = await supabase
          .from('favorites')
          .select(`
            id,
            created_at,
            template_id,
            templates (
              id,
              slug,
              title,
              audience,
              preview_url,
              bg_audio_url
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Get template IDs to fetch stats and pricing
        const templateIds = (data || []).map(f => {
          const template = Array.isArray((f as any).templates)
            ? (f as any).templates[0]
            : (f as any).templates;
          return template?.id;
        }).filter(Boolean);

        // Fetch template stats
        const { data: stats } = await supabase
          .from('template_stats')
          .select('id, average_rating, total_ratings')
          .in('id', templateIds);

        const statsMap = new Map(
          (stats || []).map(s => [s.id, {
            averageRating: s.average_rating || 0,
            totalRatings: s.total_ratings || 0,
          }])
        );

        // Fetch shortest duration pricing
        const { data: durations } = await supabase
          .from('durations')
          .select('id')
          .eq('is_active', true)
          .order('days', { ascending: true })
          .limit(1)
          .single();

        let pricingMap = new Map();
        if (durations) {
          const { data: pricing } = await supabase
            .from('template_pricing')
            .select('template_id, price_try')
            .in('template_id', templateIds)
            .eq('duration_id', durations.id)
            .eq('is_active', true);

          pricingMap = new Map(
            (pricing || []).map(p => [p.template_id, p.price_try])
          );
        }

        const formattedFavorites: Favorite[] = (data || [])
          .map((fav: any) => {
            const template = Array.isArray(fav.templates)
              ? fav.templates[0]
              : fav.templates;

            if (!template) return null;

            return {
              id: fav.id,
              created_at: fav.created_at,
              template: {
                id: template.id,
                slug: template.slug,
                title: template.title,
                audience: template.audience || [],
                preview_url: template.preview_url,
                bg_audio_url: template.bg_audio_url,
              },
              stats: statsMap.get(template.id),
              price: pricingMap.get(template.id),
            };
          })
          .filter((f): f is Favorite => f !== null);

        setFavorites(formattedFavorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Favoriler yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [supabase]);

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast.success('Favorilerden kaldırıldı');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Favorilerden kaldırılamadı');
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Favorilerim</h1>
        <p className="mt-2 text-gray-600">Beğendiğiniz şablonları buradan görüntüleyin</p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Henüz favori şablonunuz yok
            </h3>
            <p className="mb-6 text-center text-gray-600">
              Beğendiğiniz şablonları favorilere ekleyin
            </p>
            <Button asChild>
              <Link href="/templates">Şablonları İncele</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => {
            const previewData = {
              id: favorite.template.id,
              slug: favorite.template.slug,
              title: favorite.template.title,
              audience: favorite.template.audience,
              bg_audio_url: favorite.template.bg_audio_url,
            };

            return (
              <Card key={favorite.id} className="group relative overflow-hidden border-0 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-xl hover:ring-gray-200">
                {/* Preview */}
                <Link href={`/templates/${favorite.template.slug}/preview`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                      <TemplateCardPreview template={previewData} />
                    </div>
                  </div>
                </Link>

                {/* Content */}
                <CardContent className="p-4">
                  <Link href={`/templates/${favorite.template.slug}/preview`}>
                    <h3 className="mb-3 text-base font-bold leading-tight text-gray-900 line-clamp-2 transition-colors group-hover:text-rose-600">
                      {favorite.template.title}
                    </h3>
                  </Link>

                  {/* Rating */}
                  {favorite.stats && favorite.stats.totalRatings > 0 && (
                    <div className="mb-2 flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(favorite.stats?.averageRating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {favorite.stats.averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({favorite.stats.totalRatings})
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  {favorite.price && (
                    <div className="mb-4">
                      <span className="text-2xl font-black text-gray-900">
                        ₺{favorite.price}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/templates/${favorite.template.slug}/preview`}>
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        İncele
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
