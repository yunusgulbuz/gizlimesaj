'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeaderAuthButton from "@/components/auth/header-auth-button";
import { MobileDrawerMenu } from "@/components/mobile-drawer-menu";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import {
  Heart,
  Check,
  Sparkles,
  Star,
  Crown,
  MessageCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

const pricingPlans = [
  {
    id: "monthly-10",
    name: "Başlangıç",
    subtitle: "Aylık 10 Sürpriz",
    price: "999",
    period: "/ay",
    description: "Sevdiklerinize düzenli sürprizler yapmaya başlayın",
    features: [
      "Ayda 10 dijital sürpriz mesajı",
      "Tüm şablon kütüphanesine erişim",
      "Müzik ve animasyon desteği",
      "7 gün erişim süresi",
      "E-posta desteği",
    ],
    highlight: false,
    icon: Heart,
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "monthly-20",
    name: "Popüler",
    subtitle: "Aylık 20 Sürpriz",
    price: "1799",
    period: "/ay",
    description: "En çok tercih edilen paketimiz",
    features: [
      "Ayda 20 dijital sürpriz mesajı",
      "Tüm şablon kütüphanesine erişim",
      "Müzik ve animasyon desteği",
      "14 gün erişim süresi",
      "Öncelikli e-posta desteği",
      "Özel şablon talebi hakkı",
    ],
    highlight: true,
    icon: Star,
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    id: "monthly-30",
    name: "Premium",
    subtitle: "Aylık 30 Sürpriz",
    price: "2499",
    period: "/ay",
    description: "Sınırsız dijital hediye deneyimi",
    features: [
      "Ayda 30 dijital sürpriz mesajı",
      "Tüm şablon kütüphanesine erişim",
      "Müzik ve animasyon desteği",
      "30 gün erişim süresi",
      "7/24 öncelikli destek",
      "3 özel şablon talebi hakkı",
      "İlk erişim yeni özelliklere",
    ],
    highlight: false,
    icon: Crown,
    gradient: "from-amber-500 to-orange-500",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSubscribe = async (planId: string) => {
    setLoadingPlanId(planId);

    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Lütfen önce giriş yapın');
        router.push('/login?redirect=/pricing');
        return;
      }

      // Create recurring payment
      const response = await fetch('/api/subscriptions/create-recurring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          totalPayments: 12, // 12 months
        }),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.error || 'Abonelik oluşturulamadı');
        return;
      }

      // Redirect to Paynkolay payment link
      if (result.payment_link) {
        window.location.href = result.payment_link;
      } else {
        toast.error('Ödeme linki alınamadı');
      }

    } catch (error) {
      console.error('Subscribe error:', error);
      toast.error('Beklenmeyen bir hata oluştu');
    } finally {
      setLoadingPlanId(null);
    }
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
              <MobileDrawerMenu user={user} />
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
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

        {/* Pricing Cards */}
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
                        ? "border-2 border-purple-500 shadow-xl ring-2 ring-purple-100"
                        : "border-gray-200 shadow-sm"
                    }`}
                  >
                    {plan.highlight && (
                      <div className="absolute right-4 top-4">
                        <Badge className="bg-purple-500 text-white hover:bg-purple-600">
                          En Popüler
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-8 pt-6">
                      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${plan.gradient}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-base">{plan.subtitle}</CardDescription>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">₺{plan.price}</span>
                        <span className="text-gray-500">{plan.period}</span>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">{plan.description}</p>
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
                          plan.highlight
                            ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                            : "bg-gray-900 hover:bg-gray-800"
                        }`}
                        size="lg"
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={loadingPlanId === plan.id}
                      >
                        {loadingPlanId === plan.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            İşleniyor
                          </>
                        ) : (
                          <>
                            Hemen Başla
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Custom Packages CTA */}
        <section className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white py-16">
          <div className="container mx-auto px-4">
            <Card className="border-0 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 text-white shadow-xl">
              <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-6 w-6" />
                    <Badge className="border-white/20 bg-white/20 text-white hover:bg-white/30">
                      Özel Paketler
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-bold md:text-4xl">
                    Özel İhtiyaçlarınız mı Var?
                  </h2>
                  <p className="text-lg text-white/90">
                    Kurumsal paketler, toplu alımlar veya özel çözümler için bizimle iletişime geçin.
                    Size özel bir paket oluşturalım.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100"
                    asChild
                  >
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

        {/* FAQ Section */}
        <section className="border-t border-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
                Sıkça Sorulan Sorular
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Paket kullanımı nasıl işliyor?
                  </h3>
                  <p className="text-gray-600">
                    Her ay belirlediğiniz sayıda dijital sürpriz mesajı oluşturabilirsiniz.
                    Kullanmadığınız mesajlar bir sonraki aya devretmez.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    İstediğim zaman iptal edebilir miyim?
                  </h3>
                  <p className="text-gray-600">
                    Evet, istediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde mevcut dönem
                    sonuna kadar paketinizi kullanmaya devam edebilirsiniz.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Özel şablon talebi nedir?
                  </h3>
                  <p className="text-gray-600">
                    Kütüphanemizde olmayan, sizin hayal ettiğiniz özel bir şablon isteyebilirsiniz.
                    Tasarım ekibimiz sizin için özel bir şablon oluşturur.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Ödeme yöntemleri nelerdir?
                  </h3>
                  <p className="text-gray-600">
                    Kredi kartı, banka kartı ve havale ile ödeme yapabilirsiniz.
                    Tüm ödemeler güvenli ödeme altyapısı ile gerçekleştirilir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-rose-600 to-purple-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Bugün Başlayın
            </h2>
            <p className="mb-8 text-lg text-white/90">
              14 gün ücretsiz deneme ile tüm özellikleri keşfedin
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100" asChild>
                <Link href="/register">Ücretsiz Deneyin</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10" asChild>
                <Link href="/templates">Sürprizleri İnceleyin</Link>
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
                <li><Link href="/templates" className="hover:text-rose-600">Sürprizler</Link></li>
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
