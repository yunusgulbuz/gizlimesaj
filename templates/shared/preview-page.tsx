'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShoppingCart, Music, Loader2 } from 'lucide-react';
import TemplateRenderer from './template-renderer';
import { getDefaultTextFields, TemplateTextFields } from './types';
import { DurationSelectionDialog } from '@/components/DurationSelectionDialog';
import { LoginRequiredDialog } from '@/components/LoginRequiredDialog';
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
  const supabase = useMemo(() => createClient(), []);
  const [sessionUser, setSessionUser] = useState<User | null>(null);

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
      <div className="bg-white/80 backdrop-blur shadow-sm border-b sticky top-0 z-50">
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
                <p className="text-xs text-gray-500">Tasarım üzerinde düzenlemek için tıklayın</p>
              </div>
            </div>

            {/* Design Style Selector */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Tasarım:</span>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {Object.entries(designStyles).map(([key, style]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={selectedDesignStyle === key ? "default" : "outline"}
                    onClick={() => setSelectedDesignStyle(key as 'modern' | 'classic' | 'minimalist' | 'eglenceli')}
                    className="shrink-0 text-xs whitespace-nowrap"
                  >
                    <span className="mr-1">{style.preview}</span>
                    <span className="hidden sm:inline">{style.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Buy Button */}
            <Button
              onClick={handleBuyClick}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-lg"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Satın Al
                </>
              )}
            </Button>
          </div>

          {/* Music URL Input */}
          <div className="pb-3 border-t pt-3 mt-2">
            <div className="flex items-center gap-3 max-w-2xl">
              <Music className="w-4 h-4 text-gray-500 shrink-0" />
              <div className="flex-1">
                <Label htmlFor="music-url" className="text-xs text-gray-600 mb-1 block">
                  YouTube Müzik Linki (İsteğe Bağlı)
                </Label>
                <Input
                  id="music-url"
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={textFields.musicUrl || ''}
                  onChange={(e) => handleTextFieldChange('musicUrl', e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
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
    </div>
  );
}
