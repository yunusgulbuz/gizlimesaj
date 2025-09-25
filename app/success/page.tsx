import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Heart, CheckCircle, Mail, Share2, Download, ArrowRight } from "lucide-react";
import { generateMetadata } from "@/lib/seo";

export const metadata = generateMetadata({
  title: "Ödeme Başarılı - Gizli Mesaj",
  description: "Ödemeniz başarıyla tamamlandı. Mesaj bağlantılarınız e-posta adresinize gönderildi."
});

// Mock order data - In real app, this would come from URL params or API
const mockOrder = {
  id: "GM-2024-001",
  email: "ornek@email.com",
  items: [
    {
      id: "1",
      templateTitle: "Romantik Gün Batımı",
      recipientName: "Ayşe",
      senderName: "Mehmet",
      duration: "7 gün",
      messageUrl: "https://gizlimesaj.com/m/abc123def456",
      expiresAt: "2024-01-15"
    },
    {
      id: "2",
      templateTitle: "Doğum Günü Kutlaması",
      recipientName: "Ali",
      senderName: "Fatma",
      duration: "3 gün",
      messageUrl: "https://gizlimesaj.com/m/xyz789uvw012",
      expiresAt: "2024-01-10"
    }
  ],
  total: 49.98,
  createdAt: "2024-01-07"
};

export default function SuccessPage() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Sepet", href: "/cart" },
    { label: "Ödeme", href: "/checkout" },
    { label: "Başarılı" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">Gizli Mesaj</span>
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

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme Başarılı!</h1>
            <p className="text-gray-600 text-lg">
              Mesaj bağlantılarınız hazırlandı ve e-posta adresinize gönderildi.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sipariş Detayları</CardTitle>
              <CardDescription>
                Sipariş No: {mockOrder.id} • {mockOrder.createdAt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Fatura Bilgileri</h3>
                  <p className="text-sm text-gray-600">E-posta: {mockOrder.email}</p>
                  <p className="text-sm text-gray-600">Toplam: ₺{mockOrder.total}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Ödeme Durumu</h3>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Ödeme Tamamlandı</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Links */}
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Mesaj Bağlantılarınız</h2>
            <p className="text-gray-600">
              Aşağıdaki bağlantıları sevdiklerinizle paylaşabilirsiniz. Her bağlantı belirtilen süre boyunca aktif kalacaktır.
            </p>

            {mockOrder.items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{item.templateTitle}</h3>
                      <p className="text-gray-600">
                        {item.senderName} → {item.recipientName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{item.duration}</p>
                      <p className="text-xs text-gray-500">Son: {item.expiresAt}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">Mesaj Bağlantısı:</p>
                        <p className="text-sm text-gray-600 truncate font-mono">
                          {item.messageUrl}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(item.messageUrl)}
                      >
                        Kopyala
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={item.messageUrl} target="_blank">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Önizle
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Paylaş
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      QR Kod
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">E-posta Kontrolü</h3>
                  <p className="text-sm text-gray-600">
                    Mesaj bağlantıları {mockOrder.email} adresine gönderildi. 
                    Spam klasörünü de kontrol edin.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Share2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Bağlantıları Paylaş</h3>
                  <p className="text-sm text-gray-600">
                    Mesaj bağlantılarını WhatsApp, SMS veya sosyal medya 
                    üzerinden sevdiklerinizle paylaşın.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Anıları Yaşayın</h3>
                  <p className="text-sm text-gray-600">
                    Sevdiklerinizin mesajlarınızı açtığında 
                    unutulmaz anlar yaşayacaksınız.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/templates">
                  Yeni Mesaj Oluştur
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  Ana Sayfa
                </Link>
              </Button>
            </div>
            
            <p className="text-sm text-gray-600">
              Sorularınız için{" "}
              <Link href="/contact" className="text-pink-600 hover:underline">
                destek ekibimizle iletişime geçin
              </Link>
            </p>
          </div>

          {/* Tips */}
          <Card className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardHeader>
              <CardTitle className="text-lg">💡 İpuçları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Mesaj bağlantıları belirlenen süre sonunda otomatik olarak deaktif olur</p>
              <p>• Bağlantıları önceden test ederek doğru çalıştığından emin olun</p>
              <p>• QR kod ile paylaşım daha kolay ve etkileyici olabilir</p>
              <p>• Özel günlerde (yıldönümü, doğum günü) paylaşmayı unutmayın</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}