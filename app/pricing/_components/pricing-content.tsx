'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeaderAuthButton from '@/components/auth/header-auth-button';
import { MobileDrawerMenu } from '@/components/mobile-drawer-menu';
import { createClient } from '@/lib/supabase-client';
import {
  Heart,
  Check,
  Sparkles,
  Star,
  Crown,
  MessageCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';

type SupabaseUser = {
  [key: string]: any;
} | null;

const creditPackages = [
  {
    id: 'credits-10',
    name: 'Başlangıç',
    subtitle: '10 AI Kullanım Hakkı',
    credits: 10,
    price: '199',
    description: 'AI ile tasarım yapmaya başlayın',
    features: [
      '10 AI template oluşturma/düzenleme',
      'Sınırsız taslak saklama',
      'Generate + Refine aynı havuzdan',
      'Kredi asla bitmesin',
      'İstediğiniz zaman kullanın',
    ],
    highlight: false,
    icon: Sparkles,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'credits-30',
    name: 'Popüler',
    subtitle: '30 AI Kullanım Hakkı',
    credits: 30,
    price: '499',
    description: 'En çok tercih edilen paket',
    features: [
      '30 AI template oluşturma/düzenleme',
      'Sınırsız taslak saklama',
      'Generate + Refine aynı havuzdan',
      'Kredi asla bitmesin',
      'İstediğiniz zaman kullanın',
      '33% daha avantajlı!',
    ],
    highlight: true,
    icon: Star,
    gradient: 'from-purple-500 to-pink-500',
    badge: 'En Avantajlı',
  },
  {
    id: 'credits-100',
    name: 'Premium',
    subtitle: '100 AI Kullanım Hakkı',
    credits: 100,
    price: '999',
    description: 'Sınırsız yaratıcılık için',
    features: [
      '100 AI template oluşturma/düzenleme',
      'Sınırsız taslak saklama',
      'Generate + Refine aynı havuzdan',
      'Kredi asla bitmesin',
      'İstediğiniz zaman kullanın',
      '50% daha avantajlı!',
      'Öncelikli AI üretimi',
    ],
    highlight: false,
    icon: Crown,
    gradient: 'from-amber-500 to-orange-500',
  },
];

export default function PricingContent() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<SupabaseUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-rose-100/70 bg-white/90 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                birmesajmutluluk
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/templates"
                className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:block"
              >
                Sürprizler
              </Link>
              <Link
                href="/pricing"
                className="hidden text-sm font-medium text-slate-900 transition-colors hover:text-slate-900 md:block"
              >
                Planlar
              </Link>
              <Link
                href="/about"
                className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:block"
              >
                Hakkımızda
              </Link>
              <Link
                href="/contact"
                className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:block"
              >
                İletişim
              </Link>
              <div className="hidden md:block">
                <HeaderAuthButton />
              </div>
              <MobileDrawerMenu user={user} />
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          <span>AI ile Özel Tasarımlar</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
          AI Kullanım Kredileri
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
          Yapay zeka ile özel mesaj tasarımları oluşturun. Tek seferlik satın alın, istediğiniz zaman kullanın.
        </p>
        <p className="text-lg text-purple-600 font-semibold">
          ✨ Herkes 10 taslak saklayabilir • 💳 Kredi asla bitmez • 🎨 Generate + Refine aynı havuzdan
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {creditPackages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden transition-all hover:shadow-2xl ${
                  pkg.highlight
                    ? 'border-2 border-purple-500 shadow-xl scale-105'
                    : 'border-gray-200'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    {pkg.badge}
                  </div>
                )}

                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-4`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-base">
                    {pkg.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        ₺{pkg.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Tek seferlik ödeme • {pkg.credits} AI kredisi
                    </p>
                  </div>

                  <p className="text-sm text-gray-700 mb-6">
                    {pkg.description}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    className={`w-full ${
                      pkg.highlight
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : ''
                    }`}
                  >
                    <Link href={`/credits/checkout?package=${pkg.id}`}>
                      {user ? 'Satın Al' : 'Giriş Yap ve Satın Al'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Free Credit Info */}
        <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 border border-purple-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🎁 Ücretsiz 1 AI Kredisi
              </h3>
              <p className="text-gray-700 mb-4">
                Hesap oluşturduğunuzda otomatik olarak 1 ücretsiz AI kredisi kazanırsınız.
                Sistemi deneyip AI ile ilk tasarımınızı oluşturabilirsiniz!
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-white">
                  ✨ 10 taslak saklama hakkı
                </Badge>
                <Badge variant="outline" className="bg-white">
                  💎 Sınırsız süre
                </Badge>
                <Badge variant="outline" className="bg-white">
                  🎨 Tüm şablon kütüphanesi
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Sıkça Sorulan Sorular
          </h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Krediler ne zaman biter?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Kredileriniz <strong>asla bitmez</strong>! Satın aldığınız kredileri istediğiniz zaman,
                  istediğiniz hızda kullanabilirsiniz. Aylık yenileme yok.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Generate ve Refine aynı mı sayılır?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Evet! Her AI işlemi (yeni tasarım oluşturma veya mevcut tasarımı düzenleme)
                  aynı kredi havuzundan <strong>1 kredi</strong> harcar.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kaç taslak tutabilirim?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>Herkes 10 taslak</strong> saklayabilir - ücretsiz kullanıcılar da dahil!
                  Taslak slotları dolduğunda eski tasarımlarınızı silebilir veya satın alabilirsiniz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Kredilerim biterse ne olur?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Kredileriniz bittiğinde yeni bir paket satın alabilirsiniz. Mevcut taslaklar ve
                  tüm verileriniz güvende kalır, sadece yeni AI işlemi yapamazsınız.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hemen Başlayın!
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            İlk tasarımınızı oluşturmak için 1 ücretsiz kredi kazanın
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            {user ? (
              <Link href="/ai-template-creator">
                AI Tasarım Oluştur
                <Sparkles className="h-5 w-5 ml-2" />
              </Link>
            ) : (
              <Link href="/register">
                Ücretsiz Kayıt Ol
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
