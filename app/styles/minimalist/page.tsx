import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap, Check, Minus } from "lucide-react";

const minimalistFeatures = [
  {
    title: "Ultra Sade Tasarım",
    description: "Gereksiz her şeyden arındırılmış temiz görünüm",
    icon: "⚪"
  },
  {
    title: "Monokrom Renk Paleti",
    description: "Siyah, beyaz ve gri tonlarında sakinlik",
    icon: "⚫"
  },
  {
    title: "Bol Beyaz Alan",
    description: "Nefes alabilir ve odaklanmış düzen",
    icon: "🔳"
  },
  {
    title: "Odaklanmış İçerik",
    description: "Dikkat dağıtmayan, net mesaj iletimi",
    icon: "🎯"
  },
  {
    title: "Hızlı Yükleme",
    description: "Minimum kaynak kullanımı ile yüksek performans",
    icon: "⚡"
  },
  {
    title: "Evrensel Uyum",
    description: "Her yaş ve zevke hitap eden sadelik",
    icon: "🌐"
  }
];

const colorPalette = [
  { name: "Saf Beyaz", color: "bg-white border border-gray-300", hex: "#FFFFFF" },
  { name: "Açık Gri", color: "bg-gray-100", hex: "#F3F4F6" },
  { name: "Orta Gri", color: "bg-gray-500", hex: "#6B7280" },
  { name: "Koyu Gri", color: "bg-gray-900", hex: "#111827" }
];

export default function MinimalistStylePage() {
  return (
    <div className="min-h-screen bg-white">
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
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Zap className="w-10 h-10 text-gray-700" />
            </div>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Minimalist Tasarım Stili
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6 font-light">
            Sade ve odaklanmış görünüm ile net mesaj iletimi
          </p>
          <Badge className="bg-gray-100 text-gray-800 px-4 py-2 text-lg font-normal">
            ⚡ Minimalist Stil
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Features */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-light">
                <Minus className="w-5 h-5 text-gray-600" />
                Özellikler
              </CardTitle>
              <CardDescription>
                Minimalist stilin sunduğu sadelik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {minimalistFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                    <div className="text-2xl">{feature.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600 font-light">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-light">
                <div className="w-5 h-5 bg-gradient-to-r from-gray-300 to-gray-700 rounded"></div>
                Renk Paleti
              </CardTitle>
              <CardDescription>
                Minimalist stilin monokrom tonları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colorPalette.map((color, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                    <div className={`w-8 h-8 ${color.color} rounded shadow-sm`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{color.name}</div>
                      <div className="text-sm text-gray-500 font-mono">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <Card className="bg-white border border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="font-light">Önizleme</CardTitle>
            <CardDescription>
              Minimalist stilin nasıl göründüğüne dair örnek
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white border-2 border-gray-200 rounded p-12 text-center">
              <h3 className="text-2xl font-light mb-6 text-gray-900">Alex,</h3>
              <p className="text-lg text-gray-700 mb-8 font-light leading-relaxed">
                Sade ve anlamlı bir mesaj.
              </p>
              <div className="inline-flex items-center gap-2 bg-gray-900 text-white rounded px-4 py-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm font-light">Minimalist</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best For Section */}
        <Card className="bg-white border border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="font-light">Bu Stil Kimler İçin Uygun?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-green-700 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  İdeal Durumlar:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 font-light">
                  <li>• Sadelik seven kişiler</li>
                  <li>• Odaklanmış mesaj isteyenler</li>
                  <li>• Modern ve temiz zevkler</li>
                  <li>• Hızlı okuma tercih edenler</li>
                  <li>• Evrensel uyum arayanlar</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Mesaj Türleri:</h4>
                <ul className="space-y-2 text-sm text-gray-600 font-light">
                  <li>• Kısa ve öz kutlamalar</li>
                  <li>• İş mesajları</li>
                  <li>• Günlük hatırlatmalar</li>
                  <li>• Basit teşekkürler</li>
                  <li>• Net duyurular</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gray-900 text-white border-gray-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-light mb-4">
                Minimalist Sadeliği Beğendiniz mi?
              </h2>
              <p className="mb-6 opacity-90 font-light">
                Şimdi bir şablon seçin ve minimalist tasarım stili ile net mesajınızı oluşturun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/templates">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-light">
                    Şablon Seç
                  </Button>
                </Link>
                <Link href="/styles">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-light">
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