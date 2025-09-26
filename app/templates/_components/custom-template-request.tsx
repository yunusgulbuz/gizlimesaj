'use client';

import { useMemo, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { toast } from 'sonner';

interface RequestFormState {
  name: string;
  email: string;
  templateType: string;
  message: string;
}

const initialFormState: RequestFormState = {
  name: '',
  email: '',
  templateType: '',
  message: '',
};

export default function CustomTemplateRequest() {
  const [formState, setFormState] = useState<RequestFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isDisabled = useMemo(() => {
    return !formState.name || !formState.email || !formState.templateType || !formState.message || formState.message.length < 20;
  }, [formState]);

  const handleChange = (field: keyof RequestFormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isDisabled || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('custom_template_requests')
        .insert({
          name: formState.name,
          email: formState.email,
          preferred_style: formState.templateType,
          message: formState.message,
        });

      if (error) {
        throw error;
      }

      toast.success('Talebiniz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      setFormState(initialFormState);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error submitting request:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast.error('Talebiniz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleOpen = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      if (event.detail?.triggerRequest) {
        setIsDialogOpen(true);
      }
    };

    window.addEventListener('open-custom-template', handleOpen);

    return () => window.removeEventListener('open-custom-template', handleOpen);
  }, []);

  return (
    <section id="custom-template-request" className="bg-white py-16 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600">
              <Sparkles className="h-4 w-4" />
              Özel Tasarım Talebi
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Aradığınız şablonu bulamadınız mı?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Takımımız, iş ortaklarınıza, arkadaşlarınıza ya da şirketinizin özel
              kampanyalarına uygun tamamen kişiselleştirilmiş şablonlar hazırlayabilir.
              İhtiyaçlarınızı paylaşın, sizin için benzersiz bir deneyim tasarlayalım.
            </p>
            <ul className="grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Kurumsal marka kimliğine uygun tasarımlar
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Tek seferlik ya da seri kullanım seçenekleri
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Animasyon, özel etkileşim ve müzik desteği
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                48 saat içinde ilk taslak teslimi
              </li>
            </ul>
            <div className="text-sm text-gray-500">
              <p>
                Canlı destek isterseniz{' '}
                <a
                  href="https://wa.me/905555555555"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-pink-600 hover:text-pink-700"
                >
                  WhatsApp üzerinden
                </a>{' '}
                bize ulaşabilirsiniz.
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="px-10 py-6 text-lg shadow-lg shadow-pink-200">
                  Özel Şablon İste
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Size nasıl yardımcı olabiliriz?</DialogTitle>
                  <DialogDescription>
                    Talebinizi iletin, en kısa sürede ekibimiz dönüş yapsın.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="custom-name">İsminiz *</Label>
                    <Input
                      id="custom-name"
                      value={formState.name}
                      onChange={handleChange('name')}
                      placeholder="Adınız Soyadınız"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-email">E-posta *</Label>
                    <Input
                      id="custom-email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange('email')}
                      placeholder="ornek@firma.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-template-type">Şablon tipi *</Label>
                    <Input
                      id="custom-template-type"
                      value={formState.templateType}
                      onChange={handleChange('templateType')}
                      placeholder="Örn. Kurumsal tebrik, özel kampanya, etkinlik"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-message">Detaylar *</Label>
                    <Textarea
                      id="custom-message"
                      value={formState.message}
                      onChange={handleChange('message')}
                      placeholder="Kim için hazırlanacak, hangi mesajlar yer alacak, teslim tarihi vb."
                      minLength={20}
                      rows={5}
                      required
                    />
                    <p className="text-xs text-gray-400">
                      Daha hızlı dönüş için talebinizi olabildiğince detaylandırın.
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isDisabled || isSubmitting}>
                    {isSubmitting ? 'Talebiniz hazırlanıyor...' : 'Talebi Gönder'}
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    Talebiniz güvenli bir şekilde kaydedilir ve en kısa sürede size dönüş yapılır.
                  </p>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
}
