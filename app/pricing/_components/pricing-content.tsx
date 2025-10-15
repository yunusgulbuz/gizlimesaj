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
} from 'lucide-react';

type SupabaseUser = {
  [key: string]: any;
} | null;

const pricingPlans = [
  {
    id: 'monthly-10',
    name: 'Başlangıç',
    subtitle: 'Aylık 10 Sürpriz',
    price: '999',
    period: '/ay',
    description: 'Sevdiklerinize düzenli sürprizler yapmaya başlayın',
    features: [
      'Ayda 10 dijital sürpriz mesajı',
      'Tüm şablon kütüphanesine erişim',
      'Müzik ve animasyon desteği',
      '7 gün erişim süresi',
      'E-posta desteği',
    ],
    highlight: false,
    icon: Heart,
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    id: 'monthly-20',
    name: 'Popüler',
    subtitle: 'Aylık 20 Sürpriz',
    price: '1799',
    period: '/ay',
    description: 'En çok tercih edilen paketimiz',
    features: [
      'Ayda 20 dijital sürpriz mesajı',
      'Tüm şablon kütüphanesine erişim',
      'Müzik ve animasyon desteği',
      '14 gün erişim süresi',
      'Öncelikli e-posta desteği',
      'Özel şablon talebi hakkı',
    ],
    highlight: true,
    icon: Star,
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'monthly-30',
    name: 'Premium',
    subtitle: 'Aylık 30 Sürpriz',
    price: '2499',
    period: '/ay',
    description: 'Sınırsız dijital hediye deneyimi',
    features: [
      'Ayda 30 dijital sürpriz mesajı',
      'Tüm şablon kütüphanesine erişim',
      'Müzik ve animasyon desteği',
      '30 gün erişim süresi',
      '7/24 öncelikli destek',
      '3 özel şablon talebi hakkı',
      'İlk erişim yeni özelliklere',
    ],
    highlight: false,
    icon: Crown,
    gradient: 'from-amber-500 to-orange-500',
  },
];

interface PricingContentProps {
  initialUser: SupabaseUser;
}

export default function PricingContent({ initialUser }: PricingContentProps) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<SupabaseUser>(initialUser);

  useEffect(() => {
    const populateUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
    };

    populateUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">birmesajmutluluk</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/templates" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                Sürprizler
              </Link>
              <Link href="/pricing" className="hidden text-sm font-medium text-gray-900 md:block">
                Planlar
              </Link>
              <Link href="/about" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                Hakkımızda
              </Link>
              <Link href="/contact" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                İletişim
              </Link>
              <div className="hidden md:block">
                <HeaderAuthButton />
              </div>
              <MobileDrawerMenu user={user ?? undefined} />
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-gray-100 bg-gradient-to-b from-rose-50/50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-6 bg-rose-100 text-rose-700 hover:bg-rose-100">
                <Sparkles className="mr-1 h-3 w-3" />
                Aylık paketlerimizle tasarruf edin
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Size Uygun
                <br />
                <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                  Paketi Seçin
                </span>
              </h1>
              <p className="mb-8 text-lg text-gray-600 md:text-xl">
                Sevdiklerinize düzenli sürprizler yapın, her ay daha fazla tasarruf edin.
                <br className="hidden md:block" />
                Tüm paketlerde tüm özelliklere tam erişim.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pricingPlans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden ${
                      plan.highlight
                        ? 'border-2 border-purple-500 shadow-xl ring-2 ring-purple-100'
                        : 'border-gray-200 shadow-sm'
                    }`}
                  >
                    {plan.highlight && (
                      <div className="absolute right-4 top-4">
                        <Badge className="bg-purple-500 text-white hover:bg-purple-600">En Popüler</Badge>
                      </div>
                    )}

                    <CardHeader className="pb-8 pt-6">
                      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${plan.gradient}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-base">{plan.subtitle}</CardDescription>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">Yakında</span>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">Fiyatlandırma çok yakında açıklanacak</p>
                    </CardHeader>

                    <CardContent className="pb-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Button
                        className={`w-full ${
                          plan.highlight ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gray-900'
                        }`}
                        size="lg"
                        disabled
                      >
                        Yakında
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white py-16">
          <div className="container mx-auto px-4">
            <Card className="border-0 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 text-white shadow-xl">
              <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-6 w-6" />
                    <Badge className="border-white/20 bg-white/20 text-white hover:bg-white/30">Özel Paketler</Badge>
                  </div>
                  <h2 className="text-3xl font-bold md:text-4xl">Özel İhtiyaçlarınız mı Var?</h2>
                  <p className="text-lg text-white/90">
                    Kurumsal paketler, toplu alımlar veya özel çözümler için bizimle iletişime geçin. Size özel bir paket oluşturalım.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                    <Link href="/contact">
                      İletişime Geç
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-t border-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Sıkça Sorulan Sorular</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Paket kullanımı nasıl işliyor?</h3>
                  <p className="text-gray-600">
                    Her ay belirlediğiniz sayıda dijital sürpriz mesajı oluşturabilirsiniz. Kullanmadığınız mesajlar bir sonraki aya devretmez.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">İstediğim zaman iptal edebilir miyim?</h3>
                  <p className="text-gray-600">
                    Evet, istediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde mevcut dönem sonuna kadar paketinizi kullanmaya devam edebilirsiniz.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Özel şablon talebi nedir?</h3>
                  <p className="text-gray-600">
                    Kütüphanemizde olmayan, sizin hayal ettiğiniz özel bir şablon isteyebilirsiniz. Tasarım ekibimiz sizin için özel bir şablon oluşturur.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Ödeme yöntemleri nelerdir?</h3>
                  <p className="text-gray-600">
                    Kredi kartı, banka kartı ve havale ile ödeme yapabilirsiniz. Tüm ödemeler güvenli ödeme altyapısı ile gerçekleştirilir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-rose-600 to-purple-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Bugün Başlayın</h2>
            <p className="mb-8 text-lg text-white/90">14 gün ücretsiz deneme ile tüm özellikleri keşfedin</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100" asChild>
                <Link href="/register">Ücretsiz Deneyin</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link href="/templates">Sürprizleri İnceleyin</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">birmesajmutluluk</span>
              </div>
              <p className="text-sm text-gray-600">
                Sevdiklerinize özel dijital mesajlar ve hediyeler oluşturun.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Ürün</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/templates" className="transition hover:text-rose-500">
                    Şablonlar
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="transition hover:text-rose-500">
                    Planlar
                  </Link>
                </li>
                <li>
                  <Link href="/custom-template" className="transition hover:text-rose-500">
                    Özel Şablon
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Şirket</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about" className="transition hover:text-rose-500">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:text-rose-500">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="transition hover:text-rose-500">
                    Kariyer
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Destek</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/faq" className="transition hover:text-rose-500">
                    SSS
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-rose-500">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition hover:text-rose-500">
                    Gizlilik Politikası
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} birmesajmutluluk. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
