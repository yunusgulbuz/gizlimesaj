'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, MessageCircle, Star, Loader2 } from "lucide-react";
import TemplateRenderer from "./template-renderer";
import { getTemplateConfig, getDefaultTextFields, TemplateTextFields } from "./types";
import { YouTubePlayer, extractVideoId } from "@/components/ui/youtube-player";
import ResizableLayout from "@/components/ResizableLayout";
import { usePreviewWidth } from "@/hooks/usePreviewWidth";
import { TemplateComments } from "@/components/template-comments";
import { StarRating } from "@/components/ui/star-rating";
import { createClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";
import { ScrollToFormButton } from "./scroll-to-form-button";

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

const getCategoryBadgeClass = (category?: string, index?: number) => {
  return 'rounded-full border border-gray-200/80 bg-white/80 px-3 py-1 text-[0.7rem] font-medium text-gray-600 shadow-sm backdrop-blur-sm';
};

interface DesignStyleMeta {
  label: string;
  description: string;
  color: string;
  preview: string;
}

const baseDesignStyles: Record<'modern' | 'classic' | 'minimalist' | 'eglenceli', DesignStyleMeta> = {
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

type DesignStyleKey = keyof typeof baseDesignStyles;

const designStyleOverrides: Record<string, Record<DesignStyleKey, DesignStyleMeta>> = {
  'eglenceli-oyunlu-mesajlar': {
    modern: {
      label: "Baloncuk Mesaj Oyunu",
      description: "Baloncuklara dokun, gizli kelimeleri ortaya çıkar",
      color: "bg-sky-100 text-sky-800",
      preview: "🎈"
    },
    classic: {
      label: "Kazı Kazan Mesajı",
      description: "Kazı katmanını aç ve sürpriz mesajı gör",
      color: "bg-amber-100 text-amber-800",
      preview: "🪄"
    },
    minimalist: {
      label: "Quiz Macerası",
      description: "Soruları cevapla ve final mesajını keşfet",
      color: "bg-cyan-100 text-cyan-800",
      preview: "❓"
    },
    eglenceli: {
      label: "Puzzle Love",
      description: "Puzzle parçalarını tamamla ve mesajı oku",
      color: "bg-fuchsia-100 text-fuchsia-800",
      preview: "💞"
    }
  },
  'yeni-ev-arac-tebrigi': {
    modern: {
      label: "Anahtar Yakala",
      description: "Kayan anahtarlara dokun, gizli kelimeleri topla",
      color: "bg-cyan-100 text-cyan-800",
      preview: "🗝️"
    },
    classic: {
      label: "Garaj Kazı-Kazan",
      description: "Garaj kaplamasını kazı, sürpriz mesajı aç",
      color: "bg-amber-100 text-amber-800",
      preview: "🚗"
    },
    minimalist: {
      label: "Park Et Mini Oyun",
      description: "Aracı sürükle, hedefe yerleştir ve mesajı aç",
      color: "bg-slate-100 text-slate-800",
      preview: "🅿️"
    },
    eglenceli: {
      label: "Plan Panorama Puzzle",
      description: "3x3 parçaları tamamla, yeni ev panoramasını gör",
      color: "bg-purple-100 text-purple-800",
      preview: "🧩"
    }
  }
};

const DEFAULT_PREVIEW_MESSAGE = 'Bu bir örnek mesajdır. Kendi mesajınızı yazarak nasıl görüneceğini görebilirsiniz.';

const yilDonumuCommonFields = ['recipientName', 'mainMessage', 'musicUrl'] as const;

const yilDonumuDesignFieldMap: Record<DesignStyleKey, string[]> = {
  modern: ['headlineMessage', 'timelineIntro', 'timelineEvents', 'timelineCta', 'timelineClosing', 'timelineFinalMessage'],
  classic: ['hatiraHeadline', 'hatiraSubtitle', 'hatiraLetter', 'hatiraMemories', 'hatiraBackgroundUrl', 'hatiraButtonLabel'],
  minimalist: ['minimalistTitle', 'minimalistSubtitle', 'minimalistLockMessage', 'minimalistRevealMessage', 'minimalistHighlights', 'minimalistFooter'],
  eglenceli: ['quizHeadline', 'quizIntro', 'quizButtonLabel', 'quizItems', 'quizHintLabel', 'quizCompletionTitle', 'quizCompletionMessage', 'quizFinalMessage', 'quizReplay']
};

const yilDonumuLuxeCommonFields = ['recipientName', 'mainMessage', 'musicUrl'] as const;

const yilDonumuLuxeDesignFieldMap: Record<DesignStyleKey, string[]> = {
  modern: ['glassHeading', 'glassSubheading', 'glassBody', 'glassButtonLabel', 'glassLightNote', 'glassPhotoInitial', 'glassPhotoUrl'],
  classic: ['timelineHeading', 'timelineIntro', 'timelineEntries', 'timelineButtonLabel', 'timelineOutroHeading', 'timelineOutroMessage'],
  minimalist: ['minimalHeading', 'minimalMessage', 'minimalDateLabel', 'minimalButtonLabel', 'minimalFooter', 'minimalCelebrationBadge', 'minimalCelebrationTitle', 'minimalCelebrationSubtitle', 'minimalPhotoUrl'],
  eglenceli: ['funHeading', 'funSubheading', 'funMessage', 'funPhotoUrl', 'funButtonLabel', 'funConfettiMessage', 'funCelebrationTitle', 'funFloatingNote']
};

const isTebrigiCommonFields = ['recipientName', 'mainMessage', 'newPosition', 'companyName', 'musicUrl'] as const;

const isTebrigiDesignFieldMap: Record<DesignStyleKey, string[]> = {
  modern: ['highlightMessage', 'highlightOne', 'highlightTwo', 'ctaLabel', 'ctaUrl', 'secondaryCtaLabel'],
  classic: ['certificateTitle', 'certificateSubtitle', 'footerMessage', 'downloadLabel'],
  minimalist: ['minimalTitle', 'supplementMessage', 'messageButtonLabel', 'messageButtonUrl', 'startDate'],
  eglenceli: ['headline', 'subHeadline', 'celebrationButtonLabel', 'teamName', 'secondaryMessage']
};

const yeniIsTerfiCommonFields = ['recipientName', 'positionTitle', 'companyName', 'eventDate'] as const;

const yeniIsTerfiDesignFieldMap: Record<DesignStyleKey, string[]> = {
  modern: ['heroPhotoUrl', 'modernTitle', 'modernSubtitle', 'modernMessage', 'modernSecondary', 'optionalQuote'],
  classic: ['heroPhotoUrl', 'premiumTitle', 'premiumMessage', 'premiumHighlight', 'premiumFooter'],
  minimalist: ['minimalTitle', 'minimalMessage', 'minimalFooter', 'minimalLogoText', 'minimalPhotoUrl'],
  eglenceli: ['creativeHeadline', 'creativeSubheadline', 'creativeNote', 'profilePhotoUrl', 'themePhotoUrl']
};

const mezuniyetCommonFields = ['recipientName', 'musicUrl'] as const;

const mezuniyetDesignFieldMap: Record<DesignStyleKey, string[]> = {
  modern: ['modernHeadline', 'modernSubtitle', 'modernBody', 'modernPhotoUrl'],
  minimalist: [
    'minimalistHeadline',
    'minimalistSubtitle',
    'minimalistMessage',
    'minimalistPhoto1Url',
    'minimalistPhoto2Url',
    'minimalistPhoto3Url',
    'minimalistPhoto4Url',
    'minimalistPhoto5Url',
    'minimalistPhoto6Url'
  ],
  classic: ['premiumHeadline', 'premiumSubtitle', 'premiumMessage', 'premiumPhotoUrl'],
  eglenceli: ['artHeadline', 'artSubtitle', 'artBody', 'artPhoto1Url', 'artPhoto2Url', 'artPhoto3Url']
};

const eglenceliOyunluCommonFields = ['recipientName', 'mainMessage', 'musicUrl'] as const;

const eglenceliOyunluDesignFieldMap: Record<DesignStyleKey, string[]> = {
  modern: ['bubbleHeadline', 'bubbleSubtitle', 'bubbleWords', 'bubbleCompletionText', 'bubbleHint'],
  classic: ['scratchHeadline', 'scratchSubtitle', 'scratchHiddenMessage', 'scratchCompletionText', 'scratchConfettiNote', 'scratchHint'],
  minimalist: [
    'quizHeadline',
    'quizSubtitle',
    'quizQuestion1',
    'quizOptions1',
    'quizAnswer1',
    'quizQuestion2',
    'quizOptions2',
    'quizAnswer2',
    'quizQuestion3',
    'quizOptions3',
    'quizAnswer3',
    'quizCompletionTitle',
    'quizSuccessMessage',
    'quizTryAgainMessage',
    'quizRetryButtonLabel',
    'quizScoreLabel'
  ],
  eglenceli: [
    'puzzleHeadline',
    'puzzleSubtitle',
    'puzzlePhotoUrl',
    'puzzleCompletionTitle',
    'puzzleCompletionMessage',
    'puzzleHint',
    'puzzleResetLabel'
  ]
};

const yeniEvAracCommonFields = ['recipientName', 'mainMessage', 'musicUrl'] as const;

const yeniEvAracDesignFieldMap: Record<DesignStyleKey, string[]> = {
  modern: ['keyHeadline', 'keySubtitle', 'keyWords', 'keyCompletionTitle', 'keyCompletionMessage', 'keyHint'],
  classic: [
    'garageHeadline',
    'garageSubtitle',
    'garageHiddenMessage',
    'garageCompletionTitle',
    'garageCompletionText',
    'garageConfettiMessage',
    'garageHint',
    'garageResetLabel'
  ],
  minimalist: [
    'parkingHeadline',
    'parkingSubtitle',
    'parkingSuccessTitle',
    'parkingSuccessMessage',
    'parkingHint',
    'parkingResetLabel'
  ],
  eglenceli: [
    'panoHeadline',
    'panoSubtitle',
    'panoPhotoUrl',
    'panoCompletionTitle',
    'panoCompletionMessage',
    'panoHint',
    'panoResetLabel'
  ]
};

interface TemplateFormPageProps {
  template: Template;
  durations: Duration[];
  templatePricing: TemplatePricing[];
  isPreview?: boolean;
}

export type { TemplateFormPageProps };

export default function TemplateFormPage({ template, durations, templatePricing, isPreview = false }: TemplateFormPageProps) {
  const [selectedDesignStyle, setSelectedDesignStyle] = useState<DesignStyleKey>('modern');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [creatorName, setCreatorName] = useState(isPreview ? 'Örnek Oluşturan' : '');
  const [specialDate, setSpecialDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { width: persistedPreviewWidth, commitWidth: commitPreviewWidth } = usePreviewWidth();
  const supabase = useMemo(() => createClient(), []);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [ratingSummary, setRatingSummary] = useState<{ average: number | null; total: number }>({ average: null, total: 0 });
  const [userRatingValue, setUserRatingValue] = useState<number | null>(null);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const commentsSectionRef = useRef<HTMLDivElement | null>(null);
  const availableDesignStyles = useMemo<Record<DesignStyleKey, DesignStyleMeta>>(
    () => designStyleOverrides[template.slug] ?? baseDesignStyles,
    [template.slug]
  );

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (isMounted) {
          setSessionUser(data.user ?? null);
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı:', error);
      }
    };

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSessionUser(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const handleRatingSummaryUpdate = useCallback((stats: { averageRating: number; totalRatings: number }) => {
    setRatingSummary({
      average: Number.isFinite(stats.averageRating) ? stats.averageRating : 0,
      total: stats.totalRatings ?? 0,
    });
  }, []);

  const handleUserRatingChange = useCallback((rating: number | null) => {
    setUserRatingValue(rating);
  }, []);

  const handleCommentCountUpdate = useCallback((count: number) => {
    setCommentCount(count);
  }, []);

  const scrollToComments = useCallback(() => {
    commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  
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

    if (template.slug === 'yil-donumu-luxe') {
      const allowedKeys = new Set<string>([
        ...yilDonumuLuxeCommonFields,
        ...(yilDonumuLuxeDesignFieldMap[selectedDesignStyle] ?? [])
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

    if (template.slug === 'yeni-is-terfi-tebrigi') {
      const allowedKeys = new Set<string>([
        ...yeniIsTerfiCommonFields,
        ...(yeniIsTerfiDesignFieldMap[selectedDesignStyle] ?? [])
      ]);
      return templateConfig.fields.filter(field => allowedKeys.has(field.key));
    }

    if (template.slug === 'mezuniyet-tebrigi') {
      const allowedKeys = new Set<string>([
        ...mezuniyetCommonFields,
        ...(mezuniyetDesignFieldMap[selectedDesignStyle] ?? [])
      ]);
      return templateConfig.fields.filter(field => allowedKeys.has(field.key));
    }

    if (template.slug === 'eglenceli-oyunlu-mesajlar') {
      const allowedKeys = new Set<string>([
        ...eglenceliOyunluCommonFields,
        ...(eglenceliOyunluDesignFieldMap[selectedDesignStyle] ?? [])
      ]);
      return templateConfig.fields.filter(field => allowedKeys.has(field.key));
    }

    if (template.slug === 'yeni-ev-arac-tebrigi') {
      const allowedKeys = new Set<string>([
        ...yeniEvAracCommonFields,
        ...(yeniEvAracDesignFieldMap[selectedDesignStyle] ?? [])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Form validation
    if (!selectedDuration) {
      alert('Lütfen bir süre seçin');
      return;
    }
    
    // Check if user is logged in
    if (!sessionUser) {
      alert('Lütfen önce giriş yapın');
      return;
    }
    
    if (!creatorName.trim()) {
      alert('Lütfen adınızı girin');
      return;
    }

    // Check required text fields
    const requiredFields = visibleTextFieldConfig.filter(field => field.required);
    for (const field of requiredFields) {
      if (!textFields[field.key]?.trim()) {
        alert(`Lütfen ${field.label} alanını doldurun`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare payment data
      const selectedDurationData = durations.find(d => d.id.toString() === selectedDuration);
      const amount = selectedDurationData ? getPriceForDuration(selectedDurationData.id) : '0';
      
      const paymentData = {
        template_id: template.id,
        recipient_name: textFields.recipientName || '',
        sender_name: creatorName,
        message: textFields.mainMessage || '',
        buyer_email: sessionUser.email || '',
        special_date: specialDate,
        expires_in_hours: selectedDurationData ? 24 * selectedDurationData.days : 24,
        duration_id: selectedDurationData ? selectedDurationData.id : parseInt(selectedDuration),
        text_fields: textFields,
        design_style: selectedDesignStyle,
        bg_audio_url: null
      };

      // Call payment API
      const response = await fetch('/api/payments/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Ödeme formu oluşturulamadı');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Ödeme başlatılamadı');
      }

      // Redirect to payment page
      window.location.href = `/payment/${result.order_id}`;
      
    } catch (error) {
      console.error('Ödeme hatası:', error);
      alert('Ödeme işlemi başlatılamadı. Lütfen tekrar deneyin.');
      setIsSubmitting(false);
    }
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
            Formu doldurun, birmesajmutluluk&apos;unuzu dakikalar içinde tamamlayın
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

            {/* Design Style Selection - Mobile Optimized */}
            <div className="space-y-3">
              <Label>Tasarım Stili *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(availableDesignStyles).map(([key, style]) => (
                  <div key={key} className="relative">
                    <input
                      type="radio"
                      id={`style-${key}`}
                      name="designStyle"
                      value={key}
                      checked={selectedDesignStyle === key}
                      onChange={(e) => setSelectedDesignStyle(e.target.value as DesignStyleKey)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`style-${key}`}
                      className={`block cursor-pointer rounded-lg border-2 p-3 sm:p-4 transition-all hover:border-pink-300 ${
                        selectedDesignStyle === key ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-xl sm:text-2xl shrink-0">{style.preview}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-medium text-sm sm:text-base">{style.label}</span>
                            <Badge className={`${style.color} text-[10px] sm:text-xs w-fit`} variant="secondary">
                              {style.label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2">
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
              <Input 
                id="special-date" 
                type="date" 
                placeholder="Özel bir tarih seçin"
                value={specialDate}
                onChange={(e) => setSpecialDate(e.target.value)}
              />
              <p className="text-xs text-gray-500">Yıldönümü, doğum günü gibi özel tarihler</p>
            </div>


            {/* Price Summary */}
            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between text-sm">
                <span>Şablon:</span>
                <span>{template.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tasarım Stili:</span>
                <span>{availableDesignStyles[selectedDesignStyle].label}</span>
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
            <Button
              type="submit"
              className={`w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-200 transition-all duration-300 ${
                isSubmitting 
                  ? 'animate-pulse bg-gradient-to-r from-rose-400 to-purple-500 shadow-lg shadow-rose-300/50' 
                  : 'hover:from-rose-600 hover:to-purple-700 hover:shadow-xl hover:shadow-rose-300/50'
              }`}
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="bg-gradient-to-r from-white to-rose-100 bg-clip-text text-transparent">
                    İşleniyor...
                  </span>
                </div>
              ) : (
                'Satın Al'
              )}
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
            'Size özel birmesajmutluluk bağlantısı e-postanıza gönderilsin',
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
        <div className="container mx-auto px-4 py-6 lg:py-10">
          <header className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/80 px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.45em] text-gray-400">birmesajmutluluk Studio</p>
              <p className="text-sm text-gray-600">Kişisel mesaj şablonlarınızı burada yapılandırın.</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 sm:text-sm">
              <span className="hidden items-center gap-1 sm:flex">
                <Heart className="h-3.5 w-3.5 text-rose-400" />
                {primaryCategoryLabel}
              </span>
              {!isPreview && (
                <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-900">
                  <Link href="/templates">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Sürprizlere Dön
                  </Link>
                </Button>
              )}
            </div>
          </header>

          <section className="mt-6 rounded-2xl border border-white/50 bg-white/70 px-4 py-5 shadow-md backdrop-blur md:mt-8 md:px-6 md:py-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                  <span className="rounded-full bg-rose-100/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-rose-500">
                    {primaryCategoryLabel}
                  </span>
                  {templateCategories.slice(1).map((category, index) => (
                    <Badge key={`${category.value}-${index}`} className={category.className}>
                      {category.label}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1 space-y-3">
                    <h1 className="text-xl font-semibold text-gray-900 md:text-[26px]">
                      {template.title}
                    </h1>
                    <p className="max-w-2xl text-sm text-gray-600 md:text-base">
                      {template.description || `${primaryCategoryLabel} kategorisinde özel mesaj şablonu. birmesajmutluluk ile sahne sahne duygularınızı anlatın.`}
                    </p>
                  </div>
                  {!isPreview && (
                    <ScrollToFormButton className="shrink-0 bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-200" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 md:text-sm">
                  <div
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 shadow-sm ring-1 ring-white/60 transition hover:bg-white"
                    onClick={scrollToComments}
                  >
                    <Star className="h-4 w-4 text-amber-500" />
                    <StarRating rating={ratingSummary.average ?? 0} readonly size="sm" />
                    <span className="font-semibold text-gray-900">
                      {ratingSummary.average !== null ? ratingSummary.average.toFixed(1) : '—'}
                    </span>
                    <span className="text-xs text-gray-500">/ 5 · {ratingSummary.total} değerlendirme</span>
                  </div>
                  <div
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 shadow-sm ring-1 ring-white/60 transition hover:bg-white"
                    onClick={scrollToComments}
                  >
                    <MessageCircle className="h-4 w-4 text-rose-400" />
                    <span className="font-semibold text-gray-900">{commentCount ?? '—'}</span>
                    <span className="text-xs text-gray-500">yorum</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preview yönlendirme butonu */}
          <div className="mt-6 text-center rounded-3xl border border-white/50 bg-white/80 p-8 shadow-md backdrop-blur">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              İnteraktif Düzenleme
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tasarım üzerinde direk düzenleme yapabilmek için önizleme sayfasına gidin
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-lg"
            >
              <Link href={previewUrl}>
                Önizleme Sayfasına Git
              </Link>
            </Button>
          </div>

          {formSection}

          {/* Yorum & Puanlama */}
          <section className="mt-6">
            <div
              ref={commentsSectionRef}
              className="rounded-3xl border border-white/50 bg-white/80 p-5 shadow-md backdrop-blur"
            >
              <TemplateComments
                templateId={template.id}
                user={sessionUser ?? undefined}
                userRating={userRatingValue}
                ratingSummary={ratingSummary}
                onRatingSummaryChange={handleRatingSummaryUpdate}
                onUserRatingChange={handleUserRatingChange}
                onCountChange={handleCommentCountUpdate}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
