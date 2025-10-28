'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import TemplateRenderer from '@/templates/shared/template-renderer';
import { getDefaultTextFields } from '@/templates/shared/types';
import type { TemplateTextFields } from '@/templates/shared/types';

type TemplateCardPreviewProps = {
  template: {
    id: string;
    slug: string;
    title: string;
    audience: string | string[];
    bg_audio_url: string | null;
  };
};

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 960;

const FALLBACK_TEXT: TemplateTextFields = {
recipientName: 'Sevgili Leyla',
  mainMessage: 'Bu özel mesajı senin için hazırladım. Umarım beğenirsin! 💌',
  footerMessage: 'Sevgiyle, Gizli Mesaj',
};

const TEMPLATE_CARD_DEFAULTS: Partial<Record<string, 'modern' | 'classic' | 'minimalist' | 'eglenceli'>> = {
  'cuma-tebrigi': 'eglenceli',
  'sevgililer-gunu-tebrigi': 'classic',
  'yeni-is-terfi-tebrigi': 'minimalist',
  'kandil-tebrigi-premium': 'minimalist',
  'kandil-tebrigi': 'eglenceli',
  'mutlu-yillar-celebration': 'eglenceli',
  'saka-yaptim': 'classic',
  'mezuniyet-tebrigi': 'classic',
  'meme-oyun': 'minimalist',
  'is-tebrigi': 'classic',
  'yeni-ev-arac-tebrigi': 'classic',
  'dogum-gunu-kutlama': 'minimalist',
  'affet-beni-signature':'eglenceli'
};

function pickDesignStyle(slug: string): 'modern' | 'classic' | 'minimalist' | 'eglenceli' {
  const exactMatch = TEMPLATE_CARD_DEFAULTS[slug];
  if (exactMatch) return exactMatch;
  if (slug.includes('classic')) return 'classic';
  if (slug.includes('minimal')) return 'minimalist';
  if (slug.includes('fun') || slug.includes('teen') || slug.includes('eglenceli')) return 'eglenceli';
  return 'modern';
}

export default function TemplateCardPreview({ template }: TemplateCardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ scale: 0.4, offsetX: 0, offsetY: 0 });

  const textFields = useMemo<TemplateTextFields>(() => {
    const defaults = getDefaultTextFields(template.slug);
    return {
      ...FALLBACK_TEXT,
      ...defaults,
    };
  }, [template.slug]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = (width: number, height: number) => {
      const widthScale = width / BASE_WIDTH;
      const heightScale = height / BASE_HEIGHT;
      const scale = Math.min(Math.max(Math.max(widthScale, heightScale), 0.2), 1.2);
      const scaledWidth = BASE_WIDTH * scale;
      const scaledHeight = BASE_HEIGHT * scale;
      const offsetX = (width - scaledWidth) / 2;
      const offsetY = (height - scaledHeight) / 2;

      setLayout({
        scale,
        offsetX,
        offsetY,
      });
    };

    if (typeof ResizeObserver === 'undefined') {
      updateScale(container.clientWidth, container.clientHeight);
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        updateScale(width, height);
      }
    });

    observer.observe(container);
    updateScale(container.clientWidth, container.clientHeight);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-white">
      <div
        className="pointer-events-none origin-top-left"
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${layout.scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: layout.offsetY,
          left: layout.offsetX,
        }}
      >
        <TemplateRenderer
          template={{
            id: template.id,
            slug: template.slug,
            title: template.title,
            audience: 'adult',
            bg_audio_url: template.bg_audio_url,
          }}
          designStyle={pickDesignStyle(template.slug)}
          recipientName={textFields.recipientName || FALLBACK_TEXT.recipientName || 'Sevgili Dostum'}
          message={textFields.mainMessage || FALLBACK_TEXT.mainMessage || 'Bu özel mesajı senin için hazırladım. Umarım beğenirsin! 💌'}
          creatorName="Gizli Mesaj"
          isPreview
          textFields={textFields}
          isEditable={false}
        />
      </div>
    </div>
  );
}
