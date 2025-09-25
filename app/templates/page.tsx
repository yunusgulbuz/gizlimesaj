import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, Filter } from "lucide-react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { generateMetadata } from "@/lib/seo";
import { CacheService, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

export const metadata = generateMetadata({
  title: "Şablonlar - Gizli Mesaj",
  description: "Sevdiklerinize özel mesajlar için çeşitli şablonlarımızı keşfedin. Romantik, eğlenceli ve klasik temalar."
});

interface Template {
  id: string;
  slug: string;
  title: string;
  audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant';
  preview_url: string | null;
  bg_audio_url: string | null;
}

const audienceLabels = {
  teen: { label: "Genç", color: "bg-blue-100 text-blue-800" },
  adult: { label: "Yetişkin", color: "bg-green-100 text-green-800" },
  classic: { label: "Klasik", color: "bg-gray-100 text-gray-800" },
  fun: { label: "Eğlenceli", color: "bg-yellow-100 text-yellow-800" },
  elegant: { label: "Zarif", color: "bg-purple-100 text-purple-800" }
};

async function getTemplates(): Promise<Template[]> {
  // Try to get from cache first
  const cached = await CacheService.get<Template[]>(CACHE_KEYS.TEMPLATES);
  if (cached) {
    return cached;
  }

  const supabase = await createServerSupabaseClient();
  
  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  const result = templates || [];
  
  // Cache the result
  await CacheService.set(CACHE_KEYS.TEMPLATES, result, CACHE_TTL.TEMPLATES);
  
  return result;
}

export default async function TemplatesPage() {
  const templates = await getTemplates();

  // Breadcrumb items for templates page
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Şablonlar' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      {/* Header */}
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
            <Button variant="outline" size="sm">
              Giriş Yap
            </Button>
          </div>
        </nav>
      </header>

      {/* Page Header */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mesaj Şablonları
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sevdiklerinize uygun şablonu seçin ve kişiselleştirin. 
            Her şablon özel olarak tasarlanmış ve farklı duygular için optimize edilmiştir.
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Tümü
          </Button>
          {Object.entries(audienceLabels).map(([key, { label }]) => (
            <Button key={key} variant="ghost" size="sm">
              {label}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Henüz şablon bulunmuyor. Lütfen daha sonra tekrar kontrol edin.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {templates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-purple-100 relative overflow-hidden">
                  {/* Web sayfası preview'ı için iframe kullanıyoruz */}
                  <div className="w-full h-full relative">
                    <iframe
                      src={`/templates/${template.slug}?preview=true`}
                      className="w-full h-full border-0 pointer-events-none scale-50 origin-top-left"
                      style={{ 
                        width: '200%', 
                        height: '200%',
                        transform: 'scale(0.5)',
                        transformOrigin: 'top left'
                      }}
                      title={`${template.title} Preview`}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white rounded-full p-3 shadow-lg">
                          <Heart className="h-6 w-6 text-pink-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className={audienceLabels[template.audience].color}>
                      {audienceLabels[template.audience].label}
                    </Badge>
                  </div>
                  {template.bg_audio_url && (
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="text-xs">
                        🎵 Müzikli
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-pink-600 transition-colors">
                    {template.title}
                  </CardTitle>
                  <CardDescription>
                    {audienceLabels[template.audience].label} kategorisinde özel mesaj şablonu
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
                      <Link href={`/templates/${template.slug}/preview`} target="_blank" rel="noopener noreferrer">
                        Önizleme
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Özel Şablon İsteği
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Aradığınız şablonu bulamadınız mı? Özel şablon talebinizi bize iletin, 
            size özel tasarım yapalım.
          </p>
          <Button variant="outline" size="lg">
            Özel Şablon İste
          </Button>
        </div>
      </section>

      {/* Footer */}
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
                <li><Link href="/templates" className="hover:text-white">Şablonlar</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Fiyatlar</Link></li>
                <li><Link href="/examples" className="hover:text-white">Örnekler</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Destek</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Yardım</Link></li>
                <li><Link href="/contact" className="hover:text-white">İletişim</Link></li>
                <li><Link href="/faq" className="hover:text-white">SSS</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Yasal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Gizlilik</Link></li>
                <li><Link href="/terms" className="hover:text-white">Kullanım Şartları</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Çerezler</Link></li>
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