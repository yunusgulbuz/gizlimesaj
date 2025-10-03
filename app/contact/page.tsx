'use client';

import { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import HeaderAuthButton from "@/components/auth/header-auth-button";
import {
  Heart,
  Mail,
  MapPin,
  Phone,
  Send,
  MessageCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    title: "E-posta",
    value: "destek@heartnote.com",
    description: "7/24 e-posta desteği",
  },
  {
    icon: Phone,
    title: "Telefon",
    value: "+90 (555) 123 45 67",
    description: "Hafta içi 09:00 - 18:00",
  },
  {
    icon: MapPin,
    title: "Adres",
    value: "İstanbul, Türkiye",
    description: "Merkez ofisimiz",
  },
  {
    icon: Clock,
    title: "Çalışma Saatleri",
    value: "Pazartesi - Cuma",
    description: "09:00 - 18:00",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Lütfen tüm alanları doldurun');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Heartnote</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/templates" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                Şablonlar
              </Link>
              <Link href="/pricing" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                Fiyatlar
              </Link>
              <HeaderAuthButton />
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="border-b border-gray-100 bg-gradient-to-b from-rose-50/50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                  İletişime Geçin
                </span>
              </h1>
              <p className="mb-8 text-lg text-gray-600 md:text-xl">
                Sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşın.
                <br className="hidden md:block" />
                Size yardımcı olmaktan mutluluk duyarız!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="border-b border-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-purple-100">
                        <Icon className="h-6 w-6 text-rose-600" />
                      </div>
                      <h3 className="mb-1 font-semibold text-gray-900">{info.title}</h3>
                      <p className="mb-1 text-sm font-medium text-gray-900">{info.value}</p>
                      <p className="text-xs text-gray-500">{info.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
              {/* Form */}
              <div>
                <div className="mb-8">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                    Bize Yazın
                  </h2>
                  <p className="text-gray-600">
                    Aşağıdaki formu doldurarak bize ulaşabilirsiniz. En kısa sürede
                    size geri dönüş yapacağız.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Adınız Soyadınız</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ahmet Yılmaz"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresiniz</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ahmet@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Konu</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Mesajınızın konusu"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mesajınız</Label>
                    <Textarea
                      id="message"
                      placeholder="Mesajınızı buraya yazın..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Mesajı Gönder
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* FAQ / Additional Info */}
              <div className="space-y-8">
                <Card className="border-0 bg-gradient-to-br from-rose-50 to-purple-50 shadow-sm">
                  <CardContent className="p-8">
                    <h3 className="mb-6 text-2xl font-bold text-gray-900">
                      Sıkça Sorulan Sorular
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                          Ne kadar sürede dönüş alırım?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Genellikle 24 saat içinde tüm mesajlara yanıt veriyoruz.
                          Acil durumlar için telefon desteğimizi kullanabilirsiniz.
                        </p>
                      </div>

                      <div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                          Teknik destek alabilir miyim?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Elbette! Teknik sorunlarınız için destek ekibimiz size
                          adım adım yardımcı olacaktır.
                        </p>
                      </div>

                      <div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                          Özel şablon talebi nasıl yapılır?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Bu formu kullanarak özel şablon talebinizi iletebilirsiniz.
                          Tasarım ekibimiz sizinle iletişime geçecektir.
                        </p>
                      </div>

                      <div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                          Kurumsal çözümler sunuyor musunuz?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Evet! Şirketler için özel paketlerimiz mevcut.
                          Detaylı bilgi için bize ulaşın.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-xl">
                  <CardContent className="p-8">
                    <h3 className="mb-4 text-2xl font-bold">
                      Canlı Destek
                    </h3>
                    <p className="mb-6 text-white/90">
                      Hemen yanıt almak için canlı destek hattımızı kullanabilirsiniz.
                      Hafta içi 09:00 - 18:00 arası aktif.
                    </p>
                    <Button
                      size="lg"
                      className="w-full bg-white text-purple-600 hover:bg-gray-100"
                      asChild
                    >
                      <Link href="#">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Canlı Desteğe Bağlan
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media / Links */}
        <section className="border-t border-gray-100 bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              Sosyal Medyada Bizi Takip Edin
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="lg" asChild>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                  Twitter
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                  Facebook
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">Heartnote</span>
              </div>
              <p className="text-sm text-gray-600">
                Sevdiklerinize özel dijital mesajlar ve hediyeler oluşturun.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Ürün</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/templates" className="hover:text-rose-600">Şablonlar</Link></li>
                <li><Link href="/pricing" className="hover:text-rose-600">Fiyatlandırma</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Şirket</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-rose-600">Hakkımızda</Link></li>
                <li><Link href="/contact" className="hover:text-rose-600">İletişim</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Yasal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-rose-600">Gizlilik Politikası</Link></li>
                <li><Link href="/terms" className="hover:text-rose-600">Kullanım Şartları</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Heartnote. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
