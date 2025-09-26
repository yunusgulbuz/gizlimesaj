import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, Filter } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateMetadata } from "@/lib/seo";
import CustomTemplateRequest from "./_components/custom-template-request";
import TemplateCardPreview from "./_components/template-card-preview-client";
import HeaderAuthButton from "@/components/auth/header-auth-button";

export const metadata = generateMetadata({
  title: "Şablonlar - Gizli Mesaj",
  description:
    "Sevdiklerinize özel mesajlar için çeşitli şablonlarımızı keşfedin. Romantik, eğlenceli ve klasik temalar.",
});

interface Template {
  id: string;
  slug: string;
  title: string;
  audience: string[];
  preview_url: string | null;
  bg_audio_url: string | null;
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
  duration: {
    id: number;
    label: string;
    days: number;
  }[];
}

// Fetch categories from database
async function getCategories(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  
  // Get unique categories from templates
  const { data: templates, error } = await supabase
    .from("templates")
    .select("audience")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching categories:", error);
    return [
      "İlişki",
      "Kutlama/Tebrik", 
      "Arkadaşlık",
      "Aile",
      "Özel Gün",
      "Hobi/İlgi Alanı",
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
      duration:durations(id, label, days)
    `)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching template pricing:", error);
    return [];
  }

  return pricing || [];
}

function formatPrice(price: string | null | undefined): string | null {
  if (!price) return null;
  
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return null;
  
  return numPrice.toFixed(0);
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

  // Create pricing maps for different durations
  const pricingByTemplate = new Map<string, Map<number, string>>();
  allPricing.forEach((pricing) => {
    if (!pricingByTemplate.has(pricing.template_id)) {
      pricingByTemplate.set(pricing.template_id, new Map());
    }
    pricingByTemplate.get(pricing.template_id)?.set(pricing.duration_id, pricing.price_try);
  });

  // Get the shortest duration for display
  const shortestDuration = durations.sort((a, b) => a.days - b.days)[0];

  const templatesWithMeta = templates.map((template) => {
    const templatePricing = pricingByTemplate.get(template.id);
    const shortestPrice = shortestDuration && templatePricing 
      ? templatePricing.get(shortestDuration.id) 
      : null;

    return {
      ...template,
      shortestPrice: formatPrice(shortestPrice),
      shortestDuration,
      allPricing: templatePricing || new Map(),
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfa
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-gray-900">Gizli Mesaj</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              Hakkında
            </Link>
            <HeaderAuthButton />
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mesaj Şablonları
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sevdiklerinize uygun şablonu seçin ve kişiselleştirin. Her şablon özel olarak
            tasarlandı ve farklı duygular için öne çıkıyor.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button
            asChild
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            <Link href="/templates">
              <Filter className="h-4 w-4" />
              Tümü
            </Link>
          </Button>
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <Button
                key={category}
                asChild
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`capitalize ${isActive ? "shadow-md" : ""}`}
              >
                <Link href={`/templates?category=${encodeURIComponent(category)}`}>
                  {category}
                </Link>
              </Button>
            );
          })}
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Henüz şablon bulunmuyor. Lütfen daha sonra tekrar kontrol edin.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                  className="group hover:shadow-xl transition-all duration-300 border border-gray-100 shadow-md overflow-hidden"
                >
                <div className="aspect-[4/3] relative overflow-hidden rounded-b-sm bg-gradient-to-br from-slate-100 via-white to-slate-200">
                  <TemplateCardPreview template={previewData} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                    {template.shortestPrice && template.shortestDuration && (
                      <Badge variant="secondary" className="bg-white text-gray-900 font-semibold">
                        {template.shortestDuration.days} Gün · ₺{template.shortestPrice}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                    {template.audience.slice(0, 2).map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="bg-white/90 text-gray-800 backdrop-blur-sm text-xs"
                      >
                        {category}
                      </Badge>
                    ))}
                    {template.audience.length > 2 && (
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-gray-600 backdrop-blur-sm text-xs"
                      >
                        +{template.audience.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-pink-600 transition-colors">
                    {template.title}
                  </CardTitle>
                  <CardDescription>
                    {template.audience.join(" · ")} kategorilerinde özel mesaj şablonu
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button asChild className="flex-1 group-hover:bg-pink-600 transition-colors">
                      <Link href={`/templates/${template.slug}`}>
                        Seç
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link
                        href={`/templates/${template.slug}/preview`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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

      <CustomTemplateRequest />

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold">Gizli Mesaj</span>
              </div>
              <p className="text-gray-400">
                Sevdiklerinize özel mesajlar oluşturun ve unutulmaz anlar yaratın.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Ürün</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/templates" className="hover:text-white">
                    Şablonlar
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Fiyatlar
                  </Link>
                </li>
                <li>
                  <Link href="/examples" className="hover:text-white">
                    Örnekler
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Destek</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Yardım
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    SSS
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Yasal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Gizlilik
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white">
                    Çerezler
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gizli Mesaj. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
