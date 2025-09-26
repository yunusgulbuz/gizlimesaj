import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Button,
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HeaderAuthButton from "@/components/auth/header-auth-button";
import {
  Heart,
  Sparkles,
  Wand2,
  Music2,
  Share2,
  ShieldCheck,
  Clock3,
  Pen,
  Send,
  Users,
  Star,
} from "lucide-react";

interface FeatureHighlight {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface WorkflowStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface StatHighlight {
  label: string;
  value: string;
  description: string;
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

const featureHighlights: FeatureHighlight[] = [
  {
    title: "Anında Kişiselleştirme",
    description:
      "Şablonu seçtikten sonra isimlerden renklere, müzikten giriş metnine kadar her detayı dakikalar içinde düzenleyin.",
    icon: Wand2,
  },
  {
    title: "Duyguyu Güçlendiren Deneyim",
    description:
      "Kalp atışı animasyonları, fonda çalan müzik ve etkileşimli bölümlerle dijital sürprizleriniz unutulmaz hale gelir.",
    icon: Music2,
  },
  {
    title: "Kolay Paylaşım",
    description:
      "Heartnote, hazırladığınız sayfayı tek bir bağlantıyla paylaşmanızı sağlar. İsterseniz süreli erişim de tanımlayabilirsiniz.",
    icon: Share2,
  },
  {
    title: "Güvenli & Gizli",
    description:
      "Mesajlarınız size özel kalır. Parola koruması ve süreli yayın özellikleriyle yalnızca seçtiğiniz kişi erişebilir.",
    icon: ShieldCheck,
  },
];

const workflowSteps: WorkflowStep[] = [
  {
    title: "Şablonu Seç",
    description:
      "Özel gününüze uygun yüzlerce romantik, eğlenceli veya minimalist tasarım arasından seçim yapın.",
    icon: Sparkles,
  },
  {
    title: "Hikayeni Anlat",
    description:
      "Alıcı adını, ilişkinizi anlatan metinleri, fotoğraf ve videoları sürükle-bırak kolaylığıyla yerleştirin.",
    icon: Pen,
  },
  {
    title: "Bağlantıyı Paylaş",
    description:
      "Heartnote bağlantısını ileterek sevdiklerinize saniyeler içinde dijital sürprizinizin kapısını aralayın.",
    icon: Send,
  },
];

const stats: StatHighlight[] = [
  {
    label: "Hazır Şablon",
    value: "50+",
    description: "Doğum günü, yıldönümü, kutlama ve daha fazlası",
  },
  {
    label: "Dakikada Yayında",
    value: "5",
    description: "Kayıt olduktan sonra ilk Heartnote&apos;unuzu dakikalar içinde oluşturun",
  },
  {
    label: "Mutlu Kullanıcı",
    value: "10K",
    description: "Heartnote ile duygularını paylaşan topluluğa katılın",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "Heartnote sayesinde eşime hazırladığım yıldönümü sürprizi kelimenin tam anlamıyla büyüledi. Her detay o kadar kişisel ki!",
    name: "Elif K.",
    title: "Yıldönümü Heartnote&apos;u",
  },
  {
    quote:
      "Uzaktaki sevgilime sadece birkaç tıkla müthiş bir deneyim gönderdim. Müzik ve animasyonlar duyguyu katladı.",
    name: "Mert A.",
    title: "Uzun Mesafe Hikâyesi",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-rose-200/60 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-purple-200/50 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/3 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <header className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-purple-600">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-gray-900">Heartnote</span>
                <span className="text-xs text-gray-500">Hissettiklerini dijital sürprize dönüştür</span>
              </div>
            </div>
            <div className="hidden items-center space-x-6 md:flex">
              <Link href="/templates" className="text-gray-600 transition hover:text-gray-900">
                Şablonlar
              </Link>
              <Link href="/pricing" className="text-gray-600 transition hover:text-gray-900">
                Planlar
              </Link>
              <Link href="/about" className="text-gray-600 transition hover:text-gray-900">
                Hakkımızda
              </Link>
              <HeaderAuthButton />
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="container mx-auto px-4 pb-24 pt-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-rose-600 shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Sürprizlerin kalp atışını yükseltin
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Heartnote ile duygularını <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">dijital anılara</span> dönüştür
              </h1>
              <p className="max-w-xl text-lg text-gray-600">
                Kişiselleştirilebilir sayfalar, zarif animasyonlar ve fon müziği ile sevdiğiniz kişiye unutulmaz bir deneyim armağan edin. Heartnote, romantik sürprizlerin yeni adresi.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <Link href="/templates">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Şablonları Keşfet
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                  <Link href="/register">Hikayeni Yazmaya Başla</Link>
                </Button>
              </div>
              <div className="flex flex-col gap-4 text-sm text-gray-500 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Güvenli paylaşım ve süreli erişim
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-indigo-500" />
                  5 dakikada yayında
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-rose-500" />
                  10.000+ mutlu çift
                </div>
              </div>
            </div>

            <Card className="border-none bg-white/70 shadow-xl backdrop-blur">
              <CardContent className="space-y-6 p-6">
                <div className="rounded-2xl bg-gradient-to-br from-rose-500/90 to-purple-600/90 p-6 text-white shadow-lg">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/80">Öne Çıkan Heartnote</p>
                  <h3 className="mt-3 text-2xl font-semibold">Yıldönümü Işıltısı</h3>
                  <p className="mt-2 text-sm text-white/80">
                    Sürpriziniz için romantik geçişler, fotoğraf galerisi ve özel müzik eşliğinde hazırlanan dinamik bir sayfa.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-lg bg-white/15 p-3">
                      <p className="text-xs text-white/70">Müzik</p>
                      <p className="font-medium">Lo-fi Love</p>
                    </div>
                    <div className="rounded-lg bg-white/15 p-3">
                      <p className="text-xs text-white/70">Süre</p>
                      <p className="font-medium">3 gün erişim</p>
                    </div>
                    <div className="rounded-lg bg-white/15 p-3">
                      <p className="text-xs text-white/70">Bölümler</p>
                      <p className="font-medium">5 etkileşimli sahne</p>
                    </div>
                    <div className="rounded-lg bg-white/15 p-3">
                      <p className="text-xs text-white/70">Paylaşım</p>
                      <p className="font-medium">Tek bağlantı</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-xl border border-rose-100 bg-white/80 p-4 text-center shadow-sm">
                      <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                      <p className="text-sm font-medium text-rose-500">{item.label}</p>
                      <p className="mt-2 text-xs text-gray-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-white/70 py-20 backdrop-blur">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600">
                Heartnote sözünüz
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-gray-900 md:text-4xl">
                Sevdikleriniz için etkileyici dijital deneyimler
              </h2>
              <p className="mt-4 text-base text-gray-600">
                Hayalinizdeki sürprizi hazırlarken yaratıcı sürece odaklanın. Geri kalan her şeyi Heartnote halleder.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {featureHighlights.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="border-none bg-gradient-to-br from-white to-rose-50/80 shadow-lg"
                  >
                    <CardHeader>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                        <Icon className="h-6 w-6 text-rose-500" />
                      </div>
                      <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">
                Kalp atışı kadar kolay bir süreç
              </h2>
              <p className="mt-4 max-w-xl text-base text-gray-600">
                Heartnote&apos;un sezgisel editörü ile sürükle-bırak kolaylığında içerik ekleyin, seçtiğiniz müziği yükleyin, animasyonlu sahneler arasında geçiş yapın.
              </p>

              <div className="mt-10 space-y-6">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="flex flex-col gap-4 rounded-2xl border border-rose-100 bg-white/80 p-6 shadow-sm sm:flex-row sm:items-center"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Card className="border-none bg-gradient-to-br from-purple-600 to-rose-500 text-white shadow-xl">
              <CardContent className="space-y-6 p-8">
                <div>
                  <h3 className="text-2xl font-semibold">Kişiye Özel Yayın Ayarları</h3>
                  <p className="mt-2 text-sm text-white/80">
                    Heartnote&apos;un gelişmiş araçlarıyla yayınınızı zamanlayın, şifre koruması ekleyin ve dilediğiniz an düzenleyin.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-white/85">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4" />
                    Şifre koruması ve süreli erişim seçenekleri
                  </li>
                  <li className="flex items-start gap-2">
                    <Music2 className="mt-0.5 h-4 w-4" />
                    Arkaplan müziği ve sesli not ekleme
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4" />
                    Animasyonlu sahneler ve mikro etkileşimler
                  </li>
                </ul>
                <Button variant="secondary" className="w-full text-base" asChild>
                  <Link href="/templates">İlham Al</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-white/80 py-20 backdrop-blur">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">Kullanıcılarımız ne diyor?</h2>
                <p className="mt-4 max-w-xl text-base text-gray-600">
                  Heartnote, romantik sürprizler hazırlayan çiftler ve özel günlerini kutlayan aileler tarafından seviliyor.
                </p>
              </div>
              <div className="flex items-center gap-2 text-rose-500">
                <Star className="h-5 w-5" />
                <p className="text-sm font-medium">4.9 / 5 memnuniyet puanı</p>
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="border-none bg-white shadow-lg">
                  <CardContent className="space-y-4 p-6">
                    <p className="text-lg font-medium text-gray-900">“{testimonial.quote}”</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.title}</p>
                      </div>
                      <Users className="h-5 w-5 text-rose-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500" />
          <div className="container relative mx-auto px-4">
            <div className="flex flex-col items-center gap-6 text-center text-white">
              <h2 className="text-3xl font-semibold md:text-4xl">Hazırsan ilk Heartnote&apos;unu birlikte oluşturalım</h2>
              <p className="max-w-2xl text-base text-white/85">
                Ücretsiz kaydol, beğendiğin şablonu seç, dakikalar içinde duygularını şık bir dijital deneyime dönüştür. Heartnote ile her özel gün benzersiz.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" variant="secondary" className="h-12 px-8 text-base" asChild>
                  <Link href="/register">Ücretsiz Kaydol</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base text-white" asChild>
                  <Link href="/login">Hesabım Var</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/40 bg-white/70 py-8 backdrop-blur">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center text-sm text-gray-500 md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-medium text-gray-700">Heartnote</p>
            <p className="text-xs">© {new Date().getFullYear()} Heartnote. Tüm hakları saklıdır.</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-gray-700">
              Gizlilik
            </Link>
            <Link href="/terms" className="hover:text-gray-700">
              Kullanım Şartları
            </Link>
            <Link href="/contact" className="hover:text-gray-700">
              İletişim
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
