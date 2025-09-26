'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft } from "lucide-react";
import TemplateRenderer from "./template-renderer";
import { getTemplateConfig, getDefaultTextFields, TemplateTextFields } from "./types";
import { YouTubePlayer, extractVideoId } from "@/components/ui/youtube-player";
import ResizableLayout from "@/components/ResizableLayout";
import { usePreviewWidth } from "@/hooks/usePreviewWidth";

interface Template {
  id: string;
  slug: string;
  title: string;
  audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant' | string[];
  preview_url: string | null;
  bg_audio_url: string | null;
  description: string | null;
}

interface Duration {
  id: number;
  label: string;
  days: number;
}

interface TemplatePricing {
  id: number;
  template_id: string;
  duration_id: number;
  price_try: string;
  is_active: boolean;
}

const audienceLabels = {
  teen: { label: "Genç", color: "bg-blue-100 text-blue-800" },
  adult: { label: "Yetişkin", color: "bg-green-100 text-green-800" },
  classic: { label: "Klasik", color: "bg-gray-100 text-gray-800" },
  fun: { label: "Eğlenceli", color: "bg-yellow-100 text-yellow-800" },
  elegant: { label: "Zarif", color: "bg-purple-100 text-purple-800" }
};


const categoryPalette = [
  'from-rose-500/30 via-rose-400/10 to-white text-rose-700',
  'from-purple-500/25 via-purple-400/10 to-white text-purple-700',
  'from-indigo-500/25 via-indigo-400/10 to-white text-indigo-700',
  'from-emerald-500/25 via-emerald-400/10 to-white text-emerald-700',
  'from-amber-500/25 via-amber-400/10 to-white text-amber-700',
];

const formatCategoryLabel = (value: string): string => {
  const normalized = value as keyof typeof audienceLabels;
  if (audienceLabels[normalized]) {
    return audienceLabels[normalized].label;
  }

  return value
    .split(/[\s,_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toLocaleUpperCase('tr-TR') + segment.slice(1))
    .join(' ');
};

const getCategoryBadgeClass = (_value: string, index: number) => {
  const palette = categoryPalette[index % categoryPalette.length];
  return `border-none bg-gradient-to-r ${palette} px-3 py-1.5 text-[0.7rem] font-semibold shadow-sm ring-1 ring-white/60 backdrop-blur-sm`;
};

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

const DEFAULT_PREVIEW_MESSAGE = 'Bu bir örnek mesajdır. Kendi mesajınızı yazarak nasıl görüneceğini görebilirsiniz.';

const yilDonumuCommonFields = ['recipientName', 'mainMessage', 'musicUrl'] as const;

const yilDonumuDesignFieldMap: Record<keyof typeof designStyles, string[]> = {
  modern: ['headlineMessage', 'timelineIntro', 'timelineEvents', 'timelineCta', 'timelineClosing', 'timelineFinalMessage'],
  classic: ['hatiraHeadline', 'hatiraSubtitle', 'hatiraLetter', 'hatiraMemories', 'hatiraBackgroundUrl', 'hatiraButtonLabel'],
  minimalist: ['minimalistTitle', 'minimalistSubtitle', 'minimalistLockMessage', 'minimalistRevealMessage', 'minimalistHighlights', 'minimalistFooter'],
  eglenceli: ['quizHeadline', 'quizIntro', 'quizButtonLabel', 'quizItems', 'quizHintLabel', 'quizCompletionTitle', 'quizCompletionMessage', 'quizFinalMessage', 'quizReplay']
};

const isTebrigiCommonFields = ['recipientName', 'mainMessage', 'newPosition', 'companyName'] as const;

const isTebrigiDesignFieldMap: Record<keyof typeof designStyles, string[]> = {
  modern: ['highlightMessage', 'highlightOne', 'highlightTwo', 'ctaLabel', 'ctaUrl', 'secondaryCtaLabel'],
  classic: ['certificateTitle', 'certificateSubtitle', 'footerMessage', 'downloadLabel'],
  minimalist: ['minimalTitle', 'supplementMessage', 'messageButtonLabel', 'messageButtonUrl', 'startDate'],
  eglenceli: ['headline', 'subHeadline', 'celebrationButtonLabel', 'teamName', 'secondaryMessage']
};

interface TemplateFormPageProps {
  template: Template;
  durations: Duration[];
  templatePricing: TemplatePricing[];
  isPreview?: boolean;
}

export type { TemplateFormPageProps };

export default function TemplateFormPage({ template, durations, templatePricing, isPreview = false }: TemplateFormPageProps) {
  const [selectedDesignStyle, setSelectedDesignStyle] = useState<keyof typeof designStyles>('modern');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [creatorName, setCreatorName] = useState(isPreview ? 'Örnek Oluşturan' : '');
  const { width: persistedPreviewWidth, commitWidth: commitPreviewWidth } = usePreviewWidth();
  
  // Çoklu mesaj desteği için yeni state
  const templateConfig = getTemplateConfig(template.slug);
  const visibleTextFieldConfig = useMemo(() => {
    if (!templateConfig) return [];
    if (template.slug === 'yil-donumu') {
      const allowedKeys = new Set<string>([
        ...yilDonumuCommonFields,
        ...(yilDonumuDesignFieldMap[selectedDesignStyle] ?? [])
      ]);
      return templateConfig.fields.filter(field => allowedKeys.has(field.key));
    }

    if (template.slug === 'is-tebrigi') {
      const allowedKeys = new Set<string>([
        ...isTebrigiCommonFields,
        ...(isTebrigiDesignFieldMap[selectedDesignStyle] ?? [])
      ]);
      return templateConfig.fields.filter(field => allowedKeys.has(field.key));
    }

    return templateConfig.fields;
  }, [template.slug, templateConfig, selectedDesignStyle]);
  const [textFields, setTextFields] = useState<TemplateTextFields>(() => {
    const defaults = getDefaultTextFields(template.slug);
    if (isPreview) {
      // Preview modunda örnek değerler
      return {
        recipientName: 'Örnek Alıcı',
        mainMessage: 'Bu bir örnek mesajdır. Gerçek mesajınızı buraya yazabilirsiniz.',
        footerMessage: defaults.footerMessage || '',
        subtitle: defaults.subtitle || '',
        quoteMessage: defaults.quoteMessage || ''
      };
    }
    return defaults;
  });

  const selectedDurationData = durations.find(d => d.id.toString() === selectedDuration);

  // Helper function to get price for a duration
  const getPriceForDuration = (durationId: number): string => {
    const pricing = templatePricing.find((p: TemplatePricing) => p.duration_id === durationId);
    return pricing ? pricing.price_try : '0';
  };

  const handleTextFieldChange = (key: string, value: string) => {
    setTextFields(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form submitted with design style:', selectedDesignStyle);
    console.log('Text fields:', textFields);
  };

  // Create custom breadcrumb items for template pages
  const rawCategories = Array.isArray(template.audience)
    ? template.audience.filter(Boolean)
    : template.audience
      ? [template.audience]
      : [];

  const templateCategories = rawCategories.length
    ? rawCategories.map((category, index) => ({
        value: category,
        label: formatCategoryLabel(category),
        className: getCategoryBadgeClass(category, index),
      }))
    : [{
        value: 'ozel',
        label: 'Özel',
        className: getCategoryBadgeClass('ozel', 0),
      }];

  const primaryCategoryLabel = templateCategories[0]?.label ?? 'Özel';

  const formSection = (
    <div className="space-y-6">
      <Card className="border-none bg-white/85 shadow-xl backdrop-blur">
        <CardHeader>
          <CardTitle>Mesajınızı Oluşturun</CardTitle>
          <CardDescription>
            Formu doldurun, Heartnote&apos;unuzu dakikalar içinde tamamlayın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Creator Name */}
            <div className="space-y-2">
              <Label htmlFor="creator-name">Oluşturan Kişi Adı *</Label>
              <Input
                id="creator-name"
                placeholder="Adınızı girin"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                required
              />
            </div>

            {/* Dynamic Text Fields */}
            {visibleTextFieldConfig.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}{field.required ? ' *' : ''}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.key}
                    placeholder={field.placeholder}
                    rows={4}
                    value={textFields[field.key] || ''}
                    onChange={(e) => handleTextFieldChange(field.key, e.target.value)}
                    required={field.required}
                  />
                ) : field.key === 'musicUrl' ? (
                  <div className="flex items-center gap-2">
                    <Input
                      id={field.key}
                      placeholder={field.placeholder}
                      value={textFields[field.key] || ''}
                      onChange={(e) => handleTextFieldChange(field.key, e.target.value)}
                      required={field.required}
                      className="flex-1"
                    />
                    {textFields[field.key] && (
                      <YouTubePlayer
                        videoId={extractVideoId(textFields[field.key]) || undefined}
                        autoPlay={false}
                        className="flex-shrink-0"
                      />
                    )}
                  </div>
                ) : (
                  <Input
                    id={field.key}
                    placeholder={field.placeholder}
                    value={textFields[field.key] || ''}
                    onChange={(e) => handleTextFieldChange(field.key, e.target.value)}
                    required={field.required}
                  />
                )}
                {field.type === 'textarea' && (
                  <p className="text-xs text-gray-500">
                    En az 10, en fazla 500 karakter
                  </p>
                )}
              </div>
            ))}

            {/* Design Style Selection */}
            <div className="space-y-3">
              <Label>Tasarım Stili *</Label>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(designStyles).map(([key, style]) => (
                  <div key={key} className="relative">
                    <input
                      type="radio"
                      id={`style-${key}`}
                      name="designStyle"
                      value={key}
                      checked={selectedDesignStyle === key}
                      onChange={(e) => setSelectedDesignStyle(e.target.value as keyof typeof designStyles)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`style-${key}`}
                      className={`block rounded-lg border-2 p-4 transition-all hover:border-pink-300 ${
                        selectedDesignStyle === key ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{style.preview}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{style.label}</span>
                            <Badge className={style.color} variant="secondary">
                              {style.label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {style.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">Mesajınızın görünümünü belirleyin</p>
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <Label htmlFor="duration">Süre Seçimi *</Label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration} required>
                <SelectTrigger>
                  <SelectValue placeholder="Süre seçin" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration.id} value={duration.id.toString()}>
                      <div className="flex w-full items-center justify-between">
                        <span>{duration.label}</span>
                        <span className="ml-4 font-semibold text-green-600">
                          ₺{getPriceForDuration(duration.id)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Special Date */}
            <div className="space-y-2">
              <Label htmlFor="special-date">Özel Tarih (Opsiyonel)</Label>
              <Input id="special-date" type="date" placeholder="Özel bir tarih seçin" />
              <p className="text-xs text-gray-500">Yıldönümü, doğum günü gibi özel tarihler</p>
            </div>

            {/* Email for Link */}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresiniz *</Label>
              <Input id="email" type="email" placeholder="ornek@email.com" required />
              <p className="text-xs text-gray-500">Mesaj bağlantısı bu adrese gönderilecek</p>
            </div>

            {/* Price Summary */}
            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between text-sm">
                <span>Şablon:</span>
                <span>{template.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tasarım Stili:</span>
                <span>{designStyles[selectedDesignStyle].label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Süre:</span>
                <span>{selectedDurationData ? selectedDurationData.label : 'Seçilmedi'}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm font-semibold">
                <span>Toplam:</span>
                <span className="text-green-600">
                  ₺{selectedDurationData ? getPriceForDuration(selectedDurationData.id) : 0}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-200" size="lg">
              Sepete Ekle
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none bg-white/70 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Nasıl Çalışır?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          {[
            'Formu doldurun ve ödemeyi tamamlayın',
            'Size özel Heartnote bağlantısı e-postanıza gönderilsin',
            'Bağlantıyı sevdiklerinizle paylaşın',
            'Mesajınız seçtiğiniz süre boyunca aktif kalsın',
          ].map((step, index) => (
            <div key={step} className="flex gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
                {index + 1}
              </div>
              <p>{step}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const previewRecipient = textFields.recipientName || 'Örnek Alıcı';
  const previewMessage = textFields.mainMessage || DEFAULT_PREVIEW_MESSAGE;
  const previewUrl = `/templates/${template.slug}/preview`;

  const previewContent = (
    <TemplateRenderer
      template={template}
      designStyle={selectedDesignStyle}
      recipientName={previewRecipient}
      message={previewMessage}
      isPreview
      creatorName={creatorName}
      textFields={textFields}
    />
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-rose-200/60 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-purple-200/50 blur-3xl" />
        <div className="absolute left-1/2 bottom-0 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-purple-600">
                <Heart className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="text-xl font-semibold text-gray-900">Heartnote</p>
                <p className="text-xs text-gray-500">Özel şablon düzenleyici</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isPreview && (
                <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-900">
                  <Link href="/templates">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Şablonlara Dön
                  </Link>
                </Button>
              )}
            </div>
          </header>

          <section className="mt-8 rounded-3xl border border-white/40 bg-white/80 p-6 shadow-xl backdrop-blur-lg">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {templateCategories.map((category, index) => (
                    <Badge key={`${category.value}-${index}`} className={category.className}>
                      {category.label}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
                  {template.title}
                </h1>
                <p className="max-w-2xl text-sm text-gray-600 md:text-base">
                  {template.description || `${primaryCategoryLabel} kategorisinde özel mesaj şablonu. Heartnote ile sahne sahne duygularınızı anlatın.`}
                </p>
              </div>
              <div className="w-full max-w-sm rounded-3xl bg-white/55 p-5 shadow-inner ring-1 ring-white/70 backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="text-3xl leading-none">{designStyles[selectedDesignStyle].preview}</span>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Seçili stil</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {designStyles[selectedDesignStyle].label}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      {designStyles[selectedDesignStyle].description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div className="rounded-2xl bg-white/70 p-3 shadow-sm ring-1 ring-white/70">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400">Süre seçenekleri</span>
                    <span className="mt-1 block text-sm font-semibold text-indigo-600">{durations.length}</span>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-3 shadow-sm ring-1 ring-white/70">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400">Ödeme sonrası</span>
                    <span className="mt-1 block text-sm font-semibold text-emerald-600">Anında yayın</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ResizableLayout
            form={formSection}
            preview={previewContent}
            previewWidth={persistedPreviewWidth}
            commitPreviewWidth={commitPreviewWidth}
            previewUrl={previewUrl}
          />
        </div>
      </div>
    </div>
  );
}
