'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeaderAuthButton from "@/components/auth/header-auth-button";
import { MobileDrawerMenu } from "@/components/mobile-drawer-menu";
import { createClient } from "@/lib/supabase-client";
import {
  Heart,
  Users,
  Target,
  Sparkles,
  Award,
  Zap,
  Shield,
  Smile,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Duygu Odaklı",
    description: "Her tasarımımızda, oluşturduğumuz her deneyimde duyguları ön planda tutuyoruz.",
  },
  {
    icon: Shield,
    title: "Güvenlik",
    description: "Kişisel verilerinizi ve özel mesajlarınızı en üst düzey güvenlikle koruyoruz.",
  },
  {
    icon: Sparkles,
    title: "Yenilikçilik",
    description: "Sürekli yeni şablonlar ve özellikler ekleyerek deneyimi geliştiriyoruz.",
  },
  {
    icon: Smile,
    title: "Mutluluk",
    description: "Amacımız insanların sevdiklerini mutlu etmesine yardımcı olmak.",
  },
];

const stats = [
  { number: "50+", label: "Dijital Şablon" },
  { number: "10K+", label: "Mutlu Kullanıcı" },
  { number: "100K+", label: "Gönderilen Mesaj" },
  { number: "4.8/5", label: "Kullanıcı Puanı" },
];

const team = [
  {
    name: "Tasarım Ekibi",
    role: "Yaratıcı tasarımlar",
    description: "Her şablon için benzersiz ve duygusal tasarımlar oluşturan ekibimiz",
    icon: Sparkles,
  },
  {
    name: "Geliştirme Ekibi",
    role: "Teknik mükemmellik",
    description: "Sorunsuz ve hızlı bir deneyim için çalışan yazılım ekibimiz",
    icon: Zap,
  },
  {
    name: "Destek Ekibi",
    role: "Her zaman yanınızda",
    description: "Sorularınızı yanıtlayan ve sorunlarınızı çözen destek ekibimiz",
    icon: Users,
  },
];

export default function AboutPage() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

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
              <Link href="/pricing" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                Planlar
              </Link>
              <Link href="/about" className="hidden text-sm font-medium text-gray-900 md:block">
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
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Duygularınızı Dijitalde
                <br />
                <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                  Hayata Geçiriyoruz
                </span>
              </h1>
              <p className="mb-8 text-lg text-gray-600 md:text-xl">
                Heartnote, sevdiklerinize özel anlar yaratmanız için tasarlandı.
                <br className="hidden md:block" />
                Her mesaj bir hikaye, her tasarım bir duygu.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-gray-100 bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-gray-600 md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="border-b border-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                  Hikayemiz
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Heartnote, sevdiklerine özel anlar yaratmak isteyen ancak bunu
                    ifade etmekte zorlanan insanlar için doğdu. Bazen kelimeler yetmiyor,
                    bazen bir kartpostal çok sıradan kalıyor.
                  </p>
                  <p>
                    Biz de dedik ki: "Ya dijital dünyanın sınırsız olanaklarını,
                    duyguların samimiyetiyle birleştirirsek?"
                  </p>
                  <p>
                    İşte böyle başladı Heartnote'un hikayesi. Bugün binlerce kişi,
                    sevdiklerine özel anlar yaşatmak için platformumuzu kullanıyor.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 to-purple-100 p-8">
                  <div className="flex h-full items-center justify-center">
                    <Heart className="h-48 w-48 text-rose-500/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="border-b border-gray-100 bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                    <Target className="h-6 w-6 text-rose-600" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">Misyonumuz</h3>
                  <p className="text-gray-600">
                    İnsanların sevdiklerine özel, anlamlı ve unutulmaz anlar yaşatmasını
                    sağlamak. Dijital dünyanın sunduğu sınırsız olanakları, duygusal
                    bağların gücüyle birleştirmek.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">Vizyonumuz</h3>
                  <p className="text-gray-600">
                    Türkiye'nin en sevilen dijital hediye platformu olmak. Her özel günde,
                    her kutlamada, her sürprizde akla gelen ilk isim Heartnote olmalı.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="border-b border-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Değerlerimiz
              </h2>
              <p className="text-lg text-gray-600">
                Bizi biz yapan ve her kararımıza yön veren değerler
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-purple-100">
                      <Icon className="h-8 w-8 text-rose-600" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="border-b border-gray-100 bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Ekibimiz
              </h2>
              <p className="text-lg text-gray-600">
                Heartnote'u hayata geçiren tutkulu ekip
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              {team.map((member, index) => {
                const Icon = member.icon;
                return (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-1 text-xl font-semibold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="mb-3 text-sm font-medium text-rose-600">
                        {member.role}
                      </p>
                      <p className="text-sm text-gray-600">{member.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-rose-600 to-purple-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Hadi Başlayalım!
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Sevdiklerinize özel bir mesaj oluşturun, onları mutlu edin
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100" asChild>
                <Link href="/templates">Sürprizleri Keşfet</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10" asChild>
                <Link href="/contact">Bize Ulaşın</Link>
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
