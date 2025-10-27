'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Save,
  DollarSign,
  Calendar,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

interface Duration {
  id: number;
  label: string;
  days: number;
  is_active: boolean;
}

interface AITemplatePricing {
  id: number;
  duration_id: number;
  price_try: string;
  old_price: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  duration: {
    label: string;
    days: number;
  };
}

export default function AITemplatePricingPage() {
  const supabase = createClient();
  const [durations, setDurations] = useState<Duration[]>([]);
  const [existingPricing, setExistingPricing] = useState<AITemplatePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [prices, setPrices] = useState<Record<number, { price: string; oldPrice: string }>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get durations
      const { data: durationsData, error: durationsError } = await supabase
        .from('durations')
        .select('*')
        .eq('is_active', true)
        .order('days');

      if (durationsError) throw durationsError;

      // Get existing pricing
      const { data: pricingData, error: pricingError } = await supabase
        .from('ai_template_pricing')
        .select(`
          *,
          duration:durations(label, days)
        `)
        .order('duration_id');

      if (pricingError) throw pricingError;

      setDurations(durationsData || []);
      setExistingPricing(pricingData || []);

      // Initialize prices state
      const initialPrices: Record<number, { price: string; oldPrice: string }> = {};
      (durationsData || []).forEach((duration: Duration) => {
        const existing = (pricingData || []).find((p: any) => p.duration_id === duration.id);
        initialPrices[duration.id] = {
          price: existing?.price_try || '',
          oldPrice: existing?.old_price || '',
        };
      });
      setPrices(initialPrices);

    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      Object.entries(prices).forEach(([durationId, { price, oldPrice }]) => {
        formData.append(`price_${durationId}`, price);
        formData.append(`old_price_${durationId}`, oldPrice);
      });

      const response = await fetch('/api/admin/ai-template-pricing', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Fiyatlar kaydedilemedi');
      }

      setSuccess('Fiyatlar başarıyla güncellendi!');
      await loadData(); // Reload data
    } catch (err: any) {
      console.error('Error saving prices:', err);
      setError(err.message || 'Fiyatlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Şablon Fiyatlandırması</h1>
          <p className="text-muted-foreground">
            Kullanıcıların AI ile oluşturdukları şablonlar için duration bazlı fiyat ayarları
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Pricing Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Şablon Fiyatlandırması
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tüm AI tarafından oluşturulan şablonlar için duration bazlı fiyatlandırma ayarları
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Önemli Bilgi</p>
                <p>
                  Bu fiyatlandırma sistemi, kullanıcıların AI ile oluşturdukları şablonları satın alırken
                  seçecekleri sürelere (duration) göre uygulanır. Örneğin: 1 gün için 19₺, 7 gün için 49₺.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {durations.map((duration) => {
              const existingPrice = existingPricing.find(p => p.duration_id === duration.id);

              return (
                <Card key={duration.id} className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {duration.label} ({duration.days} gün)
                        </Label>
                        <Badge variant="outline" className="mt-1">
                          Duration ID: {duration.id}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`price_${duration.id}`}>
                          Güncel Fiyat (₺) *
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id={`price_${duration.id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={prices[duration.id]?.price || ''}
                            onChange={(e) => setPrices(prev => ({
                              ...prev,
                              [duration.id]: {
                                ...prev[duration.id],
                                price: e.target.value
                              }
                            }))}
                            placeholder="19.99"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`old_price_${duration.id}`}>
                          Eski Fiyat (₺) - İndirim göstermek için
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id={`old_price_${duration.id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={prices[duration.id]?.oldPrice || ''}
                            onChange={(e) => setPrices(prev => ({
                              ...prev,
                              [duration.id]: {
                                ...prev[duration.id],
                                oldPrice: e.target.value
                              }
                            }))}
                            placeholder="29.99"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    {existingPrice && (
                      <div className="mt-3 text-xs text-gray-500">
                        Son güncelleme: {new Date(existingPrice.updated_at).toLocaleString('tr-TR')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                İptal
              </Link>
            </Button>
            <Button type="submit" size="lg" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Fiyatları Kaydet
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="text-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Nasıl Çalışır?</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Kullanıcılar AI ile şablon oluşturur (AI kredileri kullanarak)</li>
                <li>• Beğendiği şablonu satın almak istediğinde duration seçer</li>
                <li>• Seçilen duration için burada belirlenen fiyat uygulanır</li>
                <li>• Normal şablonlardan farklı olarak, AI şablonları için tek bir fiyat tablosu vardır</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
