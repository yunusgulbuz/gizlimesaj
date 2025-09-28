import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Sparkles,
  Music2,
  ShieldCheck,
  Palette,
  Filter,
  Users,
  Timer,
  MessageCircle,
  Star,
} from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateMetadata } from "@/lib/seo";
import CustomTemplateRequest from "./_components/custom-template-request";
import TemplateCardPreview from "./_components/template-card-preview-client";
import HeaderAuthButton from "@/components/auth/header-auth-button";
import CustomTemplateRequestCta from "./_components/custom-template-request-cta";

export const metadata = generateMetadata({
  title: "Heartnote Şablonları",
  description:
    "Heartnote ile dakikalar içinde romantik sürpriz sayfanızı tasarlayın. Temalar, müzikler ve sahne sahne akışlar tek yerde.",
});

interface Template {
  id: string;
  slug: string;
  title: string;
  audience: string[];
  preview_url: string | null;
  bg_audio_url: string | null;
  created_at?: string;
}

interface Duration {
  id: number;
  label: string;
  days: number;
  is_active: boolean;
}

interface TemplatePricing {
  template_id: string;
  duration_id: number;
  price_try: string;
  old_price: string | null;
  duration: {
    id: number;
    label: string;
    days: number;
  }[];
}

interface TemplateStatMapEntry {
  averageRating: number;
  totalRatings: number;
  totalComments: number;
}

type TemplateWithMeta = Template & {
  shortestPrice: string | null;
  shortestOldPrice: string | null;
  shortestDuration: Duration | undefined;
  allPricing: Map<number, { price: string; oldPrice: string | null }>;
  stats?: TemplateStatMapEntry;
};

interface HeroHighlight {
  label: string;
  description: string;
  icon: LucideIcon;
}

const heroHighlights: HeroHighlight[] = [
  {
    label: "Zengin Kütüphane",
    description: "50&apos;den fazla tema ve sürekli güncellenen içerik",
    icon: Palette,
  },
  {
    label: "Duyguyu Yükselten Sahne",
    description: "Animasyonlu geçişler ve fonda sizin seçtiğiniz müzik",
    icon: Music2,
  },
  {
    label: "Güvenli Paylaşım",
    description: "Şifre koruması ve süreli erişim seçenekleri",
    icon: ShieldCheck,
  },
];

// Fetch categories from database
async function getCategories(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();

  const { data: templates, error } = await supabase
    .from("templates")
    .select("audience")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching categories:", error);
    return [
      "İlişki",
      "Kutlama",
      "Arkadaşlık",
      "Aile",
      "Özel Gün",
      "Hobi",
      "Kurumsal",
      "Sezonluk",
    ];
  }

  const allCategories = new Set<string>();
  templates?.forEach((template) => {
    if (Array.isArray(template.audience)) {
      template.audience.forEach((cat: string) => allCategories.add(cat));
    }
  });

  return Array.from(allCategories).sort();
}

async function getTemplates(): Promise<Template[]> {
  const supabase = await createServerSupabaseClient();

  const { data: templates, error } = await supabase
    .from("templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching templates:", error);
    return [];
  }

  return templates || [];
}

async function getDurations(): Promise<Duration[]> {
  const supabase = await createServerSupabaseClient();

  const { data: durations, error } = await supabase
    .from("durations")
    .select("*")
    .eq("is_active", true)
    .order("days", { ascending: true });

  if (error) {
    console.error("Error fetching durations:", error);
    return [];
  }

  return durations || [];
}

async function getTemplatePricing(): Promise<TemplatePricing[]> {
  const supabase = await createServerSupabaseClient();

  const { data: pricing, error } = await supabase
    .from("template_pricing")
    .select(`
      template_id,
      duration_id,
      price_try,
      old_price,
      duration:durations(id, label, days)
    `)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching template pricing:", error);
    return [];
  }

  return pricing || [];
}

async function getTemplateStats(): Promise<Record<string, TemplateStatMapEntry>> {
  const supabase = await createServerSupabaseClient();

  const { data: stats, error } = await supabase
    .from("template_stats")
    .select("id, average_rating, total_ratings, total_comments");

  if (error) {
    console.error("Error fetching template stats:", error);
    return {};
  }

  const map: Record<string, TemplateStatMapEntry> = {};
  (stats || []).forEach((item) => {
    map[item.id] = {
      averageRating: Number(item.average_rating) || 0,
      totalRatings: Number(item.total_ratings) || 0,
      totalComments: Number(item.total_comments) || 0,
    };
  });

  return map;
}

function formatPrice(price: string | null | undefined): string | null {
  if (!price) return null;

  const numPrice = parseFloat(price);
  if (Number.isNaN(numPrice)) return null;

  return numPrice.toFixed(0);
}

function calculateDiscountPercentage(currentPrice: string | null, oldPrice: string | null): number | null {
  if (!currentPrice || !oldPrice) return null;
  
  const current = parseFloat(currentPrice);
  const old = parseFloat(oldPrice);
  
  if (Number.isNaN(current) || Number.isNaN(old) || old <= current) return null;
  
  return Math.round(((old - current) / old) * 100);
}

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const [templates, durations, categories, allPricing] = await Promise.all([
    getTemplates(),
    getDurations(),
    getCategories(),
    getTemplatePricing(),
  ]);
  const templateStats = await getTemplateStats();

  const pricingByTemplate = new Map<string, Map<number, { price: string; oldPrice: string | null }>>();
  allPricing.forEach((pricing) => {
    if (!pricingByTemplate.has(pricing.template_id)) {
      pricingByTemplate.set(pricing.template_id, new Map());
    }
    pricingByTemplate.get(pricing.template_id)?.set(pricing.duration_id, {
      price: pricing.price_try,
      oldPrice: pricing.old_price
    });
  });

  const sortedDurations = [...durations].sort((a, b) => a.days - b.days);
  const shortestDuration = sortedDurations[0];

  const templatesWithMeta: TemplateWithMeta[] = templates.map((template) => {
    const templatePricing = pricingByTemplate.get(template.id);
    const shortestPricing = shortestDuration && templatePricing
      ? templatePricing.get(shortestDuration.id)
      : null;
    const stats = templateStats[template.id];

    return {
      ...template,
      shortestPrice: formatPrice(shortestPricing?.price),
      shortestOldPrice: formatPrice(shortestPricing?.oldPrice),
      shortestDuration,
      allPricing: templatePricing || new Map<number, { price: string; oldPrice: string | null }>(),
      stats,
    };
  });

  const activeCategory = (searchParams?.category || "all") as string;
  const filteredTemplates =
    activeCategory === "all"
      ? templatesWithMeta
      : templatesWithMeta.filter((template) =>
          template.audience.includes(activeCategory),
        );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-rose-200/60 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-purple-200/50 blur-3xl" />
        <div className="absolute left-1/2 bottom-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <header className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-purple-600">
                <Heart className="h-5 w-5 text-white" />
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-gray-900">Heartnote</span>
                <span className="text-xs text-gray-500">Şablon kütüphanen</span>
              </div>
            </Link>
            <div className="hidden items-center space-x-6 md:flex">
              <Link href="/" className="text-gray-600 transition hover:text-gray-900">
                Ana Sayfa
              </Link>
              <Link href="/pricing" className="text-gray-600 transition hover:text-gray-900">
                Planlar
              </Link>
              <Link href="/help" className="text-gray-600 transition hover:text-gray-900">
                Yardım
              </Link>
              <HeaderAuthButton />
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="container mx-auto px-4 pb-12 pt-10 sm:pb-14">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="w-fit bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-rose-500 shadow-sm">
                Heartnote Şablon Pazarı
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                Duygularını sahneleyen Heartnote şablonlarını keşfet
              </h1>
              <p className="max-w-2xl text-lg text-gray-600">
                Her özel ânı, kişiselleştirilebilir sahneler, fonda müzik ve duygu yüklü anlatımlarla destekleyen Heartnote şablonlarıyla sürprizini benzersiz kıl.
              </p>
              <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
                {heroHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={item.label}
                      className="min-w-[220px] border-none bg-white/80 shadow-md backdrop-blur sm:min-w-0"
                    >
                      <CardContent className="flex gap-3 p-4">
                        <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-rose-500" />
                  {templates.length} aktif şablon
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Timer className="h-4 w-4 text-purple-500" />
                  {sortedDurations.length} süre seçeneği
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Music2 className="h-4 w-4 text-indigo-500" />
                  Müzik ve sahne kontrolü
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="h-4 w-4 text-rose-500" />
              Kategoriler
            </div>
            <Button asChild size="sm" variant="ghost" className="text-rose-600 hover:text-rose-700">
              <Link href="/pricing">Paketleri İncele</Link>
            </Button>
          </div>
          <div className="mt-4 flex w-full gap-2 overflow-x-auto pb-2">
            <Button
              asChild
              size="sm"
              variant={activeCategory === "all" ? "default" : "outline"}
              className="shrink-0 gap-2 rounded-full"
            >
              <Link href="/templates">
                <span>Tümü</span>
              </Link>
            </Button>
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <Button
                  key={category}
                  asChild
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className="shrink-0 rounded-full capitalize"
                >
                  <Link href={`/templates?category=${encodeURIComponent(category)}`}>
                    {category}
                  </Link>
                </Button>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          {filteredTemplates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-white/70 p-12 text-center text-gray-600">
              Seçtiğiniz kategoride şu an Heartnote şablonu bulunmuyor. Başka bir kategori deneyin ya da özel istekte bulunun.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredTemplates.map((template) => {
                const previewData = {
                  id: template.id,
                  slug: template.slug,
                  title: template.title,
                  audience: template.audience,
                  bg_audio_url: template.bg_audio_url,
                };

                return (
                  <Card
                    key={template.id}
                    className="group overflow-hidden border border-white/70 bg-white/80 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <TemplateCardPreview template={previewData} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        {template.audience.slice(0, 2).map((category) => (
                          <Badge key={category} className="bg-white/90 text-xs text-gray-800">
                            {category}
                          </Badge>
                        ))}
                        {template.audience.length > 2 && (
                          <Badge className="bg-white/90 text-xs text-gray-600">
                            +{template.audience.length - 2}
                          </Badge>
                        )}
                      </div>
                      {template.shortestPrice && template.shortestDuration && (
                        <div className="absolute bottom-3 left-3 right-3 space-y-2 text-xs font-medium text-gray-800">
                          {template.stats && (
                            <div className="flex items-center justify-between rounded-full bg-white/85 px-4 py-1.5 shadow-sm">
                              <span className="flex items-center gap-1.5 text-gray-700">
                                <Star className="h-4 w-4 text-amber-500" />
                                <span className="font-semibold text-gray-900">
                                  {template.stats.averageRating.toFixed(1)}
                                </span>
                                <span className="text-gray-500">({template.stats.totalRatings})</span>
                              </span>
                              <span className="flex items-center gap-1 text-gray-600">
                                <MessageCircle className="h-4 w-4 text-rose-400" />
                                {template.stats.totalComments} yorum
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between rounded-full bg-white/90 px-4 py-2 shadow-sm">
                            <span className="text-gray-700">{template.shortestDuration.days} gün erişim</span>
                            <div className="flex items-center gap-2">
                              {(() => {
                                if (!template.shortestOldPrice) return null;
                                const discount = calculateDiscountPercentage(template.shortestPrice, template.shortestOldPrice);
                                if (!discount) return null;
                                return (
                                  <span className="flex items-center gap-1 rounded-full bg-rose-500/90 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                                    %{discount}
                                  </span>
                                );
                              })()}
                              {template.shortestOldPrice && (
                                <span className="text-xs text-gray-400 line-through">₺{template.shortestOldPrice}</span>
                              )}
                              <span className={template.shortestOldPrice ? "text-green-600 font-semibold" : "font-semibold"}>
                                ₺{template.shortestPrice}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <CardHeader className="space-y-2">
                      <CardTitle className="text-lg text-gray-900">
                        {template.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {template.audience.join(" · ")} temasında Heartnote deneyimi
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Music2 className="h-4 w-4 text-rose-500" />
                          {template.bg_audio_url ? "Hazır müzik" : "Müzik yüklenebilir"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          Çok sahneli anlatım
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <Link href={`/templates/${template.slug}`}>
                            Şablonu Seç
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1">
                          <Link href={`/templates/${template.slug}/preview`} target="_blank" rel="noopener noreferrer">
                            Önizleme
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <section className="container mx-auto px-4 pb-20">
          <Card className="border-none bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 text-white shadow-xl">
            <CardContent className="flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.2em] text-white/75">Kişiye Özel Şablon</p>
                <h2 className="text-2xl font-semibold md:text-3xl">
                  Hayalindeki Heartnote şablonu yok mu?
                </h2>
                <p className="max-w-xl text-sm text-white/85">
                  Tasarım ekibimize birkaç satırda fikrini anlat, sadece sana özel bir Heartnote sahnesi oluşturalım.
                </p>
              </div>
              <CustomTemplateRequestCta className="h-12 gap-2 px-6 text-base" />
            </CardContent>
          </Card>
        </section>

        <CustomTemplateRequest />

        <section className="bg-white/80 py-16">
          <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center">
            <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">
              İlk Heartnote&apos;un için hazır mısın?
            </h2>
            <p className="max-w-2xl text-base text-gray-600">
              Ücretsiz kaydol, şablonu seç, dakikalar içinde duygularını anlatan dijital sürprizini yayına al.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/register">Hemen Kaydol</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="/pricing">Planları Gör</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
