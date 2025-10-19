'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Heart,
  PartyPopper,
  MessageCircle,
  Star,
  Gift,
  UserCheck
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

interface Category {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
  example: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'romantic',
    name: 'Romantik',
    icon: Heart,
    description: 'Sevgi dolu, romantik mesajlar',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    example: 'Sevgilime özel bir mesaj',
  },
  {
    id: 'birthday',
    name: 'Doğum Günü',
    icon: PartyPopper,
    description: 'Doğum günü kutlamaları',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    example: 'Arkadaşıma doğum günü sürprizi',
  },
  {
    id: 'thank-you',
    name: 'Teşekkür',
    icon: Star,
    description: 'Minnettarlık ve teşekkür mesajları',
    color: 'bg-green-100 text-green-800 border-green-200',
    example: 'Yardımları için teşekkür mesajı',
  },
  {
    id: 'apology',
    name: 'Özür',
    icon: MessageCircle,
    description: 'Af dileme ve barışma',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    example: 'Bir hata için özür mesajı',
  },
  {
    id: 'celebration',
    name: 'Kutlama',
    icon: Gift,
    description: 'Özel günler ve başarılar',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    example: 'Mezuniyet kutlaması',
  },
  {
    id: 'fun',
    name: 'Eğlenceli',
    icon: Sparkles,
    description: 'Neşeli ve renkli tasarımlar',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    example: 'Sürpriz parti daveti',
  },
];

export default function AITemplateCreator() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [remainingGenerations, setRemainingGenerations] = useState<number | null>(null);

  const supabase = createClient();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/ai-template-creator');
      } else {
        setUser(user);

        // Check remaining generations
        const response = await fetch('/api/ai-templates/generate');
        if (response.ok) {
          const data = await response.json();
          setRemainingGenerations(data.remaining);
        }
      }
    };

    checkAuth();
  }, [router, supabase]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setError('');
    // Kategoriye tıklayınca direkt prompt adımına geç
    setStep(2);
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedCategory) {
      setError('Lütfen bir kategori seçin');
      return;
    }
    if (step === 2 && (!prompt.trim() || prompt.length < 10)) {
      setError('Lütfen en az 10 karakter uzunluğunda bir açıklama girin');
      return;
    }

    setError('');
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setProgress(0);

    // Start progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Slow down as it approaches 90%
        if (prev < 30) return prev + 3;
        if (prev < 60) return prev + 1.5;
        if (prev < 85) return prev + 0.5;
        return prev + 0.1; // Very slow after 85%
      });
    }, 500);

    try {
      // Otomatik başlık oluştur
      const selectedCategoryData = CATEGORIES.find(c => c.id === selectedCategory);
      const autoTitle = `${selectedCategoryData?.name || 'Özel'} Mesajı - ${new Date().toLocaleDateString('tr-TR')}`;

      // Fetch with timeout (5 minutes = 300000ms)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);

      const response = await fetch('/api/ai-templates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: autoTitle,
          category: selectedCategory,
          userPrompt: prompt,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', data);
        console.error('Status:', response.status);
        throw new Error(data.error || 'Şablon oluşturulamadı');
      }

      // Complete progress and redirect
      clearInterval(progressInterval);
      setProgress(100);

      // Small delay to show 100% completion
      setTimeout(() => {
        router.push(`/templates/${data.template.slug}/preview`);
      }, 500);

    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('Generation error:', err);

      // Check if it's a timeout error
      if (err.name === 'AbortError') {
        setError('İşlem zaman aşımına uğradı. Lütfen daha kısa bir açıklama ile tekrar deneyin.');
      } else {
        setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }

      setIsGenerating(false);
      setProgress(0);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const selectedCategoryData = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Yapay Zeka ile Şablon Oluştur
            </h1>
          </div>
          <p className="text-gray-600">
            Birkaç adımda, yapay zeka tarafından size özel tasarlanmış şablon oluşturun
          </p>
          {remainingGenerations !== null && (
            <Badge variant="outline" className="mt-2">
              Kalan oluşturma hakkı: {remainingGenerations}/5
            </Badge>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center max-w-md mx-auto">
            {[1, 2].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= stepNum
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 2 && (
                  <div
                    className={`h-1 w-24 sm:w-32 mx-2 transition-colors ${
                      step > stepNum ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-xs sm:text-sm text-gray-600">
            <span className="text-center flex-1">Kategori Seç</span>
            <span className="text-center flex-1">Mesajını Tarif Et</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <Card className="border-none bg-white/90 backdrop-blur shadow-xl">
            <CardHeader>
              <CardTitle>Kategori Seçin</CardTitle>
              <CardDescription>
                Oluşturmak istediğiniz mesajın türünü seçin (tıklayınca otomatik geçecek)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="p-4 rounded-lg border-2 text-left transition-all hover:shadow-md hover:border-purple-300 border-gray-200"
                    >
                      <Icon className="h-8 w-8 mb-2" />
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      <Badge variant="outline" className={category.color}>
                        {category.example}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Prompt Input */}
        {step === 2 && (
          <Card className="border-none bg-white/90 backdrop-blur shadow-xl">
            <CardHeader>
              <CardTitle>Mesajınızı Tarif Edin</CardTitle>
              <CardDescription>
                Ne tür bir şablon istediğinizi detaylı açıklayın. Yapay zeka bunu kullanarak size özel tasarım oluşturacak.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCategoryData && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Seçilen kategori:</p>
                  <Badge className={`mt-1 ${selectedCategoryData.color}`}>
                    {selectedCategoryData.name}
                  </Badge>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="prompt">Açıklama *</Label>
                <Textarea
                  id="prompt"
                  placeholder="Örnek: Sevgilime 1. yıl dönümümüz için romantik bir mesaj. Kırmızı ve pembe renkler kullansın. Kalp ve çiçek motifleri olsun. Duygusal ve samimi bir ton olmalı..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                  maxLength={1000}
                  autoFocus
                />
                <p className="text-xs text-gray-500">
                  {prompt.length}/1000 karakter
                </p>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900 font-medium mb-2">💡 İpucu:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Renk tercihlerinizi belirtin</li>
                  <li>Hangi duyguları yansıtmasını istediğinizi yazın</li>
                  <li>Özel öğeler eklemek isterseniz belirtin (kalpler, çiçekler, vb.)</li>
                  <li>Hedef kitle için ton belirtin (samimi, eğlenceli, ciddi, vb.)</li>
                </ul>
              </div>

              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={isGenerating}
                >
                  Geri
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || prompt.length < 10 || isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Şablonu Oluştur
                    </>
                  )}
                </Button>
              </div>

              {isGenerating && (
                <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                  <div className="text-center mb-4">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-purple-600 mb-3" />
                    <p className="text-base font-medium text-purple-900 mb-1">
                      Yapay zeka şablonunuzu oluşturuyor...
                    </p>
                    <p className="text-sm text-purple-700">
                      Lütfen bekleyin, bu işlem 30-60 saniye sürebilir
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-purple-700">İlerleme</span>
                      <span className="text-xs font-semibold text-purple-900">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-full transition-all duration-500 ease-out animate-pulse"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs text-purple-600">
                        {progress < 30 && '🎨 Tasarım hazırlanıyor...'}
                        {progress >= 30 && progress < 60 && '✨ Renkler ve efektler ekleniyor...'}
                        {progress >= 60 && progress < 85 && '🎭 Son rötuşlar yapılıyor...'}
                        {progress >= 85 && progress < 100 && '🚀 Neredeyse hazır...'}
                        {progress >= 100 && '✅ Tamamlandı! Yönlendiriliyor...'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-6 border-none bg-white/70 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Nasıl Çalışır?</p>
                <ul className="space-y-1 text-gray-600 list-disc list-inside">
                  <li>Kategori seçin ve açıklama yazın</li>
                  <li>Yapay zeka size özel HTML tasarım oluşturur</li>
                  <li>Önizleme sayfasında metinleri ve renkleri düzenleyebilirsiniz</li>
                  <li>Beğenirseniz satın alıp paylaşabilirsiniz</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
