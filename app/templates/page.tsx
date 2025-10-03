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
  Eye,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateMetadata } from "@/lib/seo";
import CustomTemplateRequest from "./_components/custom-template-request";
import TemplateCardPreview from "./_components/template-card-preview-client";
import HeaderAuthButton from "@/components/auth/header-auth-button";
import { MobileDrawerMenu } from "@/components/mobile-drawer-menu";
import CustomTemplateRequestCta from "./_components/custom-template-request-cta";
import SearchForm from "./_components/search-form";
import { FavoriteButton } from "@/components/favorite-button";

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
    description: "50'den fazla tema ve sürekli güncellenen içerik",
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
  try {
    const supabase = await createServerSupabaseClient();

    const { data: templates, error } = await supabase
      .from("templates")
      .select("id, slug, title, audience, preview_url, bg_audio_url, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching templates:", JSON.stringify(error, null, 2));
      return [];
    }

    return templates || [];
  } catch (err) {
    console.error("Exception in getTemplates:", err);
    return [];
  }
}

async function getDurations(): Promise<Duration[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: durations, error } = await supabase
      .from("durations")
      .select("id, label, days, is_active")
      .eq("is_active", true)
      .order("days", { ascending: true });

    if (error) {
      console.error("Error fetching durations:", JSON.stringify(error, null, 2));
      return [];
    }

    return durations || [];
  } catch (err) {
    console.error("Exception in getDurations:", err);
    return [];
  }
}

async function getTemplatePricing(): Promise<TemplatePricing[]> {
  try {
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
      console.error("Error fetching template pricing:", JSON.stringify(error, null, 2));
      return [];
    }

    return pricing || [];
  } catch (err) {
    console.error("Exception in getTemplatePricing:", err);
    return [];
  }
}

async function getTemplateStats(): Promise<Record<string, TemplateStatMapEntry>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: stats, error } = await supabase
      .from("template_stats")
      .select("id, average_rating, total_ratings, total_comments");

    if (error) {
      console.error("Error fetching template stats:", JSON.stringify(error, null, 2));
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
  } catch (err) {
    console.error("Exception in getTemplateStats:", err);
    return {};
  }
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
  searchParams?: Promise<{ category?: string; sort?: string; search?: string; page?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
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

  const activeCategory = (params?.category || "all") as string;
  const sortBy = (params?.sort || "newest") as string;
  const searchQuery = (params?.search || "").toLowerCase().trim();
  const currentPage = parseInt(params?.page || "1", 10);
  const itemsPerPage = 12;

  let filteredTemplates =
    activeCategory === "all"
      ? templatesWithMeta
      : templatesWithMeta.filter((template) =>
          template.audience.includes(activeCategory),
        );

  // Apply search filter
  if (searchQuery) {
    filteredTemplates = filteredTemplates.filter((template) =>
      template.title.toLowerCase().includes(searchQuery) ||
      template.audience.some((cat) => cat.toLowerCase().includes(searchQuery))
    );
  }

  // Apply sorting
  filteredTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        const aOrders = a.stats?.totalRatings || 0;
        const bOrders = b.stats?.totalRatings || 0;
        return bOrders - aOrders;
      case "price-low":
        const aPrice = parseFloat(a.shortestPrice || "0");
        const bPrice = parseFloat(b.shortestPrice || "0");
        return aPrice - bPrice;
      case "price-high":
        const aPriceHigh = parseFloat(a.shortestPrice || "0");
        const bPriceHigh = parseFloat(b.shortestPrice || "0");
        return bPriceHigh - aPriceHigh;
      case "newest":
      default:
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });

  // Pagination
  const totalItems = filteredTemplates.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-rose-200/60 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-purple-200/50 blur-3xl" />
        <div className="absolute left-1/2 bottom-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

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

      <main className="relative z-10">
        {/* Filters Section */}
        <section className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            {/* Search and Sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search Input */}
              <SearchForm />

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Sırala: {sortBy === "newest" ? "En Yeni" : sortBy === "popular" ? "Popüler" : sortBy === "price-low" ? "Fiyat ↑" : "Fiyat ↓"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/templates?${activeCategory !== "all" ? `category=${encodeURIComponent(activeCategory)}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ""}sort=newest`}>
                      En Yeni
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/templates?${activeCategory !== "all" ? `category=${encodeURIComponent(activeCategory)}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ""}sort=popular`}>
                      Popüler
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/templates?${activeCategory !== "all" ? `category=${encodeURIComponent(activeCategory)}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ""}sort=price-low`}>
                      Fiyat (Düşük → Yüksek)
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/templates?${activeCategory !== "all" ? `category=${encodeURIComponent(activeCategory)}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ""}sort=price-high`}>
                      Fiyat (Yüksek → Düşük)
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Category Filters */}
            <div className="flex w-full gap-2 overflow-x-auto pb-2">
              <Button
                asChild
                size="sm"
                variant={activeCategory === "all" ? "default" : "outline"}
                className="shrink-0 gap-2 rounded-full"
              >
                <Link href={`/templates?${sortBy !== "newest" ? `sort=${sortBy}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}` : ""}`}>
                  Tümü
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
                    <Link href={`/templates?category=${encodeURIComponent(category)}${sortBy !== "newest" ? `&sort=${sortBy}` : ""}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}>
                      {category}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          {/* Results Info */}
          {totalItems > 0 && (
            <div className="mb-4 text-sm text-gray-600">
              {totalItems} şablon bulundu {searchQuery && `"${searchQuery}" için`}
            </div>
          )}

          {paginatedTemplates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-white/70 p-12 text-center text-gray-600">
              {searchQuery ? `"${searchQuery}" için sonuç bulunamadı.` : "Seçtiğiniz kategoride şu an Heartnote şablonu bulunmuyor. Başka bir kategori deneyin ya da özel istekte bulunun."}
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedTemplates.map((template) => {
                const previewData = {
                  id: template.id,
                  slug: template.slug,
                  title: template.title,
                  audience: template.audience,
                  bg_audio_url: template.bg_audio_url,
                };

                const discount = calculateDiscountPercentage(template.shortestPrice, template.shortestOldPrice);

                return (
                  <div key={template.id}>
                    <Card className="group relative h-full overflow-hidden rounded-2xl border-0 bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:ring-gray-200">
                      {/* Preview Container */}
                      <Link href={`/templates/${template.slug}/preview`}>
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
                            {template.stats && template.stats.totalRatings > 5 && (
                              <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                                Popüler
                              </Badge>
                            )}
                          </div>

                          {/* Favorite Button */}
                          <div className="absolute right-4 top-4 z-10">
                            <FavoriteButton
                              templateId={template.id}
                              iconOnly
                              size="sm"
                              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                            />
                          </div>

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                      </Link>

                      {/* Content */}
                      <CardContent className="p-4">
                        {/* Title */}
                        <Link href={`/templates/${template.slug}/preview`}>
                          <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-rose-600 transition-colors duration-200 mb-3">
                            {template.title}
                          </h3>
                        </Link>

                        {/* Rating */}
                        {template.stats && template.stats.totalRatings > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < Math.floor(template.stats?.averageRating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {template.stats.averageRating.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({template.stats.totalRatings})
                            </span>
                          </div>
                        )}

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2 mb-4">
                          {template.shortestPrice && (
                            <>
                              <span className="text-2xl font-black text-gray-900">
                                {String(template.shortestPrice).includes('.') ? (
                                  <>
                                    ₺{String(template.shortestPrice).split('.')[0]}
                                    <span className="text-lg font-bold">.{String(template.shortestPrice).split('.')[1]}</span>
                                  </>
                                ) : (
                                  `₺${template.shortestPrice}`
                                )}
                              </span>
                              {template.shortestOldPrice && (
                                <span className="text-sm text-gray-400 line-through font-medium">
                                  ₺{template.shortestOldPrice}
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                          <Link
                            href={`/templates/${template.slug}/preview`}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Eye className="h-4 w-4" />
                            İncele
                          </Link>
                          <Link
                            href={`/templates/${template.slug}/preview`}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] group"
                          >
                            Satın Al
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* Previous Button */}
                {currentPage > 1 ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/templates?${activeCategory !== "all" ? `category=${encodeURIComponent(activeCategory)}&` : ""}${sortBy !== "newest" ? `sort=${sortBy}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ""}page=${currentPage - 1}`}>
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        asChild={page !== currentPage}
                        disabled={page === currentPage}
                      >
                        {page === currentPage ? (
                          <span>{page}</span>
                        ) : (
                          <Link href={`/templates?${activeCategory !== "all" ? `category=${encodeURIComponent(activeCategory)}&` : ""}${sortBy !== "newest" ? `sort=${sortBy}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ""}page=${page}`}>
                            {page}
                          </Link>
                        )}
                      </Button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}

                {/* Next Button */}
                {currentPage < totalPages ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/templates?${activeCategory !== "all" ? `category=${encodeURIComponent(activeCategory)}&` : ""}${sortBy !== "newest" ? `sort=${sortBy}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ""}page=${currentPage + 1}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </>
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
              İlk Heartnote'un için hazır mısın?
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
