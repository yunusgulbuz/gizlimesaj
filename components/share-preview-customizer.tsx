'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SharePreviewCard } from '@/components/share-preview-card';
import { sharePreviewPresets, categories, getPresetsByCategory, getPresetById, type SharePreviewPreset } from '@/lib/share-preview-presets';
import { Loader2, Check, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

interface SharePreviewCustomizerProps {
  shortId: string;
  shareUrl: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultSiteName?: string;
  defaultImage?: string;
  onSave?: () => void;
}

export function SharePreviewCustomizer({
  shortId,
  shareUrl,
  defaultTitle = 'Sana Özel Bir Mesaj Var!',
  defaultDescription = 'Senin için hazırlanan özel mesajı görmek için linke tıkla.',
  defaultSiteName = 'birmesajmutluluk',
  defaultImage,
  onSave
}: SharePreviewCustomizerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [siteName, setSiteName] = useState(defaultSiteName);
  const [image, setImage] = useState(defaultImage || '');
  const [isCustom, setIsCustom] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load existing custom preview data
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const response = await fetch(`/api/personal-pages/${shortId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.share_preview_meta?.title) {
            setTitle(data.share_preview_meta.title);
            setDescription(data.share_preview_meta.description || defaultDescription);
            setSiteName(data.share_preview_meta.siteName || defaultSiteName);
            setImage(data.share_preview_meta.image || '');
            setSelectedCategory(data.share_preview_meta.category || '');
            setSelectedPresetId(data.share_preview_meta.presetId || '');
            setIsCustom(!!data.share_preview_meta.isCustom);
          }
        }
      } catch (error) {
        console.error('Failed to load existing preview data:', error);
      }
    };

    loadExistingData();
  }, [shortId, defaultDescription, defaultSiteName]);

  const handlePresetSelect = (preset: SharePreviewPreset) => {
    setSelectedPresetId(preset.id);
    setTitle(preset.title);
    setDescription(preset.description);
    setSiteName(preset.siteName);
    setImage(preset.image || '');
    setIsCustom(false);
  };

  const handleCustomChange = () => {
    setIsCustom(true);
    setSelectedPresetId('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setIsSaved(false);

    console.log('🚀 Saving preview settings...', {
      shortId,
      title,
      description,
      siteName,
      image
    });

    try {
      const response = await fetch(`/api/personal-pages/${shortId}/share-preview`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sharePreviewTitle: title,
          sharePreviewDescription: description,
          sharePreviewSiteName: siteName,
          sharePreviewImage: image,
          sharePreviewCategory: selectedCategory,
          sharePreviewPresetId: selectedPresetId,
          sharePreviewCustom: isCustom
        }),
      });

      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Failed to save preview settings');
      }

      const data = await response.json();
      console.log('✅ Success:', data);

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);

      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('❌ Failed to save preview settings:', error);
      alert(`Ayarlar kaydedilemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPresets = selectedCategory
    ? getPresetsByCategory(selectedCategory as SharePreviewPreset['category'])
    : [];

  return (
    <Card className="border-white/70 bg-white/90 backdrop-blur-sm shadow-xl shadow-purple-200/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-900">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Paylaşım Önizlemesi Özelleştir
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-500">
          WhatsApp, Facebook, Twitter gibi platformlarda paylaşırken nasıl görüneceğini özelleştir
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Kategori Seçin</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setSelectedPresetId('');
                }}
                className={`rounded-lg border-2 p-3 text-left transition-all ${
                  selectedCategory === cat.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="text-xl mb-1">{cat.icon}</div>
                <div className="text-xs font-medium text-gray-900">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Preset Selection */}
        {selectedCategory && filteredPresets.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Hazır Şablon Seçin</Label>
            <div className="grid grid-cols-1 gap-2">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    selectedPresetId === preset.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{preset.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {preset.title}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {preset.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleCustomChange}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 p-3 text-sm font-medium text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-all"
            >
              + Özel Olarak Düzenle
            </button>
          </div>
        )}

        {/* Custom Fields */}
        {(selectedPresetId || isCustom || !selectedCategory) && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preview-title" className="text-sm font-medium">
                Başlık
              </Label>
              <Input
                id="preview-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  handleCustomChange();
                }}
                placeholder="Örn: iPhone 17 Pro Max Çekilişi"
                className="bg-white"
                maxLength={100}
              />
              <p className="text-xs text-gray-500">{title.length}/100 karakter</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preview-description" className="text-sm font-medium">
                Açıklama
              </Label>
              <Textarea
                id="preview-description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  handleCustomChange();
                }}
                placeholder="Örn: Yeni nesil iPhone 17 Pro Max kazanma şansını kaçırma!"
                className="bg-white resize-none"
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-500">{description.length}/200 karakter</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preview-sitename" className="text-sm font-medium">
                Site Adı
              </Label>
              <Input
                id="preview-sitename"
                value={siteName}
                onChange={(e) => {
                  setSiteName(e.target.value);
                  handleCustomChange();
                }}
                placeholder="Örn: Çekiliş Kampanyası"
                className="bg-white"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preview-image" className="text-sm font-medium">
                Görsel URL (Opsiyonel)
              </Label>
              <Input
                id="preview-image"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  handleCustomChange();
                }}
                placeholder="https://example.com/image.jpg"
                className="bg-white"
              />
              <p className="text-xs text-gray-500">
                Görsel boyutu tercihen 1200x630 piksel olmalıdır
              </p>
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Önizleme</Label>
          <div className="flex justify-center rounded-lg bg-gray-50 p-4">
            <SharePreviewCard
              title={title}
              description={description}
              siteName={siteName}
              image={image}
              url={shareUrl}
            />
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving || !title || !description}
          className="w-full bg-purple-600 text-white hover:bg-purple-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : isSaved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Kaydedildi!
            </>
          ) : (
            'Ayarları Kaydet'
          )}
        </Button>

        {isSaved && (
          <div className="space-y-3">
            <p className="text-center text-sm text-green-600 font-medium">
              Paylaşım önizleme ayarları başarıyla kaydedildi!
            </p>

            {/* Cache Warning and Tools */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <RefreshCw className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-amber-900">
                    Önemli: WhatsApp Cache Temizliği
                  </p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    WhatsApp ve sosyal medya platformları URL'leri cache'ler. Değişikliklerin görünmesi için cache'i temizlemeniz gerekir:
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => {
                    const debugUrl = `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(shareUrl)}`;
                    window.open(debugUrl, '_blank');
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 border-amber-300 bg-white text-amber-900 hover:bg-amber-50"
                >
                  <ExternalLink className="h-4 w-4" />
                  Facebook/WhatsApp Cache Temizle
                </Button>

                <p className="text-xs text-amber-700">
                  1. Yukarıdaki butona tıklayın
                  <br />
                  2. Açılan sayfada "Scrape Again" butonuna tıklayın
                  <br />
                  3. Birkaç saniye bekleyin, sonra WhatsApp'ta tekrar paylaşın
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
