import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Heart, ArrowLeft, CreditCard, Shield, Lock } from "lucide-react";
import { generateMetadata } from "@/lib/seo";

export const metadata = generateMetadata({
  title: "Ödeme - Gizli Mesaj",
  description: "Güvenli ödeme ile mesaj şablonlarınızı satın alın ve sevdiklerinizle paylaşın."
});

// Mock cart data - In real app, this would come from state management or API
const mockCartItems = [
  {
    id: "1",
    templateTitle: "Romantik Gün Batımı",
    recipientName: "Ayşe",
    duration: "7 gün",
    price: 29.99,
    quantity: 1
  },
  {
    id: "2",
    templateTitle: "Doğum Günü Kutlaması",
    recipientName: "Ali",
    duration: "3 gün",
    price: 19.99,
    quantity: 1
  }
];

export default function CheckoutPage() {
  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% KDV
  const total = subtotal + tax;

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Sepet", href: "/cart" },
    { label: "Ödeme" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sepet
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-gray-900">Gizli Mesaj</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lock className="h-4 w-4" />
              <span>Güvenli Ödeme</span>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Sepet</span>
              </div>
              <div className="w-8 h-0.5 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Ödeme</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Tamamlandı</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Ödeme Bilgileri
                  </CardTitle>
                  <CardDescription>
                    Güvenli ödeme için kart bilgilerinizi girin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta Adresi *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Mesaj bağlantıları bu adrese gönderilecek
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-4">
                      <Label>Ödeme Yöntemi</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 cursor-pointer hover:border-pink-500 transition-colors">
                          <div className="flex items-center space-x-2">
                            <input type="radio" name="payment" value="card" defaultChecked className="text-pink-500" />
                            <CreditCard className="h-4 w-4" />
                            <span className="text-sm font-medium">Kredi Kartı</span>
                          </div>
                        </div>
                        <div className="border rounded-lg p-4 cursor-pointer hover:border-pink-500 transition-colors opacity-50">
                          <div className="flex items-center space-x-2">
                            <input type="radio" name="payment" value="bank" disabled />
                            <span className="text-sm font-medium">Banka Transferi</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Yakında</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Kart Numarası *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Son Kullanma *</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Kart Üzerindeki İsim *</Label>
                        <Input
                          id="cardName"
                          placeholder="MEHMET YILMAZ"
                          required
                        />
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Fatura Adresi</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Ad *</Label>
                          <Input id="firstName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Soyad *</Label>
                          <Input id="lastName" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Adres *</Label>
                        <Input id="address" required />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Şehir *</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Şehir seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="istanbul">İstanbul</SelectItem>
                              <SelectItem value="ankara">Ankara</SelectItem>
                              <SelectItem value="izmir">İzmir</SelectItem>
                              <SelectItem value="bursa">Bursa</SelectItem>
                              <SelectItem value="antalya">Antalya</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Posta Kodu *</Label>
                          <Input id="postalCode" required />
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox id="terms" required />
                        <Label htmlFor="terms" className="text-sm leading-5">
                          <Link href="/terms" className="text-pink-600 hover:underline">
                            Kullanım Şartları
                          </Link>{" "}
                          ve{" "}
                          <Link href="/privacy" className="text-pink-600 hover:underline">
                            Gizlilik Politikası
                          </Link>
                          &apos;nı okudum ve kabul ediyorum.
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox id="marketing" />
                        <Label htmlFor="marketing" className="text-sm leading-5">
                          Kampanya ve özel tekliflerden haberdar olmak istiyorum.
                        </Label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" size="lg">
                      <Shield className="h-4 w-4 mr-2" />
                      Güvenli Ödeme Yap - ₺{total.toFixed(2)}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sipariş Özeti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {mockCartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.templateTitle}</h4>
                          <p className="text-xs text-gray-600">
                            Alıcı: {item.recipientName} • {item.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">₺{item.price.toFixed(2)}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Ara Toplam</span>
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
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Güvenlik Özellikleri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">SSL Şifreleme</h4>
                      <p className="text-xs text-gray-600">
                        Tüm verileriniz 256-bit SSL ile korunur
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">PCI DSS Uyumlu</h4>
                      <p className="text-xs text-gray-600">
                        Kart bilgileriniz güvenli sunucularda saklanır
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Gizlilik Garantisi</h4>
                      <p className="text-xs text-gray-600">
                        Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz
                      </p>
                    </div>
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
                      Ödeme sürecinde sorun yaşıyorsanız destek ekibimizle iletişime geçin.
                    </p>
                    <Button variant="outline" size="sm">
                      Canlı Destek
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}