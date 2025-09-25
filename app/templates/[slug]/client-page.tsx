'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, ArrowLeft, Play, Pause, Volume2, Eye, X } from "lucide-react";
import TemplateRenderer from "./template-renderer";
import { getTemplateConfig, getDefaultTextFields, TemplateTextFields } from "./types";

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
  id: string;
  name: string;
  hours: number;
  price: number;
}

const audienceLabels = {
  teen: { label: "Genç", color: "bg-blue-100 text-blue-800" },
  adult: { label: "Yetişkin", color: "bg-green-100 text-green-800" },
  classic: { label: "Klasik", color: "bg-gray-100 text-gray-800" },
  fun: { label: "Eğlenceli", color: "bg-yellow-100 text-yellow-800" },
  elegant: { label: "Zarif", color: "bg-purple-100 text-purple-800" }
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

interface ClientTemplatePageProps {
  template: Template;
  durations: Duration[];
  isPreview?: boolean;
}

export default function ClientTemplatePage({ template, durations, isPreview = false }: ClientTemplatePageProps) {
  const [selectedDesignStyle, setSelectedDesignStyle] = useState<keyof typeof designStyles>('modern');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [creatorName, setCreatorName] = useState(isPreview ? 'Örnek Oluşturan' : '');
  const [recipientName, setRecipientName] = useState(isPreview ? 'Örnek Alıcı' : '');
  const [customMessage, setCustomMessage] = useState(isPreview ? 'Bu bir örnek mesajdır. Gerçek mesajınızı buraya yazabilirsiniz.' : '');
  const [showPreview, setShowPreview] = useState(isPreview);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Çoklu mesaj desteği için yeni state
  const templateConfig = getTemplateConfig(template.slug);
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

  const selectedDurationData = durations.find(d => d.id === selectedDuration);

  const handleTextFieldChange = (key: string, value: string) => {
    setTextFields(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Backward compatibility için eski state'leri de güncelle
    if (key === 'recipientName') setRecipientName(value);
    if (key === 'mainMessage') setCustomMessage(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form submitted with design style:', selectedDesignStyle);
    console.log('Text fields:', textFields);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/templates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Şablonlara Dön
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge className={audienceLabels[template.audience].color}>
              {audienceLabels[template.audience].label}
            </Badge>
            <Badge className={designStyles[selectedDesignStyle].color}>
              {designStyles[selectedDesignStyle].preview} {designStyles[selectedDesignStyle].label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Template Preview - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <Eye className="w-4 h-4" />
                  Önizleme
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 lg:p-6">
                <div className="relative bg-gray-50 rounded-lg overflow-hidden min-h-[200px] lg:min-h-[300px]">
                  {/* Interactive Preview - Better mobile scaling */}
                  <div className="p-1 lg:p-3">
                    <div className="transform scale-75 lg:scale-75 origin-top-left w-[133%] lg:w-[133%] min-h-[180px] lg:h-auto overflow-visible">
                      <TemplateRenderer 
                        template={template}
                        designStyle={selectedDesignStyle}
                        recipientName={textFields.recipientName || recipientName || "Örnek Alıcı"}
                        message={textFields.mainMessage || customMessage || "Bu bir örnek mesajdır. Kendi mesajınızı yazarak nasıl görüneceğini görebilirsiniz."}
                        isPreview={true}
                        creatorName={creatorName}
                        textFields={textFields}
                      />
                    </div>
                  </div>
                  
                  {/* Back to Templates Button - Hidden on mobile to save space */}
                  {!isPreview && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="hidden lg:flex absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
                      asChild
                    >
                      <Link href="/templates">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Şablonlar
                      </Link>
                    </Button>
                  )}
                  
                  {/* Full Screen Preview Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-1 right-1 lg:top-2 lg:left-2 bg-white/90 backdrop-blur-sm text-xs lg:text-sm"
                    onClick={() => window.open(`/templates/${template.slug}/preview`, '_blank')}
                  >
                    <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className="hidden lg:inline">Tam Ekran</span>
                    <span className="lg:hidden">Büyüt</span>
                  </Button>
                </div>

                {/* Audio Player */}
                {template.bg_audio_url && (
                  <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg text-sm">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-3 h-3 lg:w-4 lg:h-4" /> : <Play className="w-3 h-3 lg:w-4 lg:h-4" />}
                    </Button>
                    <Volume2 className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                    <span className="text-xs lg:text-sm text-gray-600">Arka Plan Müziği</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mobile Back Button */}
            {!isPreview && (
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/templates">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Şablonlara Dön
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Preview Button - Only visible on mobile */}
          <div className="lg:hidden mb-4">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Önizlemeyi Göster
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Önizleme
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                    <div className="p-3">
                      <TemplateRenderer 
                        template={template}
                        designStyle={selectedDesignStyle}
                        recipientName={recipientName || "Örnek Alıcı"}
                        message={customMessage || "Bu bir örnek mesajdır. Kendi mesajınızı yazarak nasıl görüneceğini görebilirsiniz."}
                        isPreview={true}
                        creatorName={creatorName}
                      />
                    </div>
                  </div>
                  
                  {/* Audio Player in Modal */}
                  {template.bg_audio_url && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Volume2 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Arka Plan Müziği</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(`/templates/${template.slug}/preview`, '_blank')}
                    >
                      Tam Ekran
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Kapat
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Order Form - Takes more space */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Info Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  {template.title}
                </CardTitle>
                <CardDescription>
                  {template.description || `${audienceLabels[template.audience].label} kategorisinde özel mesaj şablonu`}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mesajınızı Oluşturun</CardTitle>
                <CardDescription>
                  Formu doldurun ve özel mesajınızı hazırlayın
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
                  {templateConfig && templateConfig.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>{field.label} *</Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          id={field.key}
                          placeholder={field.placeholder}
                          rows={4}
                          value={textFields[field.key] || ''}
                          onChange={(e) => handleTextFieldChange(field.key, e.target.value)}
                          required
                        />
                      ) : (
                        <Input
                          id={field.key}
                          placeholder={field.placeholder}
                          value={textFields[field.key] || ''}
                          onChange={(e) => handleTextFieldChange(field.key, e.target.value)}
                          required
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
                            className={`block p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-pink-300 ${
                              selectedDesignStyle === key
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:bg-gray-50'
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
                                <p className="text-sm text-gray-600 mt-1">
                                  {style.description}
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Mesajınızın görünümünü belirleyin
                    </p>
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
                          <SelectItem key={duration.id} value={duration.id}>
                            <div className="flex justify-between items-center w-full">
                              <span>{duration.name}</span>
                              <span className="ml-4 font-semibold text-green-600">
                                ₺{duration.price}
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
                    />
                    <p className="text-xs text-gray-500">
                      Yıldönümü, doğum günü gibi özel tarihler
                    </p>
                  </div>

                  {/* Email for Link */}
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresiniz *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Mesaj bağlantısı bu adrese gönderilecek
                    </p>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
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
                      <span>{selectedDurationData ? selectedDurationData.name : 'Seçilmedi'}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Toplam:</span>
                      <span className="text-green-600">
                        ₺{selectedDurationData ? selectedDurationData.price : 0}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" size="lg">
                    Sepete Ekle
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nasıl Çalışır?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-3">
                  <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                  <p>Formu doldurun ve ödemeyi tamamlayın</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                  <p>Size özel bağlantı e-postanıza gönderilir</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                  <p>Bağlantıyı sevdiklerinizle paylaşın</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
                  <p>Mesajınız belirlenen süre boyunca aktif kalır</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}