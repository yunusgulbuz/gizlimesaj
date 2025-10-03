'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  templateId: string;
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

export function FavoriteButton({
  templateId,
  className,
  iconOnly = false,
  size = 'default',
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsChecking(false);
          return;
        }

        const { data, error } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('template_id', templateId)
          .single();

        if (!error && data) {
          setIsFavorite(true);
        }
      } catch (error) {
        // Ignore error - user probably not logged in or favorite doesn't exist
      } finally {
        setIsChecking(false);
      }
    };

    checkFavorite();
  }, [supabase, templateId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Favorilere eklemek için giriş yapmalısınız');
        router.push('/login');
        setIsLoading(false);
        return;
      }

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('template_id', templateId);

        if (error) throw error;

        setIsFavorite(false);
        toast.success('Favorilerden kaldırıldı');
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            template_id: templateId,
          });

        if (error) throw error;

        setIsFavorite(true);
        toast.success('Favorilere eklendi');
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return null; // Or return a skeleton
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'transition-all',
        isFavorite
          ? 'border-rose-500 hover:border-rose-600 text-rose-500 hover:text-rose-600 bg-white hover:bg-rose-50'
          : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-700',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className={cn('h-4 w-4 animate-spin', !iconOnly && 'mr-2')} />
      ) : (
        <Heart
          className={cn(
            'h-4 w-4 transition-all',
            !iconOnly && 'mr-2',
            isFavorite && 'fill-rose-500'
          )}
        />
      )}
      {!iconOnly && (isFavorite ? 'Favorilerde' : 'Favorilere Ekle')}
    </Button>
  );
}
