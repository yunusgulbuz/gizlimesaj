'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { 
  ArrowLeft,
  Save,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { toast } from 'sonner';

interface Template {
  id: string;
  title: string;
  slug: string;
  audience: string;
}

interface Duration {
  id: number;
  label: string;
  days: number;
}

export default function NewPricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [durations, setDurations] = useState<Duration[]>([]);

  // Breadcrumb items for new pricing page
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Fiyatlandırma', href: '/admin/pricing' },
    { label: 'Yeni Fiyatlandırma' }
  ];

  const [formData, setFormData] = useState({
    template_id: '',
    duration_id: '',
    price_try: '',
    old_price: '',
    is_active: true
  });

  // Load templates and durations on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    
    try {
      // Load templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('templates')
        .select('id, title, slug, audience')
        .eq('is_active', true)
        .order('title');

      if (templatesError) throw templatesError;
      setTemplates(templatesData || []);

      // Load durations
      const { data: durationsData, error: durationsError } = await supabase
        .from('durations')
        .select('id, label, days')
        .eq('is_active', true)
        .order('days');

      if (durationsError) throw durationsError;
      setDurations(durationsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Veriler yüklenirken hata oluştu');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.template_id || !formData.duration_id || !formData.price_try) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      // Check if pricing already exists for this template-duration combination
      const { data: existing, error: checkError } = await supabase
        .from('template_pricing')
        .select('id')
        .eq('template_id', formData.template_id)
        .eq('duration_id', parseInt(formData.duration_id))
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        toast.error('Bu şablon ve süre kombinasyonu için zaten fiyatlandırma mevcut');
        return;
      }

      // Insert new pricing
      const { error: insertError } = await supabase
        .from('template_pricing')
        .insert({
          template_id: formData.template_id,
          duration_id: parseInt(formData.duration_id),
          price_try: formData.price_try,
          old_price: formData.old_price ? parseFloat(formData.old_price) : null,
          is_active: formData.is_active
        });

      if (insertError) throw insertError;

      toast.success('Fiyatlandırma başarıyla eklendi');
      router.push('/admin/pricing');
    } catch (error) {
      console.error('Error creating pricing:', error);
      toast.error('Fiyatlandırma eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/pricing">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Fiyatlandırmaya Dön
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Yeni Fiyatlandırma</h1>
            <p className="text-muted-foreground">Şablon için yeni fiyatlandırma oluşturun</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Fiyatlandırma Bilgileri</CardTitle>
          <CardDescription>
            Bir şablon ve süre seçerek o kombinasyon için fiyat belirleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Selection */}
            <div className="space-y-2">
              <Label htmlFor="template">Şablon *</Label>
              <Select 
                value={formData.template_id} 
                onValueChange={(value) => handleInputChange('template_id', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Şablon seçin" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <span>{template.title}</span>
                        <span className="text-xs text-muted-foreground">
                          ({template.audience})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <Label htmlFor="duration">Süre *</Label>
              <Select 
                value={formData.duration_id} 
                onValueChange={(value) => handleInputChange('duration_id', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Süre seçin" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration.id} value={duration.id.toString()}>
                      {duration.label} ({duration.days} gün)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Fiyat (₺) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="49.90"
                value={formData.price_try}
                onChange={(e) => handleInputChange('price_try', e.target.value)}
                required
              />
            </div>

            {/* Old Price */}
            <div className="space-y-2">
              <Label htmlFor="old_price">Eski Fiyat (₺)</Label>
              <Input
                id="old_price"
                type="number"
                step="0.01"
                min="0"
                placeholder="99.90"
                value={formData.old_price}
                onChange={(e) => handleInputChange('old_price', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                İndirimli fiyat göstermek için eski fiyatı girin (opsiyonel)
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_active">Aktif</Label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Kaydet
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/pricing">
                  İptal
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}