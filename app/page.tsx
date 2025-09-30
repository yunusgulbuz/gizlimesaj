import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeaderAuthButton from "@/components/auth/header-auth-button";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import TemplateCardPreview from "@/app/templates/_components/template-card-preview-client";
import {
  Heart,
  Sparkles,
  Wand2,
  Share2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Eye,
  Star,
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

const features = [
  {
    icon: Wand2,
    title: "Kolay Kişiselleştirme",
    description: "Şablonu seçin, mesajınızı yazın, müzik ekleyin",
  },
  {
    icon: Share2,
    title: "Anında Paylaşım",
    description: "Link ile hemen paylaşın, WhatsApp/Instagram uyumlu",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli ve Özel",
    description: "Süreli erişim, sadece seçtiğiniz kişi görebilir",
  },
];

const steps = [
  { number: "1", text: "Şablon Seç" },
  { number: "2", text: "Kişiselleştir" },
  { number: "3", text: "Paylaş" },
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
  const [featuredTemplates, categories] = await Promise.all([
    getFeaturedTemplates(),
    getCategories(),
  ]);

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
              <Badge className="mb-6 bg-rose-100 text-rose-700 hover:bg-rose-100">
                <Sparkles className="mr-1 h-3 w-3" />
                Özel günleriniz için dijital hediyeler
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Sevdiklerinize Unutulmaz
                <br />
                <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                  Dijital Sürprizler
                </span>
              </h1>
              <p className="mb-8 text-lg text-gray-600 md:text-xl">
                Kişiselleştirilmiş mesaj sayfaları, müzik ve animasyonlarla duygularınızı paylaşın.
                <br className="hidden md:block" />
                Dakikalar içinde hazır, sonsuza kadar unutulmaz.
              </p>

              {/* Quick Steps */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-rose-100 text-xs sm:text-sm font-semibold text-rose-700">
                      {step.number}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{step.text}</span>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-3 sm:w-4 text-gray-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Popüler Hediyeler</h2>
                <p className="mt-2 text-gray-600">En çok tercih edilen dijital hediyeler</p>
              </div>
              <Button variant="ghost" className="text-rose-600 hover:text-rose-700" asChild>
                <Link href="/templates">
                  Tümünü Gör
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredTemplates.map((template) => {
                const previewData = {
                  id: template.id,
                  slug: template.slug,
                  title: template.title,
                  audience: template.audience,
                  bg_audio_url: null,
                };

                const discount = template.oldPrice && template.price
                  ? Math.round((1 - parseFloat(template.price) / parseFloat(template.oldPrice)) * 100)
                  : null;

                return (
                  <div key={template.id}>
                    <Card className="group relative h-full overflow-hidden rounded-2xl border-0 bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:ring-gray-200">
                      {/* Preview Container */}
                      <Link href={`/templates/${template.slug}`}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                            <TemplateCardPreview template={previewData} />
                          </div>

                          {/* Badges */}
                          <div className="absolute left-4 top-4 flex gap-2">
                            {discount && discount > 0 && (
                              <Badge className="bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                                -{discount}%
                              </Badge>
                            )}
                            {template.totalOrders > 0 && (
                              <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                                Popüler
                              </Badge>
                            )}
                          </div>

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                      </Link>

                      {/* Content */}
                      <CardContent className="p-4">
                        {/* Title */}
                        <Link href={`/templates/${template.slug}`}>
                          <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-rose-600 transition-colors duration-200 mb-3">
                            {template.title}
                          </h3>
                        </Link>

                        {/* Rating */}
                        {template.avgRating && template.ratingCount > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < Math.floor(template.avgRating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {template.avgRating.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({template.ratingCount})
                            </span>
                          </div>
                        )}

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2 mb-4">
                          {template.price && (
                            <>
                              <span className="text-2xl font-black text-gray-900">
                                {String(template.price).includes('.') ? (
                                  <>
                                    ₺{String(template.price).split('.')[0]}
                                    <span className="text-lg font-bold">.{String(template.price).split('.')[1]}</span>
                                  </>
                                ) : (
                                  `₺${template.price}`
                                )}
                              </span>
                              {template.oldPrice && (
                                <span className="text-sm text-gray-400 line-through font-medium">
                                  ₺{template.oldPrice}
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                          <Link
                            href={`/templates/${template.slug}/preview`}
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-rose-600 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Önizleme
                          </Link>
                          <div className="h-4 w-px bg-gray-200" />
                          <Link
                            href={`/templates/${template.slug}`}
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-rose-600 transition-colors group/link"
                          >
                            Hediyeyi İncele
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Buttons */}
        <div className="ml-2 mr-2 mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700" asChild>
                <Link href="/templates">
                  Tümünü Keşfet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
        {/* Categories */}
        <section className="border-b border-gray-100 bg-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              <Link href="/templates">
                <Badge className="whitespace-nowrap bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 md:px-4 md:text-sm">
                  ✨ Tümü
                </Badge>
              </Link>
              {categories.slice(0, 8).map((category) => (
                <Link key={category} href={`/templates?category=${encodeURIComponent(category)}`}>
                  <Badge className="whitespace-nowrap bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 md:px-4 md:text-sm">
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>

            
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-gray-100 bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-100">
                      <Icon className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-rose-600 to-purple-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              İlk Dijital Hediyenizi Oluşturun
            </h2>
            <p className="mb-8 text-lg text-white/90">
              50+ hazır şablon, sınırsız kişiselleştirme seçeneği
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100" asChild>
                <Link href="/templates">Hemen Başla</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-rose-600 hover:bg-gray-100" asChild>
                <Link href="/pricing">Paketleri Gör</Link>
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