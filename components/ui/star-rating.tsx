'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showValue = false,
  className
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={cn(
              'transition-colors',
              !readonly && 'hover:scale-110 cursor-pointer',
              readonly && 'cursor-default'
            )}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors',
                star <= displayRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              )}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600 ml-2">
          {rating > 0 ? rating.toFixed(1) : 'Henüz puanlanmamış'}
        </span>
      )}
    </div>
  );
}

interface StarRatingDisplayProps {
  averageRating: number;
  totalRatings: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRatingDisplay({
  averageRating,
  totalRatings,
  size = 'md',
  className
}: StarRatingDisplayProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <StarRating
        rating={averageRating}
        readonly
        size={size}
      />
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <span className="font-medium">
          {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
        </span>
        <span>({totalRatings} değerlendirme)</span>
      </div>
    </div>
  );
}