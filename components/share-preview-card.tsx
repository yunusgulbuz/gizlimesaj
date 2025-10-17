'use client';

import { ExternalLink } from 'lucide-react';

interface SharePreviewCardProps {
  title: string;
  description: string;
  siteName: string;
  image?: string;
  url: string;
}

export function SharePreviewCard({
  title,
  description,
  siteName,
  image,
  url
}: SharePreviewCardProps) {
  return (
    <div className="w-full max-w-md">
      <p className="mb-2 text-xs font-medium text-gray-500">Önizleme (WhatsApp, Facebook, Twitter vb.)</p>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg">
        {/* Image */}
        {image && (
          <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-3">
          {/* Site Name / URL */}
          <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
            <ExternalLink className="h-3 w-3" />
            <span className="truncate">{url}</span>
          </div>

          {/* Title */}
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">
            {title}
          </h3>

          {/* Description */}
          <p className="mb-2 line-clamp-2 text-xs text-gray-600">
            {description}
          </p>

          {/* Site Name */}
          <p className="text-xs font-medium text-gray-500">
            {siteName}
          </p>
        </div>
      </div>
    </div>
  );
}
