import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Check, Crown } from "lucide-react";

const classicFeatures = [
  {
    title: "Klasik Tipografi",
    description: "Serif fontlar ve geleneksel yazı stilleri",
    icon: "📜"
  },
  {
    title: "Altın Renk Tonları",
    description: "Lüks ve zarafeti yansıtan altın detaylar",
    icon: "✨"
  },
  {
    title: "Zarif Süslemeler",
    description: "İnce çizgiler ve klasik desenler",
    icon: "🎭"
  },
  {
    title: "Geleneksel Düzen",
    description: "Simetrik ve dengeli kompozisyon",
    icon: "⚖️"
  },
  {
    title: "Sofistike Görünüm",
    description: "Olgun ve seçkin estetik anlayış",
    icon: "👑"
  },
  {
    title: "Zamansız Tasarım",
    description: "Hiç eskimeyecek klasik güzellik",
    icon: "⏳"
  }
];

const colorPalette = [
  { name: "Altın", color: "bg-amber-500", hex: "#F59E0B" },
  { name: "Koyu Altın", color: "bg-amber-700", hex: "#B45309" },
  { name: "Krem", color: "bg-amber-50", hex: "#FFFBEB" },
  { name: "Koyu Kahve", color: "bg-amber-900", hex: "#78350F" }
];

export default function ClassicStylePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
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
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-amber-200">
              <Sparkles className="w-10 h-10 text-amber-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
            Klasik Tasarım Stili
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Zarif ve zamansız tasarım anlayışı ile sofistike mesajlar
          </p>
          <Badge className="bg-amber-100 text-amber-800 px-4 py-2 text-lg">
            ✨ Klasik Stil
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Features */}
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Crown className="w-5 h-5 text-amber-600" />
                Özellikler
              </CardTitle>
              <CardDescription>
                Klasik stilin sunduğu zarafet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classicFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="text-2xl">{feature.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-serif">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <div className="w-5 h-5 bg-gradient-to-r from-amber-400 to-amber-600 rounded"></div>
                Renk Paleti
              </CardTitle>
              <CardDescription>
                Klasik stilin altın tonları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colorPalette.map((color, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className={`w-8 h-8 ${color.color} rounded-full shadow-sm border border-amber-200`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 font-serif">{color.name}</div>
                      <div className="text-sm text-gray-500">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <Card className="bg-white/80 backdrop-blur-sm mb-8 border-amber-200">
          <CardHeader>
            <CardTitle className="font-serif">Önizleme</CardTitle>
            <CardDescription>
              Klasik stilin nasıl göründüğüne dair örnek
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg p-8 text-center border-2 border-amber-300 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-amber-400 rounded-full opacity-30"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-amber-400 rounded-full opacity-30"></div>
              
              <h3 className="text-2xl font-bold mb-4 text-amber-900 font-serif">Sevgili Margaret,</h3>
              <p className="text-lg text-amber-800 mb-6 font-serif italic">
                Bu özel günde size klasik ve zarif bir mesaj sunmak istedim...
              </p>
              <div className="inline-flex items-center gap-2 bg-amber-600 text-white rounded-full px-6 py-2 font-serif">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Klasik Zarafet</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best For Section */}
        <Card className="bg-white/80 backdrop-blur-sm mb-8 border-amber-200">
          <CardHeader>
            <CardTitle className="font-serif">Bu Stil Kimler İçin Uygun?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700 flex items-center gap-2 font-serif">
                  <Check className="w-4 h-4" />
                  İdeal Durumlar:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Olgun ve seçkin alıcılar</li>
                  <li>• Geleneksel değerleri önemseyen kişiler</li>
                  <li>• Resmi ve özel kutlamalar</li>
                  <li>• Lüks ve zarafet sevenler</li>
                  <li>• Klasik sanat meraklıları</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-amber-700 font-serif">Mesaj Türleri:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Evlilik yıldönümleri</li>
                  <li>• Emeklilik kutlamaları</li>
                  <li>• Önemli yaş günleri</li>
                  <li>• Başarı takdirleri</li>
                  <li>• Teşekkür mesajları</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-400">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 font-serif">
                Klasik Zarafeti Beğendiniz mi?
              </h2>
              <p className="mb-6 opacity-90">
                Şimdi bir şablon seçin ve klasik tasarım stili ile zamansız mesajınızı oluşturun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/templates">
                  <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100 font-serif">
                    Şablon Seç
                  </Button>
                </Link>
                <Link href="/styles">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-serif">
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