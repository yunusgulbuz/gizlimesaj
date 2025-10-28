import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeaderAuthButton from "@/components/auth/header-auth-button";
import { MobileDrawerMenu } from "@/components/mobile-drawer-menu";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import TemplateCardPreview from "@/app/templates/_components/template-card-preview-client";
import { FavoriteButton } from "@/components/favorite-button";
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  PartyPopper,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wand2,
  Clock3,
  Share2,
} from "lucide-react";

interface FeaturedTemplate {
  id: string;
  slug: string;
  title: string;
  audience: string[];
  preview_url: string | null;
  price: string | null;
  oldPrice: string | null;
  totalOrders: number;
  avgRating: number | null;
  ratingCount: number;
}

async function getCategories(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();

  const { data: templates } = await supabase
    .from("templates")
    .select("audience")
    .eq("is_active", true);

  if (!templates) return [];

  const allCategories = new Set<string>();
  templates?.forEach((template) => {
    if (Array.isArray(template.audience)) {
      template.audience.forEach((cat: string) => allCategories.add(cat));
    }
  });

  return Array.from(allCategories).sort();
}

const heroHighlights = [
  {
    label: "120K+",
    description: "Paylaşılan dijital mutluluk notu",
  },
  {
    label: "%98",
    description: "Memnuniyet puanı",
  },
  {
    label: "45 sn",
    description: "Ortalama hazırlama süresi",
  },
];

const features = [
  {
    icon: Wand2,
    title: "Akıllı kişiselleştirme",
    description: "Mesajınıza uygun renk, müzik ve efekt önerileriyle tasarımı hızlandırır.",
    accent: "from-rose-500/80 via-rose-400/60 to-purple-500/60",
  },
  {
    icon: PlayCircle,
    title: "Canlı önizleme",
    description: "Hazırladığınız sürprizi gerçek zamanlı görerek detayları anında düzenleyin.",
    accent: "from-indigo-500/80 via-sky-400/70 to-cyan-400/50",
  },
  {
    icon: ShieldCheck,
    title: "Özel paylaşımlar",
    description: "Şifreli ve süreli linkler ile sürprizleriniz sadece seçtiğiniz kişilerde kalsın.",
    accent: "from-emerald-500/70 via-teal-400/60 to-emerald-400/40",
  },
  {
    icon: PartyPopper,
    title: "Trend sürprizler",
    description: "2025 tasarım trendlerine göre her ay güncellenen koleksiyonlara erişin.",
    accent: "from-amber-500/80 via-orange-400/70 to-pink-500/60",
  },
];

const quickSteps = [
  { label: "Sürpriz seç", icon: Sparkles },
  { label: "Mesajını özelleştir", icon: Wand2 },
  { label: "Linki paylaş", icon: Share2 },
];

const creationJourney = [
  {
    icon: Sparkles,
    title: "Sürprizini seç",
    description: "Trend temalar, sezonsal koleksiyonlar ve popüler sürprizler tek yerde.",
  },
  {
    icon: Wand2,
    title: "Duygularını şekillendir",
    description: "Metin, fotoğraf, video ve müzik ekleyerek benzersiz deneyimler oluştur.",
  },
  {
    icon: Clock3,
    title: "Zamanlamayı ayarla",
    description: "Süreli erişim, ileri tarihli açılış ve özel davet akışlarını planla.",
  },
  {
    icon: Share2,
    title: "Anında mutlu et",
    description: "Şifreli linklerle WhatsApp, Instagram veya QR üzerinden paylaş.",
  },
];

const testimonials = [
  {
    quote:
      "Uzun mesafe ilişkimizde özel günleri kutlamak artık çok daha yaratıcı. Animasyonlar ve zaman ayarlı açılış herkesi şaşırtıyor.",
    name: "Ezgi & Mert",
    role: "Berlin · İstanbul",
  },
  {
    quote:
      "Ürün lansmanında ekibe teşekkür etmek için kullandık. Kurumsal kimliğe uyum sağlayan sürprizlerle dakikalar içinde hazırdı.",
    name: "Selin A.",
    role: "Marka Yöneticisi, Kolektif House",
  },
  {
    quote:
      "Anneler günü kampanyasında influencer işbirliklerine özel sürpriz sayfaları hazırladık. %35 daha yüksek etkileşim aldık.",
    name: "Onur K.",
    role: "Ajans Kurucusu, Creativehub",
  },
];

async function getFeaturedTemplates(): Promise<FeaturedTemplate[]> {
  const supabase = await createServerSupabaseClient();

  // Get all active templates first
  const { data: allTemplates } = await supabase
    .from("templates")
    .select("id, slug, title, audience, preview_url")
    .eq("is_active", true);

  if (!allTemplates || allTemplates.length === 0) {
    return [];
  }

  const allTemplateIds = allTemplates.map((t) => t.id);

  // Get shortest duration for pricing
  const { data: durations } = await supabase
    .from("durations")
    .select("id")
    .eq("is_active", true)
    .order("days", { ascending: true })
    .limit(1)
    .single();

  const shortestDurationId = durations?.id;
  if (!shortestDurationId) {
    return [];
  }

  // Get pricing for all templates
  const { data: allPricing } = await supabase
    .from("template_pricing")
    .select("template_id, price_try, old_price")
    .in("template_id", allTemplateIds)
    .eq("duration_id", shortestDurationId)
    .eq("is_active", true);

  const pricingMap = new Map(
    allPricing?.map((p) => [p.template_id, { price: p.price_try, oldPrice: p.old_price }]) || []
  );

  // Get templates with most ratings
  const { data: allRatings } = await supabase
    .from("template_ratings")
    .select("template_id, rating")
    .in("template_id", allTemplateIds);

  // Count ratings per template
  const ratingCounts: Record<string, number> = {};
  if (allRatings && allRatings.length > 0) {
    allRatings.forEach((r) => {
      ratingCounts[r.template_id] = (ratingCounts[r.template_id] || 0) + 1;
    });
  }

  // Sort templates: first by rating count (desc), then fill remaining with discounted items
  const templatesWithRatingCount = allTemplates.map((template) => ({
    ...template,
    ratingCount: ratingCounts[template.id] || 0,
    hasDiscount: !!pricingMap.get(template.id)?.oldPrice,
  }));

  // Get top rated templates (with at least 1 rating)
  const topRated = templatesWithRatingCount
    .filter((t) => t.ratingCount > 0)
    .sort((a, b) => b.ratingCount - a.ratingCount);

  // Get discounted templates that are not in top rated
  const topRatedIds = new Set(topRated.map((t) => t.id));
  const discounted = templatesWithRatingCount
    .filter((t) => t.hasDiscount && !topRatedIds.has(t.id))
    .sort((a, b) => b.ratingCount - a.ratingCount); // Secondary sort by rating count

  // Combine: top rated first, then discounted
  const combined = [...topRated, ...discounted].slice(0, 8);
  const templateIds = combined.map((t) => t.id);

  // Get order stats
  const { data: stats } = await supabase
    .from("template_stats")
    .select("id, total_orders")
    .in("id", templateIds);

  const statsMap = new Map(stats?.map((s) => [s.id, s.total_orders]) || []);

  const templates = allTemplates.filter((t) => templateIds.includes(t.id));

  if (!templates || templates.length === 0) {
    return [];
  }

  // Calculate average ratings and counts from already fetched ratings
  const ratingsMap = new Map<string, { avgRating: number; ratingCount: number }>();
  if (allRatings && allRatings.length > 0) {
    const grouped = allRatings.reduce((acc, r) => {
      if (templateIds.includes(r.template_id)) {
        if (!acc[r.template_id]) {
          acc[r.template_id] = [];
        }
        acc[r.template_id].push(r.rating);
      }
      return acc;
    }, {} as Record<string, number[]>);

    Object.entries(grouped).forEach(([templateId, ratingsList]) => {
      const avg = ratingsList.reduce((sum, r) => sum + r, 0) / ratingsList.length;
      ratingsMap.set(templateId, {
        avgRating: Math.round(avg * 10) / 10, // Round to 1 decimal
        ratingCount: ratingsList.length,
      });
    });
  }

  // Map templates and maintain the order (top rated first, then discounted)
  const result = combined.map((combinedTemplate) => {
    const template = templates.find((t) => t.id === combinedTemplate.id);
    if (!template) return null;

    const templatePricing = pricingMap.get(template.id);
    const templateRating = ratingsMap.get(template.id);
    return {
      ...template,
      price: templatePricing?.price || null,
      oldPrice: templatePricing?.oldPrice || null,
      totalOrders: statsMap.get(template.id) || 0,
      avgRating: templateRating?.avgRating || null,
      ratingCount: templateRating?.ratingCount || 0,
    };
  }).filter((t): t is FeaturedTemplate => t !== null);

  return result;
}

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const [featuredTemplates, categories] = await Promise.all([
    getFeaturedTemplates(),
    getCategories(),
  ]);

  const heroTemplate = featuredTemplates[0];
  const heroPreviewData = heroTemplate
    ? {
        id: heroTemplate.id,
        slug: heroTemplate.slug,
        title: heroTemplate.title,
        audience: heroTemplate.audience,
        bg_audio_url: null,
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-slate-900">
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
                className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:block"
              >
                AI Kredi Paketleri
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

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-rose-100/60 bg-gradient-to-br from-white via-rose-50 to-sky-50">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_60%)]" />
          <div className="container relative mx-auto px-4 py-12 sm:py-16 lg:py-20">
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
              {/* Preview & trust cues (desktop emphasis) */}
              <div className="relative hidden lg:block lg:order-2">
                <div className="absolute -left-10 top-6 hidden h-40 w-40 rounded-full bg-rose-200/40 blur-3xl lg:block" />
                <div className="absolute -right-10 bottom-10 hidden h-48 w-48 rounded-full bg-sky-200/50 blur-3xl lg:block" />
                <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-2xl shadow-rose-200/60 backdrop-blur-xl">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-emerald-600">
                      <BadgeCheck className="h-4 w-4" />
                      Yeni koleksiyon
                    </span>
                    <span className="inline-flex items-center gap-2 text-slate-500">
                      <Users className="h-4 w-4 text-rose-400" />
                      2.4k canlı izleme
                    </span>
                  </div>
                  {heroPreviewData ? (
                    <Link href={`/templates/${heroTemplate.slug}/preview`} className="group mt-5 block">
                      <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white">
                        <div className="aspect-[4/3]">
                          <TemplateCardPreview template={heroPreviewData} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-rose-400/20 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm font-medium text-slate-700">
                          <span className="inline-flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-rose-400" />
                            Canlı önizleme
                          </span>
                          <ArrowRight className="h-4 w-4 text-rose-400 transition group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-rose-200 bg-white/70 p-8 text-sm text-slate-500">
                      Yeni sürprizler yükleniyor...
                    </div>
                  )}
                  <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50/80 p-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    <p className="font-medium text-slate-900">2025 Sonbahar Koleksiyonu</p>
                    <p className="mt-2">
                      Mevsimsel renk paletleri, 3D partikül animasyonları ve yüksek çözünürlükte görsel alanlarıyla güncellenen trend sürprizler.
                    </p>
                  </div>
                </div>
              </div>

              {/* Messaging & merchandising */}
              <div className="flex flex-col gap-6 lg:order-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/70 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-rose-600 shadow-sm backdrop-blur">
                  <Sparkles className="h-4 w-4 text-rose-500" />
                  2025 trend dijital sürpriz deneyimi
                </span>
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-[3rem]">
                    Dijital hediyelerle
                    <span className="block bg-gradient-to-r from-rose-500 via-purple-500 to-amber-400 bg-clip-text text-transparent">
                      duygularını 45 saniyede ifade et
                    </span>
                  </h1>
                  <p className="text-base text-slate-600 sm:text-lg">
                    Saniyeler içinde hazır, sonsuza kadar unutulmaz. Sevdiklerinizi mutlu edecek, satışa hazır dijital sürpriz sayfalarını saniyeler içinde oluşturun.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
{/*
                    <Button
                      size="lg"
                      className="h-11 gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 px-6 text-white shadow-lg shadow-rose-200/60 transition hover:shadow-xl hover:shadow-rose-200/80"
                      asChild
                    >
                      <Link href="/templates">Hemen Başla</Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-11 gap-2 rounded-full border-rose-200/80 bg-white/90 px-6 text-rose-600 backdrop-blur transition hover:border-rose-300 hover:bg-white"
                      asChild
                    >
                      <Link href="/pricing">AI Kredi Paketleri</Link>
                    </Button>
*/}
                  </div>
                  {/* AI Template Creator CTA */}
                  <Button
                    size="lg"
                    className="h-11 gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 text-white shadow-lg shadow-purple-200/60 transition hover:shadow-xl hover:shadow-purple-200/80"
                    asChild
                  >
                    <Link href="/ai-template-creator">
                      <Sparkles className="h-4 w-4" />
                      Yapay Zeka ile Sürpriz Oluştur (Beta)
                    </Link>
                  </Button>
                </div>
                <div className="text-[12px] text-slate-500 sm:text-sm">
                  <div className="hidden sm:grid sm:grid-cols-3 sm:gap-3">
                    {quickSteps.map((step) => {
                      const Icon = step.icon;
                      return (
                        <span
                          key={step.label}
                          className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/90 px-3 py-2 shadow-sm transition hover:border-rose-200 hover:shadow"
                        >
                          <Icon className="h-4 w-4 text-rose-500" />
                          {step.label}
                        </span>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:hidden">
                    {quickSteps.map((step) => {
                      const Icon = step.icon;
                      return (
                        <span
                          key={step.label}
                          className="inline-flex flex-col items-center gap-1 rounded-2xl border border-rose-100 bg-white/90 px-2 py-3 shadow-sm"
                        >
                          <Icon className="h-4 w-4 text-rose-500" />
                          <span className="text-[11px] font-semibold text-slate-600 text-center">{step.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="text-left">
                  <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4">
                    {heroHighlights.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm shadow-rose-100/50 backdrop-blur"
                      >
                        <p className="text-lg font-semibold text-slate-950 sm:text-2xl">{item.label}</p>
                        <p className="mt-1 text-[11px] text-slate-500 sm:text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:hidden">
                    {heroHighlights.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/60 bg-white/90 p-3 text-center shadow-sm shadow-rose-100/50 backdrop-blur"
                      >
                        <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                        <p className="mt-1 text-[10px] text-slate-500">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Templates */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Popüler sürprizler</h2>
                <p className="mt-3 text-base text-slate-600">
                  En çok paylaşılan ve en yüksek geri bildirim alan dijital sürprizler. Satışa özel kampanyaları kaçırmayın.
                </p>
              </div>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-full border-rose-200 bg-white px-6 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                asChild
              >
                <Link href="/templates">
                  Tümünü gör
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {featuredTemplates.length > 0 ? (
              <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {featuredTemplates.map((template) => {
                  const previewData = {
                    id: template.id,
                    slug: template.slug,
                    title: template.title,
                    audience: template.audience,
                    bg_audio_url: null,
                  };

                  const discount =
                    template.oldPrice && template.price
                      ? Math.round(
                          (1 - parseFloat(template.price) / parseFloat(template.oldPrice)) * 100
                        )
                      : null;

                  return (
                    <Card
                      key={template.id}
                      className="group relative h-full overflow-hidden rounded-3xl border border-rose-100 bg-white p-0 shadow-lg shadow-rose-100/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-200/80"
                    >
                      <Link href={`/templates/${template.slug}/preview`}>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl rounded-b-none border-b border-rose-100 bg-rose-50/40">
                          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                            <TemplateCardPreview template={previewData} />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <div className="absolute left-4 top-4 flex gap-2">
                            {discount && discount > 0 && (
                              <Badge className="border border-emerald-100 bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                                -{discount}%
                              </Badge>
                            )}
                            {template.totalOrders > 0 && (
                              <Badge className="border border-rose-100 bg-white/80 px-2.5 py-1 text-xs font-semibold text-rose-600 shadow-sm">
                                Popüler
                              </Badge>
                            )}
                          </div>
                          <div className="absolute right-4 top-4 z-10">
                            <FavoriteButton
                              templateId={template.id}
                              iconOnly
                              size="sm"
                              className="bg-white/80 text-rose-500 shadow-sm transition hover:bg-white"
                            />
                          </div>
                        </div>
                      </Link>

                      <CardContent className="flex h-full flex-col gap-5 p-6">
                        <div className="space-y-3">
                          <Link href={`/templates/${template.slug}/preview`}>
                            <h3 className="text-lg font-semibold leading-tight text-slate-950 transition hover:text-rose-500">
                              {template.title}
                            </h3>
                          </Link>

                          {template.avgRating && template.ratingCount > 0 && (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${
                                      i < Math.floor(template.avgRating || 0)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-slate-600">{template.avgRating.toFixed(1)}</span>
                              <span className="text-slate-400">({template.ratingCount})</span>
                            </div>
                          )}

                          <div className="flex items-baseline gap-2">
                            {template.price && (
                              <>
                                <span className="text-2xl font-bold text-slate-950">
                                  {String(template.price).includes('.') ? (
                                    <>
                                      ₺{String(template.price).split('.')[0]}
                                      <span className="text-lg font-semibold text-slate-500">
                                        .{String(template.price).split('.')[1]}
                                      </span>
                                    </>
                                  ) : (
                                    `₺${template.price}`
                                  )}
                                </span>
                                {template.oldPrice && (
                                  <span className="text-sm text-slate-400 line-through">
                                    ₺{template.oldPrice}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between border-t border-rose-100 pt-4">
                          <Link
                            href={`/templates/${template.slug}/preview`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 transition hover:text-rose-700"
                          >
                            Detayları gör
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                          </Link>
                          <Link
                            href={`/templates/${template.slug}/preview`}
                            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100"
                          >
                            Satın al
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="mt-12 rounded-3xl border border-dashed border-rose-200 bg-white/80 p-8 text-center text-sm text-slate-500">
                Popüler sürprizler güncelleniyor. Birkaç dakika içinde tekrar kontrol edin.
              </div>
            )}
          </div>
        </section>


        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-[32px] border border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/50">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950">Popüler kategoriler</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Yaklaşan özel günler, ilişki türleri ve temalar için hızlı filtreler.
                  </p>
                </div>
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 transition hover:text-rose-700"
                >
                  Tüm koleksiyonu keşfet
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Link href="/templates">
                  <Badge className="whitespace-nowrap rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-rose-600 shadow-sm transition hover:border-rose-200 hover:bg-rose-100">
                    ✨ Tümü
                  </Badge>
                </Link>
                {categories.slice(0, 10).map((category) => (
                  <Link key={category} href={`/templates?category=${encodeURIComponent(category)}`}>
                    <Badge className="whitespace-nowrap rounded-full border border-rose-100 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50">
                      {category}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Journey */}
        <section className="relative py-20 bg-gradient-to-br from-white via-rose-50 to-white">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.18),_transparent_60%)] opacity-60" />
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Hikayen nasıl akıyor?</h2>
              <p className="mt-3 text-base text-slate-600">
                Duygudan paylaşıma kadar her adım, sürprizini olağanüstü hale getirmek için yeniden tasarlandı.
              </p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {creationJourney.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="group relative flex h-full flex-col gap-6 rounded-3xl border border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/40 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <span className="text-sm font-semibold uppercase tracking-wide text-rose-500/80">
                      0{index + 1}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-slate-950">{step.title}</h3>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative py-20 bg-gradient-to-br from-rose-50 via-white to-sky-50">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.25),_transparent_60%)] opacity-70" />
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Gerçek hikayeler</h2>
              <p className="mt-3 text-base text-slate-600">
                Birmesajmutluluk ile hazırlanan dijital sürprizler, kilometreleri yakınlaştırıyor ve iş birliklerini unutulmaz kılıyor.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="flex h-full flex-col gap-6 rounded-3xl border border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/40"
                >
                  <p className="text-lg font-medium leading-relaxed text-slate-900">
                    “{testimonial.quote}”
                  </p>
                  <div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-xs uppercase tracking-wide text-rose-500">
                        {testimonial.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      {testimonial.name}
                    </span>
                    <p className="mt-2 text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-400 via-purple-400 to-amber-300 opacity-90" />
          <div className="absolute inset-0 -z-10 opacity-70 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.4),_transparent_60%)]" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-[32px] border border-white/40 bg-white/90 p-10 text-center text-slate-900 shadow-2xl shadow-rose-500/20 backdrop-blur">
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                Hikayeni bugün paylaş, yarının favori anısı olsun
              </h2>
              <p className="mt-4 text-base text-slate-600 sm:text-lg">
                50+ trend sürpriz, sınırsız kişiselleştirme, detaylı görüntüleme istatistikleri ve premium destek ile hayalindeki sürprizi hazırla.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  className="h-12 gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 px-6 text-white shadow-lg shadow-rose-200/60 transition hover:shadow-xl hover:shadow-rose-200/80"
                  asChild
                >
                  <Link href="/register">Ücretsiz başla</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 gap-2 rounded-full border-rose-200 bg-white px-6 text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                  asChild
                >
                  <Link href="/templates">Trend sürprizleri incele</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-rose-100 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-slate-950">birmesajmutluluk</span>
              </div>
              <p className="text-sm text-slate-600">
                Sevdiklerinize özel dijital mesajlar, zamanlamalı açılışlar ve paylaşılan her anı anlamlandıran deneyimler.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Ürün</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/templates" className="transition hover:text-rose-500">
                    Sürprizler
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="transition hover:text-rose-500">
                    Fiyatlandırma
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Şirket</h4>
              <ul className="space-y-2 text-sm text-slate-600">
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
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Yasal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/satis-sozlesmesi" className="transition hover:text-rose-500">
                    Satış Sözleşmesi
                  </Link>
                </li>
                <li>
                  <Link href="/teslimat-kosullari" className="transition hover:text-rose-500">
                    Teslimat Koşulları
                  </Link>
                </li>
                <li>
                  <Link href="/iptal-iade" className="transition hover:text-rose-500">
                    İptal ve İade
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition hover:text-rose-500">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-rose-500">
                    Kullanım Şartları
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-rose-100 pt-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} birmesajmutluluk. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
