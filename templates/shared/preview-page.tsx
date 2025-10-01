'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShoppingCart, Music, Loader2, MessageCircle, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import TemplateRenderer from './template-renderer';
import { getDefaultTextFields, TemplateTextFields } from './types';
import { DurationSelectionDialog } from '@/components/DurationSelectionDialog';
import { LoginRequiredDialog } from '@/components/LoginRequiredDialog';
import { TemplateComments } from '@/components/template-comments';
import { StarRating } from '@/components/ui/star-rating';
import { createClient } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';

interface Template {
  id: string;
  slug: string;
  title: string;
  audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant';
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

interface TemplatePreviewPageProps {
  template: Template;
  durations: Duration[];
  templatePricing: TemplatePricing[];
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

export default function TemplatePreviewPage({ template, durations, templatePricing }: TemplatePreviewPageProps) {
  const [selectedDesignStyle, setSelectedDesignStyle] = useState<'modern' | 'classic' | 'minimalist' | 'eglenceli'>('modern');
  const [textFields, setTextFields] = useState<TemplateTextFields>(() => getDefaultTextFields(template.slug));
  const [creatorName, setCreatorName] = useState('Örnek Oluşturan');
  const [showDurationDialog, setShowDurationDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isMusicInputOpen, setIsMusicInputOpen] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [ratingSummary, setRatingSummary] = useState<{ average: number | null; total: number }>({ average: 0, total: 0 });
  const [userRatingValue, setUserRatingValue] = useState<number | null>(null);
  const [commentCount, setCommentCount] = useState<number>(0);

  // Load user session
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (isMounted) {
          setSessionUser(data.user ?? null);
          if (data.user) {
            // Set creator name from user metadata or email
            const userName = data.user.user_metadata?.full_name ||
                           data.user.email?.split('@')[0] ||
                           'Kullanıcı';
            setCreatorName(userName);
          }
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı:', error);
      }
    };

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSessionUser(session?.user ?? null);
        if (session?.user) {
          const userName = session.user.user_metadata?.full_name ||
                         session.user.email?.split('@')[0] ||
                         'Kullanıcı';
          setCreatorName(userName);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [supabase]);

  // Set default text fields based on template
  useEffect(() => {
    const defaults = getDefaultTextFields(template.slug);

    if (template.slug === 'mutlu-yillar-fun') {
      setTextFields({
        ...defaults,
        recipientName: defaults.recipientName || "Canım Arkadaşım",
        mainMessage: defaults.mainMessage || "Yeni yılın sana sağlık, mutluluk ve başarı getirmesini diliyorum! Bu yıl tüm hayallerin gerçek olsun. Mutlu yıllar! 🎉✨",
      });
    } else {
      setTextFields({
        ...defaults,
        recipientName: defaults.recipientName || "Sevgilim",
        mainMessage: defaults.mainMessage || "Bu özel mesaj senin için hazırlandı. Umarım beğenirsin!",
      });
    }
  }, [template.slug]);

  const handleTextFieldChange = (key: string, value: string) => {
    setTextFields(prev => ({
      ...prev,
      [key]: value
    }));
  };

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

  // Fetch initial rating summary and comment count
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch rating summary
        const ratingResponse = await fetch(`/api/templates/${template.id}/ratings`);
        if (ratingResponse.ok) {
          const ratingData = await ratingResponse.json();
          setRatingSummary({
            average: ratingData.averageRating ?? null,
            total: ratingData.totalRatings ?? 0,
          });
          setUserRatingValue(ratingData.userRating ?? null);
        }

        // Fetch comment count
        const commentResponse = await fetch(`/api/templates/${template.id}/comments?page=1&limit=1`);
        if (commentResponse.ok) {
          const commentData = await commentResponse.json();
          setCommentCount(commentData.pagination?.total ?? 0);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [template.id]);

  const handleBuyClick = () => {
    // Check if user is logged in
    if (!sessionUser) {
      setShowLoginDialog(true);
      return;
    }

    // Show duration selection dialog
    setShowDurationDialog(true);
  };

  const handleDurationSelect = async (durationId: number, price: string) => {
    setShowDurationDialog(false);
    setIsSubmitting(true);

    try {
      const selectedDurationData = durations.find(d => d.id === durationId);

      const paymentData = {
        template_id: template.id,
        recipient_name: textFields.recipientName || '',
        sender_name: creatorName,
        message: textFields.mainMessage || '',
        buyer_email: sessionUser?.email || '',
        special_date: '',
        expires_in_hours: selectedDurationData ? 24 * selectedDurationData.days : 24,
        duration_id: durationId,
        text_fields: textFields,
        design_style: selectedDesignStyle,
        bg_audio_url: textFields.musicUrl || template.bg_audio_url
      };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Row */}
          <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-3 min-w-0">
              <Link href={`/templates/${template.slug}`}>
                <Button variant="ghost" size="sm" className="shrink-0">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Geri
                </Button>
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {template.title}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Tasarım üzerinde düzenlemek için tıklayın</p>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              {/* Buy Button - Full Width on Mobile */}
              <Button
                onClick={handleBuyClick}
                disabled={isSubmitting}
                className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm font-medium flex-1 sm:flex-initial"
                size="sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>İşleniyor</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    <span>Satın Al</span>
                  </>
                )}
              </Button>

              {/* Comments & Rating Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComments(true)}
                className="gap-2 shrink-0 hover:bg-gray-50"
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {ratingSummary.average !== null && ratingSummary.average > 0
                      ? ratingSummary.average.toFixed(1)
                      : '0.0'}
                  </span>
                  <span className="text-xs text-gray-500">({ratingSummary.total})</span>
                </div>
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{commentCount}</span>
                  <span className="text-xs text-gray-500 hidden sm:inline">yorum</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Design Style Selector */}
          <div className="pb-3 border-t pt-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600 shrink-0">Tasarım Stili:</span>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {Object.entries(designStyles).map(([key, style]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={selectedDesignStyle === key ? "default" : "outline"}
                    onClick={() => setSelectedDesignStyle(key as 'modern' | 'classic' | 'minimalist' | 'eglenceli')}
                    className="shrink-0 text-xs"
                  >
                    <span className="mr-1.5">{style.preview}</span>
                    {style.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsible Music Input */}
          <Collapsible open={isMusicInputOpen} onOpenChange={setIsMusicInputOpen} className="border-t border-gray-100">
            <div className="py-2.5">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Music className={`w-4 h-4 ${textFields.musicUrl ? 'text-rose-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${textFields.musicUrl ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {textFields.musicUrl ? 'Müzik Eklendi ✓' : 'Müzik Ekle (İsteğe Bağlı)'}
                    </span>
                  </div>
                  {isMusicInputOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 pb-2 px-1">
                <div className="space-y-2">
                  <Label htmlFor="music-url" className="text-xs text-gray-600">
                    YouTube Video Linki
                  </Label>
                  <Input
                    id="music-url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={textFields.musicUrl || ''}
                    onChange={(e) => handleTextFieldChange('musicUrl', e.target.value)}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Mesajınıza arka plan müziği ekleyin
                  </p>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </div>

      {/* Template Preview - Editable */}
      <div className="w-full">
        <TemplateRenderer
          template={template}
          designStyle={selectedDesignStyle}
          recipientName={textFields.recipientName || 'Sevgilim'}
          message={textFields.mainMessage || 'Bu özel mesaj senin için hazırlandı'}
          creatorName={creatorName}
          isPreview={true}
          textFields={textFields}
          onTextFieldChange={handleTextFieldChange}
          isEditable={true}
        />
      </div>

      {/* Dialogs */}
      <DurationSelectionDialog
        open={showDurationDialog}
        onOpenChange={setShowDurationDialog}
        durations={durations}
        templatePricing={templatePricing}
        onSelect={handleDurationSelect}
      />

      <LoginRequiredDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />

      {/* Comments Sheet - Side Panel */}
      <Sheet open={showComments} onOpenChange={setShowComments}>
        <SheetContent
          side="right"
          className="w-full sm:w-[540px] sm:max-w-[90vw] overflow-y-auto p-0"
        >
          <div className="h-full flex flex-col">
            <SheetHeader className="px-6 py-4 border-b bg-white/80 backdrop-blur sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(false)}
                  className="shrink-0 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <SheetTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="w-5 h-5 text-rose-500" />
                    Yorumlar & Değerlendirmeler
                  </SheetTitle>
                  <SheetDescription className="text-sm text-gray-600">
                    Bu şablon hakkında kullanıcı görüşlerini inceleyin
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <TemplateComments
                templateId={template.id}
                user={sessionUser ?? undefined}
                userRating={userRatingValue}
                ratingSummary={ratingSummary}
                onRatingSummaryChange={handleRatingSummaryUpdate}
                onUserRatingChange={handleUserRatingChange}
                onCountChange={handleCommentCountUpdate}
                hideHeader={true}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
