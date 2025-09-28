'use client';

import { useState, useEffect, useCallback } from 'react';
import { StarRating, StarRatingDisplay } from '@/components/ui/star-rating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface TemplateRatingProps {
  templateId: string;
  initialData?: {
    averageRating: number;
    totalRatings: number;
    userRating: number | null;
  };
  user?: Pick<User, 'id'> | null;
  onStatsChange?: (stats: RatingData) => void;
  onUserRatingChange?: (rating: number | null) => void;
  currentUserRating?: number | null;
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
}

export function TemplateRating({ templateId, initialData, user, onStatsChange, onUserRatingChange, currentUserRating }: TemplateRatingProps) {
  const [ratingData, setRatingData] = useState<RatingData>(
    initialData || {
      averageRating: 0,
      totalRatings: 0,
      userRating: null
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(ratingData.userRating || 0);
  const router = useRouter();

  useEffect(() => {
    if (currentUserRating !== undefined) {
      setUserRating(currentUserRating ?? 0);
      setRatingData((prev) => ({
        ...prev,
        userRating: currentUserRating ?? null,
      }));
    }
  }, [currentUserRating]);

  // Sayfa yüklendiğinde rating verilerini getir
  useEffect(() => {
    if (initialData) {
      onStatsChange?.({
        averageRating: initialData.averageRating,
        totalRatings: initialData.totalRatings,
        userRating: initialData.userRating,
      });
      onUserRatingChange?.(initialData.userRating ?? null);
    }
  }, [initialData, onStatsChange, onUserRatingChange]);

  const fetchRatingData = useCallback(async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}/ratings`);
      if (response.ok) {
        const data = await response.json();
        setRatingData(data);
        setUserRating(data.userRating || 0);
        onStatsChange?.({
          averageRating: data.averageRating,
          totalRatings: data.totalRatings,
          userRating: data.userRating,
        });
        onUserRatingChange?.(data.userRating ?? null);
      }
    } catch (error) {
      console.error('Error fetching rating data:', error);
    }
  }, [templateId, onStatsChange, onUserRatingChange]);

  useEffect(() => {
    if (!initialData) {
      fetchRatingData();
    }
  }, [templateId, initialData, fetchRatingData]);

  const handleRatingSubmit = async (rating: number) => {
    if (!user) {
      toast.error('Puan vermek için giriş yapmalısınız');
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/templates/${templateId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      const data = await response.json();

      if (response.ok) {
        setRatingData({
          averageRating: data.averageRating,
          totalRatings: data.totalRatings,
          userRating: data.rating
        });
        setUserRating(data.rating);
        toast.success('Puanınız kaydedildi!');
        onStatsChange?.({
          averageRating: data.averageRating,
          totalRatings: data.totalRatings,
          userRating: data.rating,
        });
        onUserRatingChange?.(data.rating ?? null);
      } else {
        toast.error(data.error || 'Puan kaydedilemedi');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingDelete = async () => {
    if (!user || !ratingData.userRating) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/templates/${templateId}/ratings`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setRatingData({
          averageRating: data.averageRating,
          totalRatings: data.totalRatings,
          userRating: null
        });
        setUserRating(0);
        toast.success('Puanınız silindi');
        onStatsChange?.({
          averageRating: data.averageRating,
          totalRatings: data.totalRatings,
          userRating: null,
        });
        onUserRatingChange?.(null);
      } else {
        toast.error(data.error || 'Puan silinemedi');
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Şablon Değerlendirmesi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Genel Rating Gösterimi */}
        <div>
          <StarRatingDisplay
            averageRating={ratingData.averageRating}
            totalRatings={ratingData.totalRatings}
            size="lg"
          />
        </div>

        {/* Kullanıcı Rating Bölümü */}
        {user ? (
          <div className="border-t pt-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">
                {ratingData.userRating ? 'Puanınız:' : 'Bu şablonu puanlayın:'}
              </h4>
              
              <div className="flex items-center gap-3">
                <StarRating
                  rating={userRating}
                  onRatingChange={setUserRating}
                  size="lg"
                />
                
                <div className="flex gap-2">
                  {userRating > 0 && userRating !== ratingData.userRating && (
                    <Button
                      onClick={() => handleRatingSubmit(userRating)}
                      disabled={isLoading}
                      size="sm"
                    >
                      {ratingData.userRating ? 'Güncelle' : 'Puanla'}
                    </Button>
                  )}
                  
                  {ratingData.userRating && (
                    <Button
                      onClick={handleRatingDelete}
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                    >
                      Puanı Sil
                    </Button>
                  )}
                </div>
              </div>

              {ratingData.userRating && (
                <p className="text-sm text-gray-600">
                  Mevcut puanınız: {ratingData.userRating} yıldız
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">
              Bu şablonu puanlamak için giriş yapın
            </p>
            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              size="sm"
            >
              Giriş Yap
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
