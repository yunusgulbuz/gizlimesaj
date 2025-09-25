import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Heart, ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { generateMetadata } from "@/lib/seo";

export const metadata = generateMetadata({
  title: "Sepet - Gizli Mesaj",
  description: "Seçtiğiniz mesaj şablonlarını gözden geçirin ve ödeme işlemini tamamlayın."
});

// Mock cart data - In real app, this would come from state management or API
const mockCartItems = [
  {
    id: "1",
    templateId: "romantic-sunset",
    templateTitle: "Romantik Gün Batımı",
    templateAudience: "adult",
    recipientName: "Ayşe",
    senderName: "Mehmet",
    message: "Seninle geçirdiğim her an çok değerli. Bu özel günümüzü unutmayalım.",
    duration: "7 gün",
    price: 29.99,
    quantity: 1
  },
  {
    id: "2",
    templateId: "birthday-celebration",
    templateTitle: "Doğum Günü Kutlaması",
    templateAudience: "fun",
    recipientName: "Ali",
    senderName: "Fatma",
    message: "Doğum günün kutlu olsun! Sana harika bir yıl diliyorum.",
    duration: "3 gün",
    price: 19.99,
    quantity: 1
  }
];

const audienceLabels = {
  teen: { label: "Genç", color: "bg-blue-100 text-blue-800" },
  adult: { label: "Yetişkin", color: "bg-green-100 text-green-800" },
  classic: { label: "Klasik", color: "bg-gray-100 text-gray-800" },
  fun: { label: "Eğlenceli", color: "bg-yellow-100 text-yellow-800" },
  elegant: { label: "Zarif", color: "bg-purple-100 text-purple-800" }
};

export default function CartPage() {
  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% KDV
  const total = subtotal + tax;

  // Breadcrumb items for cart page
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Sepet' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/templates">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Şablonlara Dön
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-gray-900">Gizli Mesaj</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sepetiniz</h1>
            <p className="text-gray-600">
              Seçtiğiniz mesaj şablonlarını gözden geçirin ve ödeme işlemini tamamlayın
            </p>
          </div>

          {mockCartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sepetiniz Boş</h2>
              <p className="text-gray-600 mb-6">
                Henüz sepetinize ürün eklemediniz. Şablonlarımıza göz atın!
              </p>
              <Button asChild>
                <Link href="/templates">Şablonları İncele</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {mockCartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Template Preview */}
                        <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Heart className="h-8 w-8 text-pink-400" />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 truncate">
                                {item.templateTitle}
                              </h3>
                              <Badge className={audienceLabels[item.templateAudience as keyof typeof audienceLabels].color}>
                                {audienceLabels[item.templateAudience as keyof typeof audienceLabels].label}
                              </Badge>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <p><span className="font-medium">Alıcı:</span> {item.recipientName}</p>
                            <p><span className="font-medium">Gönderen:</span> {item.senderName}</p>
                            <p><span className="font-medium">Süre:</span> {item.duration}</p>
                            <p className="truncate"><span className="font-medium">Mesaj:</span> {item.message}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">₺{item.price.toFixed(2)}</p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-gray-500">
                                  ₺{(item.price * item.quantity).toFixed(2)} toplam
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Continue Shopping */}
                <div className="pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/templates">
                      <Plus className="h-4 w-4 mr-2" />
                      Başka Şablon Ekle
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sipariş Özeti</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Ara Toplam ({mockCartItems.length} ürün)</span>
                        <span>₺{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>KDV (%18)</span>
                        <span>₺{tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Toplam</span>
                        <span className="text-green-600">₺{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button className="w-full" size="lg" asChild>
                      <Link href="/checkout">
                        Ödemeye Geç
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Promo Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Promosyon Kodu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input placeholder="Promosyon kodunu girin" />
                      <Button variant="outline">Uygula</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Info */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-2xl">🔒</div>
                      <h3 className="font-semibold text-sm">Güvenli Ödeme</h3>
                      <p className="text-xs text-gray-600">
                        Tüm ödemeler SSL ile şifrelenir ve güvenli bir şekilde işlenir.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Support */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-2xl">💬</div>
                      <h3 className="font-semibold text-sm">Yardıma mı İhtiyacınız Var?</h3>
                      <p className="text-xs text-gray-600">
                        Sorularınız için destek ekibimizle iletişime geçin.
                      </p>
                      <Button variant="outline" size="sm">
                        Destek Al
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}