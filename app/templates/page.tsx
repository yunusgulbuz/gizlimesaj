import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Star,
  ArrowRight,
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
  title: "birmesajmutluluk Şablonları",
  description:
    "birmesajmutluluk ile dakikalar içinde romantik sürpriz sayfanızı tasarlayın. Temalar, müzikler ve sahne sahne akışlar tek yerde.",
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
  if (price == null) return null;

  const normalized = price.toString().trim();
  if (!normalized) return null;

  const sanitized = normalized.replace(',', '.');
  const numPrice = Number(sanitized);
  if (Number.isNaN(numPrice)) return null;

  if (!sanitized.includes('.')) {
    return Math.round(numPrice).toString();
  }

  return sanitized.replace(/\.$/, '');
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
  const sortBy = (params?.sort || "popular") as string;
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
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-rose-100/70 bg-white/90 backdrop-blur">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-900">birmesajmutluluk</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/templates" className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:block">
                Sürprizler
              </Link>
              <Link href="/pricing" className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:block">
                Planlar
              </Link>
              <Link href="/about" className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:block">
                Hakkımızda
              </Link>
              <Link href="/contact" className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:block">
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
        <section className="container mx-auto px-4 py-8">
          <div className="rounded-[32px] border border-rose-100 bg-white/90 p-6 shadow-sm shadow-rose-100/60 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <SearchForm />
                <div className="flex justify-end sm:ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 gap-2 rounded-full border-rose-200 bg-white text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                      >
                        Sırala: {sortBy === "popular" ? "Popüler" : sortBy === "newest" ? "En Yeni" : sortBy === "price-low" ? "Fiyat ↑" : "Fiyat ↓"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl border border-rose-100 bg-white shadow-lg">
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
              </div>
            </div>

            <div className="mt-5 flex w-full gap-2 overflow-x-auto pb-2">
              <Link
                href={`/templates?${sortBy !== "popular" ? `sort=${sortBy}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition hover:border-rose-300 hover:bg-rose-50 ${
                  activeCategory === "all"
                    ? "border-rose-300 bg-rose-100 text-rose-700"
                    : "border-rose-100 bg-white text-slate-600"
                }`}
              >
                Tümü
              </Link>
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <Link
                    key={category}
                    href={`/templates?category=${encodeURIComponent(category)}${sortBy !== "popular" ? `&sort=${sortBy}` : ""}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium capitalize whitespace-nowrap transition hover:border-rose-300 hover:bg-rose-50 ${
                      isActive
                        ? "border-rose-300 bg-rose-100 text-rose-700"
                        : "border-rose-100 bg-white text-slate-600"
                    }`}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          {/* Results Info */}
          {totalItems > 0 && (
            <div className="mb-4 text-sm text-slate-500">
              {totalItems} şablon bulundu {searchQuery && `"${searchQuery}" için`}
            </div>
          )}

          {paginatedTemplates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-gradient-to-br from-rose-50 via-white to-sky-50 p-12 text-center text-slate-500">
              {searchQuery ? `"${searchQuery}" için sonuç bulunamadı.` : "Seçtiğiniz kategoride şu an birmesajmutluluk şablonu bulunmuyor. Başka bir kategori deneyin ya da özel istekte bulunun."}
            </div>
          ) : (
            <>
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
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
                            {template.stats && template.stats.totalRatings > 10 && (
                              <Badge className="border border-rose-100 bg-white/80 px-2.5 py-1 text-xs font-semibold text-rose-600 shadow-sm backdrop-blur">
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

                          {template.stats && template.stats.totalRatings > 0 && (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${
                                      i < Math.floor(template.stats?.averageRating || 0)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-slate-600">{template.stats.averageRating.toFixed(1)}</span>
                              <span className="text-slate-400">({template.stats.totalRatings})</span>
                            </div>
                          )}

                          <div className="flex items-baseline gap-2">
                            {template.shortestPrice && (
                              <>
                                <span className="text-2xl font-bold text-slate-950">
                                  {String(template.shortestPrice).includes('.') ? (
                                    <>
                                      ₺{String(template.shortestPrice).split('.')[0]}
                                      <span className="text-lg font-semibold text-slate-500">
                                        .{String(template.shortestPrice).split('.')[1]}
                                      </span>
                                    </>
                                  ) : (
                                    `₺${template.shortestPrice}`
                                  )}
                                </span>
                                {template.shortestOldPrice && (
                                  <span className="text-sm text-slate-400 line-through">₺{template.shortestOldPrice}</span>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* Previous Button */}
                {currentPage > 1 ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/templates?${activeCategory !== "all" ? `category=${encodeURIComponent(activeCategory)}&` : ""}${sortBy !== "popular" ? `sort=${sortBy}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ""}page=${currentPage - 1}`}>
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
                          <Link href={`/templates?${activeCategory !== "all" ? `category=${encodeURIComponent(activeCategory)}&` : ""}${sortBy !== "popular" ? `sort=${sortBy}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ""}page=${page}`}>
                            {page}
                          </Link>
                        )}
                      </Button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-slate-400">...</span>;
                  }
                  return null;
                })}

                {/* Next Button */}
                {currentPage < totalPages ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/templates?${activeCategory !== "all" ? `category=${encodeURIComponent(activeCategory)}&` : ""}${sortBy !== "popular" ? `sort=${sortBy}&` : ""}${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ""}page=${currentPage + 1}`}>
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
          <Card className="rounded-[32px] border-none bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-500 text-white shadow-2xl shadow-rose-400/40">
            <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Kişiye Özel Şablon</p>
                <h2 className="text-2xl font-semibold md:text-3xl">
                  Hayalindeki birmesajmutluluk şablonu yok mu?
                </h2>
                <p className="max-w-xl text-sm text-white/80">
                  Tasarım ekibimize birkaç satırda fikrini anlat, sadece sana özel bir birmesajmutluluk sahnesi oluşturalım.
                </p>
              </div>
              <CustomTemplateRequestCta className="h-12 gap-2 rounded-full border border-white/40 bg-white/20 px-6 text-base font-semibold text-white transition hover:border-white/60 hover:bg-white/30" />
            </CardContent>
          </Card>
        </section>

        <CustomTemplateRequest />

        <section className="bg-white/80 py-16">
          <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center">
            <h2 className="text-3xl font-semibold text-slate-950 md:text-4xl">
              İlk birmesajmutluluk'un için hazır mısın?
            </h2>
            <p className="max-w-2xl text-base text-slate-600">
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
