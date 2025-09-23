import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Palette, Sparkles, Zap } from "lucide-react";

const designStyles = [
  {
    id: "modern",
    name: "Modern",
    description: "Temiz çizgiler ve minimalist yaklaşım ile çağdaş tasarım",
    icon: Palette,
    color: "bg-blue-100 text-blue-800",
    features: [
      "Minimalist ve temiz görünüm",
      "Modern tipografi",
      "Gradient renkler",
      "Smooth animasyonlar",
      "Responsive tasarım"
    ],
    preview: "🎨",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100"
  },
  {
    id: "classic",
    name: "Klasik",
    description: "Zarif ve zamansız tasarım anlayışı",
    icon: Sparkles,
    color: "bg-amber-100 text-amber-800",
    features: [
      "Klasik tipografi",
      "Altın renk tonları",
      "Zarif süslemeler",
      "Geleneksel düzen",
      "Sofistike görünüm"
    ],
    preview: "✨",
    bgColor: "bg-gradient-to-br from-amber-50 to-yellow-100"
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Sade ve odaklanmış görünüm",
    icon: Zap,
    color: "bg-gray-100 text-gray-800",
    features: [
      "Ultra sade tasarım",
      "Monokrom renk paleti",
      "Bol beyaz alan",
      "Odaklanmış içerik",
      "Hızlı yükleme"
    ],
    preview: "⚡",
    bgColor: "bg-gradient-to-br from-gray-50 to-slate-100"
  }
];

export default function StylesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/templates">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Şablonlara Dön
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tasarım Stilleri
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mesajınız için mükemmel tasarım stilini seçin. Her stil, farklı bir deneyim sunar.
          </p>
        </div>

        {/* Design Styles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {designStyles.map((style) => {
            const IconComponent = style.icon;
            return (
              <Card key={style.id} className={`${style.bgColor} border-2 hover:border-pink-300 transition-all duration-300 hover:shadow-lg`}>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                      <IconComponent className="w-8 h-8 text-gray-700" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {style.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {style.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Badge className={`${style.color} w-full justify-center py-2`}>
                      {style.name} Stil
                    </Badge>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Özellikler:</h4>
                      <ul className="space-y-1">
                        {style.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href={`/styles/${style.id}`}>
                      <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                        Detayları Gör
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Hangi Stil Size Uygun?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Her tasarım stili farklı bir his ve deneyim sunar. Mesajınızın tonuna ve alıcınızın zevkine uygun olanı seçin.
              </p>
              <Link href="/templates">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
                  Şablon Seçmeye Başla
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}