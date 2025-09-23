import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Clock, Shield, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">Gizli Mesaj</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/templates" className="text-gray-600 hover:text-gray-900">
              Şablonlar
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              Hakkında
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                Giriş Yap
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sevdiklerinize
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              {" "}Özel Mesajlar{" "}
            </span>
            Oluşturun
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Romantik, eğlenceli ve unutulmaz anlar için kişiselleştirilmiş mesaj sayfaları. 
            Sadece birkaç dakikada özel bağlantınızı oluşturun ve sevdiklerinizi şaşırtın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/templates">
                <Sparkles className="mr-2 h-5 w-5" />
                Şablonları Keşfet
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Nasıl Çalışır?
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Neden Gizli Mesaj?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sevdiklerinize ulaşmanın en özel ve unutulmaz yolu
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-pink-500" />
              </div>
              <CardTitle>Kişiselleştirilmiş</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Her mesaj, alıcıya özel olarak tasarlanır. İsim, mesaj ve tema seçimiyle 
                tamamen kişisel bir deneyim yaratın.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle>Süreli Erişim</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Mesajınız belirlediğiniz süre boyunca aktif kalır. 2-5 gün arası seçeneklerle 
                özel anları daha değerli kılın.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-indigo-500" />
              </div>
              <CardTitle>Güvenli & Özel</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Mesajlarınız güvenli bir şekilde saklanır ve sadece özel bağlantıya sahip 
                kişiler tarafından görüntülenebilir.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sadece 3 adımda özel mesajınızı oluşturun
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Şablon Seçin</h3>
              <p className="text-gray-600">
                Çeşitli temalardan sevdiklerinize uygun olanı seçin
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Kişiselleştirin</h3>
              <p className="text-gray-600">
                Alıcı adını ve özel mesajınızı yazın, süreyi belirleyin
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Paylaşın</h3>
              <p className="text-gray-600">
                Özel bağlantınızı alın ve sevdiklerinizle paylaşın
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Sevdiklerinizi şaşırtmak için en güzel anı yaratın. 
            Özel mesajınızı oluşturmak sadece birkaç dakika sürüyor.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/templates">
              Şimdi Oluştur
            </Link>
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
