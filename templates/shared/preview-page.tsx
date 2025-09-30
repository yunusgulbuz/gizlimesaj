'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TemplateRenderer from './template-renderer';
import { getDefaultTextFields, TemplateTextFields } from './types';

interface Template {
  id: string;
  slug: string;
  title: string;
  audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant';
  preview_url: string | null;
  bg_audio_url: string | null;
  description: string | null;
}

interface TemplatePreviewPageProps {
  template: Template;
}

export type { TemplatePreviewPageProps };

const designStyles = {
  modern: {
    label: "Modern",
    description: "Temiz çizgiler ve minimalist yaklaşım",
    color: "bg-blue-100 text-blue-800",
    preview: "🎨"
  },
  classic: {
    label: "Klasik",
    description: "Zarif ve zamansız tasarım",
    color: "bg-amber-100 text-amber-800",
    preview: "✨"
  },
  minimalist: {
    label: "Minimalist",
    description: "Sade ve odaklanmış görünüm",
    color: "bg-gray-100 text-gray-800",
    preview: "⚡"
  },
  eglenceli: {
    label: "Eğlenceli",
    description: "İnteraktif ve eğlenceli deneyim",
    color: "bg-yellow-100 text-yellow-800",
    preview: "🎉"
  }
};

export default function TemplatePreviewPage({ template }: TemplatePreviewPageProps) {
  const [selectedDesignStyle, setSelectedDesignStyle] = useState<'modern' | 'classic' | 'minimalist' | 'eglenceli'>('modern');
  
  // Örnek veriler
  const sampleData = {
    recipientName: "Sevgilim",
    message: "Bu özel mesaj senin için hazırlandı. Umarım beğenirsin!",
    creatorName: "Örnek Oluşturan"
  };

  const defaultTextFields = getDefaultTextFields(template.slug);
  const sampleTextFields: TemplateTextFields = {
    ...defaultTextFields,
  };

  // Template'e göre özel default değerler
  if (template.slug === 'mutlu-yillar-fun') {
    if (!sampleTextFields.recipientName) {
      sampleTextFields.recipientName = "Canım Arkadaşım";
    }
    if (!sampleTextFields.mainMessage) {
      sampleTextFields.mainMessage = defaultTextFields.mainMessage || "Yeni yılın sana sağlık, mutluluk ve başarı getirmesini diliyorum! Bu yıl tüm hayallerin gerçek olsun. Mutlu yıllar! 🎉✨";
    }
  } else {
    if (!sampleTextFields.recipientName) {
      sampleTextFields.recipientName = sampleData.recipientName;
    }
    if (!sampleTextFields.mainMessage) {
      sampleTextFields.mainMessage = sampleData.message;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:h-16 sm:py-0">
            <div className="flex items-center space-x-4">
              <Link href={`/templates/${template.slug}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Geri
                </Button>
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {template.title}
                </h1>
              </div>
            </div>

            {/* Design Style Selector - Mobile Friendly */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Tasarım Stili:</span>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {Object.entries(designStyles).map(([key, style]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={selectedDesignStyle === key ? "default" : "outline"}
                    onClick={() => setSelectedDesignStyle(key as 'modern' | 'classic' | 'minimalist' | 'eglenceli')}
                    className="shrink-0 text-xs whitespace-nowrap"
                    aria-label={`${style.label} tasarımı`}
                  >
                    <span className="mr-1">{style.preview}</span>
                    <span className="hidden sm:inline">{style.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Template */}
      <div className="w-full">
        <TemplateRenderer 
          template={template}
          designStyle={selectedDesignStyle}
          recipientName={sampleTextFields.recipientName || sampleData.recipientName}
          message={sampleTextFields.mainMessage || sampleData.message}
          creatorName={sampleData.creatorName}
          isPreview={true}
          textFields={sampleTextFields}
        />
      </div>
    </div>
  );
}
