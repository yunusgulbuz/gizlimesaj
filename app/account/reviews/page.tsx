'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import {
  Star,
  Loader2,
  MessageCircle,
  Calendar,
  Trash2,
  Edit2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  template: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          toast.error('Lütfen giriş yapın');
          return;
        }

        const { data: ratings, error: ratingsError } = await supabase
          .from('template_ratings')
          .select(`
            id,
            rating,
            created_at,
            template_id
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ratingsError) throw ratingsError;

        const { data: comments, error: commentsError } = await supabase
          .from('template_comments')
          .select('template_id, comment, created_at')
          .eq('user_id', user.id);

        if (commentsError) throw commentsError;

        const commentsByTemplate = new Map(
          (comments || []).map(c => [c.template_id, c])
        );

        const templateIds = [...new Set((ratings || []).map(r => r.template_id))];

        const { data: templates, error: templatesError } = await supabase
          .from('templates')
          .select('id, title, slug')
          .in('id', templateIds);

        if (templatesError) throw templatesError;

        const templatesMap = new Map(
          (templates || []).map(t => [t.id, t])
        );

        const formattedReviews: Review[] = (ratings || [])
          .map(rating => {
            const template = templatesMap.get(rating.template_id);
            if (!template) return null;

            const comment = commentsByTemplate.get(rating.template_id);

            return {
              id: rating.id,
              rating: rating.rating,
              comment: comment?.comment || null,
              created_at: rating.created_at,
              template: {
                id: template.id,
                title: template.title,
                slug: template.slug,
              },
            };
          })
          .filter((r): r is Review => r !== null);

        setReviews(formattedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Değerlendirmeler yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [supabase]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Bu değerlendirmeyi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('template_ratings')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(prev => prev.filter(r => r.id !== reviewId));
      toast.success('Değerlendirme silindi');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Değerlendirme silinemedi');
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
        <h1 className="text-2xl font-bold text-gray-900">Değerlendirmelerim</h1>
        <p className="mt-2 text-gray-600">Şablonlara yaptığınız değerlendirmeleri görüntüleyin</p>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Henüz değerlendirmeniz yok
            </h3>
            <p className="mb-6 text-center text-gray-600">
              Kullandığınız şablonları puanlayarak diğer kullanıcılara yardımcı olun
            </p>
            <Button asChild>
              <Link href="/templates">Şablonları İncele</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link
                      href={`/templates/${review.template.slug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-rose-600"
                    >
                      {review.template.title}
                    </Link>

                    <div className="mt-2 flex items-center gap-4">
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span className="text-sm text-gray-600">
                        <Calendar className="mr-1 inline h-3 w-3" />
                        {new Date(review.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>

                    {review.comment && (
                      <div className="mt-3 rounded-lg bg-gray-50 p-3">
                        <p className="flex items-start gap-2 text-sm text-gray-700">
                          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          {review.comment}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-gray-600 hover:text-rose-600"
                    >
                      <Link href={`/templates/${review.template.slug}/preview`}>
                        <Edit2 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
