'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Loader2, Palette, Save, Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import AITemplateRenderer from '@/components/ai-template-renderer';
import { DurationSelectionDialog } from '@/components/DurationSelectionDialog';
import { LoginRequiredDialog } from '@/components/LoginRequiredDialog';

interface AITemplateData {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  category: string;
  template_code: string;
  metadata: {
    recipientName?: string;
    mainMessage?: string;
    footerMessage?: string;
    colorScheme?: Record<string, string>;
    [key: string]: any;
  };
  created_at: string;
}

interface AITemplatePreviewProps {
  slug: string;
}

export default function AITemplatePreview({ slug }: AITemplatePreviewProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [template, setTemplate] = useState<AITemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>({});
  const [showDurationDialog, setShowDurationDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [durations, setDurations] = useState<any[]>([]);
  const [templatePricing, setTemplatePricing] = useState<any[]>([]);
  const [showRefinePanel, setShowRefinePanel] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refineProgress, setRefineProgress] = useState(0);

  // Load user and template data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Get AI template
        const { data: aiTemplate, error: templateError } = await supabase
          .from('ai_generated_templates')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (templateError || !aiTemplate) {
          setError('Şablon bulunamadı');
          setLoading(false);
          return;
        }

        // Check if user owns this template
        if (user && aiTemplate.user_id !== user.id) {
          setError('Bu şablonu görüntüleme yetkiniz yok');
          setLoading(false);
          return;
        }

        if (!user) {
          setError('Bu şablonu görüntülemek için giriş yapmalısınız');
          setLoading(false);
          return;
        }

        setTemplate(aiTemplate);
        setMetadata(aiTemplate.metadata || {});

        // Get durations for pricing (we'll use a default template's pricing for now)
        // In production, you might want to create a separate pricing system for AI templates
        const { data: durationsData } = await supabase
          .from('durations')
          .select('*')
          .eq('is_active', true)
          .order('days', { ascending: true });

        setDurations(durationsData || []);

        // Get a sample pricing (you can modify this to use specific AI template pricing)
        const { data: pricingData } = await supabase
          .from('template_pricing')
          .select('*')
          .eq('is_active', true)
          .limit(10);

        setTemplatePricing(pricingData || []);

        setLoading(false);
      } catch (err: any) {
        console.error('Error loading template:', err);
        setError('Şablon yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    loadData();
  }, [slug, supabase]);

  const handleMetadataChange = (newMetadata: any) => {
    setMetadata(newMetadata);
  };

  const handleSaveMetadata = async () => {
    if (!template) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('ai_generated_templates')
        .update({ metadata })
        .eq('id', template.id);

      if (error) throw error;

      // Show success message
      alert('Değişiklikler kaydedildi!');
    } catch (err) {
      console.error('Error saving metadata:', err);
      alert('Kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefineTemplate = async () => {
    if (!template || !refinePrompt.trim() || isRefining) return;

    setIsRefining(true);
    setRefineProgress(0);

    // Start progress animation
    const progressInterval = setInterval(() => {
      setRefineProgress((prev) => {
        if (prev < 30) return prev + 3;
        if (prev < 60) return prev + 1.5;
        if (prev < 85) return prev + 0.5;
        return prev + 0.1;
      });
    }, 500);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

      const response = await fetch('/api/ai-templates/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          refinePrompt: refinePrompt.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      setRefineProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Şablon iyileştirilemedi');
      }

      const result = await response.json();

      if (result.success) {
        // Update template state with refined version
        setTemplate({
          ...template,
          template_code: result.template.template_code,
          metadata: result.template.metadata,
        });
        setMetadata(result.template.metadata);
        setRefinePrompt('');
        setShowRefinePanel(false);
        alert('✨ Şablon başarıyla iyileştirildi!');
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('Error refining template:', err);

      if (err.name === 'AbortError') {
        alert('İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.');
      } else {
        alert(err.message || 'Şablon iyileştirilemedi. Lütfen tekrar deneyin.');
      }
    } finally {
      clearInterval(progressInterval);
      setIsRefining(false);
      setRefineProgress(0);
    }
  };

  const handleBuyClick = () => {
    if (!currentUser) {
      setShowLoginDialog(true);
      return;
    }
    setShowDurationDialog(true);
  };

  const handleDurationSelect = async (durationId: number, price: string) => {
    setShowDurationDialog(false);
    setIsSubmitting(true);

    try {
      if (!template) throw new Error('Template not found');

      const selectedDuration = durations.find(d => d.id === durationId);

      const paymentData = {
        template_id: template.id, // We'll need to handle AI templates differently in payment
        recipient_name: metadata.recipientName || '',
        sender_name: currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Kullanıcı',
        message: metadata.mainMessage || '',
        buyer_email: currentUser?.email || '',
        special_date: '',
        expires_in_hours: selectedDuration ? 24 * selectedDuration.days : 24,
        duration_id: durationId,
        text_fields: metadata,
        design_style: 'ai-generated',
        bg_audio_url: metadata.musicUrl || null,
        ai_template_id: template.id, // Special field for AI templates
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

      window.location.href = `/payment/${result.order_id}`;

    } catch (error) {
      console.error('Payment error:', error);
      alert('Ödeme işlemi başlatılamadı. Lütfen tekrar deneyin.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-4 text-gray-600">Şablon yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Şablon Bulunamadı</h1>
          <p className="text-gray-600 mb-6">{error || 'Bu şablon mevcut değil'}</p>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {template.title}
                </h1>
                <p className="text-xs text-purple-600">AI ile oluşturuldu ✨</p>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Refine Button */}
              <Button
                onClick={() => setShowRefinePanel(!showRefinePanel)}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={isRefining}
              >
                <Wand2 className="w-4 h-4" />
                <span className="hidden sm:inline">İyileştir</span>
                {showRefinePanel ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
              </Button>

              {/* Save Button */}
              <Button
                onClick={handleSaveMetadata}
                disabled={isSaving}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Kaydediliyor</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Kaydet</span>
                  </>
                )}
              </Button>

              {/* Buy Button */}
              <Button
                onClick={handleBuyClick}
                disabled={isSubmitting}
                className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm font-medium"
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
            </div>
          </div>
        </div>
      </div>

      {/* Refine Panel */}
      {showRefinePanel && (
        <div className="bg-white border-b shadow-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-purple-600" />
                      Şablonu İyileştir
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Yapmak istediğiniz değişiklikleri açıklayın (örn: "renkleri daha canlı yap", "daha fazla animasyon ekle")
                    </p>
                  </div>
                </div>

                <textarea
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder="Örnek: Arka plan rengini daha romantik yap, kalp animasyonları ekle..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                  rows={3}
                  maxLength={500}
                  disabled={isRefining}
                />

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {refinePrompt.length}/500 karakter
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setRefinePrompt('');
                        setShowRefinePanel(false);
                      }}
                      variant="ghost"
                      size="sm"
                      disabled={isRefining}
                    >
                      İptal
                    </Button>
                    <Button
                      onClick={handleRefineTemplate}
                      disabled={isRefining || !refinePrompt.trim() || refinePrompt.trim().length < 5}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      size="sm"
                    >
                      {isRefining ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          İyileştiriliyor...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          İyileştir
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {isRefining && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${refineProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>
                      {refineProgress < 30 && 'AI şablonu analiz ediyor...'}
                      {refineProgress >= 30 && refineProgress < 60 && 'Değişiklikler uygulanıyor...'}
                      {refineProgress >= 60 && refineProgress < 85 && 'Son rötuşlar yapılıyor...'}
                      {refineProgress >= 85 && 'Neredeyse hazır...'}
                    </span>
                    <span className="font-medium text-purple-600">{Math.round(refineProgress)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Template Preview */}
      <div className="w-full">
        <AITemplateRenderer
          templateCode={template.template_code}
          metadata={metadata}
          creatorName={currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0]}
          bgAudioUrl={metadata.musicUrl}
          isEditable={true}
          onMetadataChange={handleMetadataChange}
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
