import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Clock, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Teslimat Koşulları | birmesajmutluluk',
  description: 'Dijital ürün teslimat koşulları ve süreçleri hakkında bilgi.',
};

export default function TeslimatKosullariPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Teslimat Koşulları
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Son Güncellenme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-purple-600" />
                1. Dijital Ürün Teslimatı
              </h2>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  birmesajmutluluk platformu üzerinden satın alınan tüm ürünler <strong>dijital</strong> ürünlerdir.
                  Fiziksel bir teslimat söz konusu değildir. Ürünleriniz elektronik ortamda anında teslim edilir.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                2. Teslimat Süreci
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2.1. Şablon Satın Alımları</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Ödeme onaylandıktan sonra anında kişisel mesaj sayfanız oluşturulur</li>
                    <li>Benzersiz bir URL (link) ile mesajınıza erişim sağlanır</li>
                    <li>Ödeme başarılı olduktan sonra maksimum 2 dakika içinde teslimat tamamlanır</li>
                    <li>Hesabınıza kayıtlı e-posta adresinize teslimat bildirimi gönderilir</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2.2. AI Kredi Satın Alımları</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Ödeme onaylandıktan sonra AI krediler hesabınıza <strong>anında</strong> tanımlanır</li>
                    <li>Krediler asla bitmez, istediğiniz zaman kullanabilirsiniz</li>
                    <li>Hesabınızdan kredi bakiyenizi görüntüleyebilirsiniz</li>
                    <li>E-posta ile satın alma onay bildirimi alırsınız</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Teslimat Problemleri
              </h2>
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Ödemeniz tamamlandıktan sonra teslimat gerçekleşmezse:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Hesabınıza giriş yapıp "Siparişlerim" bölümünü kontrol edin</li>
                  <li>E-posta kutunuzun spam/gereksiz klasörünü kontrol edin</li>
                  <li>Sayfayı yenilemeyi deneyin (F5 veya Ctrl+R)</li>
                  <li>Problem devam ederse <Link href="/contact" className="text-purple-600 hover:underline">destek ekibimizle iletişime geçin</Link></li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Erişim Süresi
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Kişisel Mesaj Sayfaları:</strong> Satın aldığınız süre boyunca (2 gün, 3 gün, 1 hafta, 1 ay veya sınırsız) aktif kalır</li>
                <li><strong>AI Krediler:</strong> Asla bitmez, süresiz kullanılabilir</li>
                <li><strong>Taslaklar:</strong> Tüm kullanıcılar için 10 taslak slotu süresiz saklanır</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Güvenlik ve Gizlilik
              </h2>
              <p className="text-gray-700 mb-4">
                Tüm teslimatlar SSL şifrelemesi ile güvenli olarak gerçekleştirilir.
                Ödeme bilgileriniz hiçbir zaman sistemimizde saklanmaz.
              </p>
              <p className="text-gray-700">
                Kişisel verilerinizin korunması için <Link href="/privacy" className="text-purple-600 hover:underline">Gizlilik Politikamızı</Link> inceleyebilirsiniz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. İletişim
              </h2>
              <p className="text-gray-700 mb-4">
                Teslimat ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>E-posta:</strong> <a href="mailto:birmesajmutluluk@gmail.com" className="text-purple-600 hover:underline">birmesajmutluluk@gmail.com</a>
                </p>
                <p className="text-gray-700">
                  <strong>İletişim Formu:</strong> <Link href="/contact" className="text-purple-600 hover:underline">İletişim Sayfası</Link>
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Bu teslimat koşulları birmesajmutluluk.com için geçerlidir ve herhangi bir zamanda güncellenebilir.
                Güncellemelerden haberdar olmak için bu sayfayı düzenli olarak kontrol etmenizi öneririz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
