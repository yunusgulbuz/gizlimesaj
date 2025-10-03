import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Palette, Check, Star } from "lucide-react";

const modernFeatures = [
  {
    title: "Minimalist Tasarım",
    description: "Gereksiz öğelerden arındırılmış, temiz ve modern görünüm",
    icon: "🎨"
  },
  {
    title: "Gradient Renkler",
    description: "Çağdaş gradient renk geçişleri ile göz alıcı görsellik",
    icon: "🌈"
  },
  {
    title: "Modern Tipografi",
    description: "Okunabilir ve şık font seçimleri",
    icon: "📝"
  },
  {
    title: "Smooth Animasyonlar",
    description: "Akıcı geçişler ve etkileşimli animasyonlar",
    icon: "✨"
  },
  {
    title: "Responsive Tasarım",
    description: "Tüm cihazlarda mükemmel görünüm",
    icon: "📱"
  },
  {
    title: "Hızlı Yükleme",
    description: "Optimize edilmiş performans",
    icon: "⚡"
  }
];

const colorPalette = [
  { name: "Ana Renk", color: "bg-blue-500", hex: "#3B82F6" },
  { name: "Vurgu Rengi", color: "bg-indigo-500", hex: "#6366F1" },
  { name: "Arka Plan", color: "bg-gray-50", hex: "#F9FAFB" },
  { name: "Metin", color: "bg-gray-900", hex: "#111827" }
];

export default function ModernStylePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/styles">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Tasarım Stillerine Dön
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Palette className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Modern Tasarım Stili
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Temiz çizgiler ve minimalist yaklaşım ile çağdaş tasarım deneyimi
          </p>
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg">
            🎨 Modern Stil
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Features */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                Özellikler
              </CardTitle>
              <CardDescription>
                Modern stilin sunduğu avantajlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modernFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl">{feature.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded"></div>
                Renk Paleti
              </CardTitle>
              <CardDescription>
                Modern stilin renk şeması
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colorPalette.map((color, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 ${color.color} rounded-full shadow-sm`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{color.name}</div>
                      <div className="text-sm text-gray-500">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <Card className="bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Önizleme</CardTitle>
            <CardDescription>
              Modern stilin nasıl göründüğüne dair örnek
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Sevgili Sarah,</h3>
              <p className="text-lg opacity-90 mb-6">
                Bu özel gün için sana modern ve şık bir mesaj hazırladım...
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm">Modern Tasarım</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best For Section */}
        <Card className="bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Bu Stil Kimler İçin Uygun?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  İdeal Durumlar:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Genç ve dinamik alıcılar</li>
                  <li>• Çağdaş ve modern zevkler</li>
                  <li>• Teknoloji meraklıları</li>
                  <li>• Minimalist estetik sevenler</li>
                  <li>• İş dünyasından kişiler</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-700">Mesaj Türleri:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Doğum günü kutlamaları</li>
                  <li>• Başarı tebrikler</li>
                  <li>• Yeni iş kutlamaları</li>
                  <li>• Mezuniyet mesajları</li>
                  <li>• Motivasyon mesajları</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Modern Stili Beğendiniz mi?
              </h2>
              <p className="mb-6 opacity-90">
                Şimdi bir şablon seçin ve modern tasarım stili ile mesajınızı oluşturun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/templates">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Sürpriz Seç
                  </Button>
                </Link>
                <Link href="/styles">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Diğer Stilleri Gör
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}