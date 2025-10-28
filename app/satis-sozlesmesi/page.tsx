import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Satış Sözleşmesi | birmesajmutluluk',
  description: 'Mesafeli satış sözleşmesi ve satış politikası.',
};

export default function SatisSozlesmesiPage() {
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Mesafeli Satış Sözleşmesi
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Son Güncellenme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Taraflar
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">SATICI BİLGİLERİ</h3>
                <ul className="space-y-1 text-gray-700">
                  <li><strong>Ticari Unvan:</strong> birmesajmutluluk.com</li>
                  <li><strong>E-posta:</strong> birmesajmutluluk@gmail.com</li>
                  <li><strong>Web Sitesi:</strong> https://birmesajmutluluk.com</li>
                </ul>
              </div>
              <p className="text-gray-700 mb-4">
                <strong>ALICI:</strong> Platformumuz üzerinden ürün/hizmet satın alan gerçek veya tüzel kişi.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" />
                2. Sözleşmenin Konusu
              </h2>
              <p className="text-gray-700 mb-4">
                İşbu sözleşme, ALICI'nın SATICI'ya ait birmesajmutluluk.com internet sitesi üzerinden
                elektronik ortamda siparişini verdiği aşağıda nitelikleri ve satış fiyatı belirtilen
                dijital ürün/hizmetlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin
                Korunması Hakkındaki Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince
                tarafların hak ve yükümlülüklerini düzenler.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Ürün/Hizmet Bilgileri
              </h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">3.1. Kişisel Mesaj Şablonları</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Dijital mesaj sayfası oluşturma hizmeti</li>
                    <li>Seçilen süre boyunca (2 gün - sınırsız) erişim</li>
                    <li>Özelleştirilebilir tasarımlar ve içerik</li>
                    <li>Benzersiz URL ile paylaşım imkanı</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">3.2. AI Kredi Paketleri</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Yapay zeka destekli template oluşturma kredileri</li>
                    <li>10, 30 veya 100 adet AI kullanım hakkı</li>
                    <li>Süresiz geçerlilik</li>
                    <li>Generate ve Refine işlemleri için kullanılabilir</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-purple-600" />
                4. Fiyat ve Ödeme Bilgileri
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Ürün fiyatları Türk Lirası (TL) cinsindendir</li>
                <li>Belirtilen fiyatlara KDV (%20) dahildir</li>
                <li>Ödeme, kredi kartı veya banka kartı ile gerçekleştirilir</li>
                <li>Tüm ödemeler güvenli ödeme altyapısı (PayTR) üzerinden işlenir</li>
                <li>SATICI, kredi kartı bilgilerini görmez ve saklamaz</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Teslimat Koşulları
              </h2>
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  <strong>Dijital Teslimat:</strong> Tüm ürünler dijitaldir ve fiziksel teslimat yoktur.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Ödeme onaylandıktan sonra anında teslimat yapılır</li>
                  <li>Kişisel mesaj sayfaları için benzersiz URL oluşturulur</li>
                  <li>AI krediler hesaba otomatik tanımlanır</li>
                  <li>E-posta ile bilgilendirme yapılır</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  Detaylı bilgi için <Link href="/teslimat-kosullari" className="text-purple-600 hover:underline">Teslimat Koşulları</Link> sayfasını inceleyebilirsiniz.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Cayma Hakkı - Önemli Uyarı
              </h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <p className="text-gray-700 mb-4">
                  <strong className="text-red-700">Dijital İçerik Cayma Hakkı İstisnası:</strong>
                </p>
                <p className="text-gray-700 mb-4">
                  6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 15. maddesi ve Mesafeli Sözleşmeler Yönetmeliği'nin
                  15. maddesi (ı) bendi gereğince, <strong>bir defaya mahsus kullanılabilecek veya kısa sürede kullanılması
                  gereken, elektronik ortamda anında teslim edilen dijital içerik</strong> niteliğindeki ürünlerde
                  cayma hakkı <strong>KULLANILAMAZ</strong>.
                </p>
                <p className="text-gray-700">
                  Alıcı, satın aldığı dijital ürünlerin bu kapsama girdiğini ve cayma hakkının bulunmadığını kabul eder.
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Detaylı bilgi için <Link href="/iptal-iade" className="text-purple-600 hover:underline">İptal ve İade Koşulları</Link> sayfasını inceleyebilirsiniz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Fikri Mülkiyet Hakları
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Platformdaki tüm tasarımlar, yazılımlar ve içerikler SATICI'ya aittir</li>
                <li>ALICI, satın aldığı ürünü yalnızca kişisel kullanım için kullanabilir</li>
                <li>Ürünlerin ticari amaçla çoğaltılması, satılması yasaktır</li>
                <li>Kaynak kodların tersine mühendisliği yapılamaz</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Gizlilik ve Kişisel Verilerin Korunması
              </h2>
              <p className="text-gray-700 mb-4">
                SATICI, ALICI'nın kişisel verilerini 6698 sayılı Kişisel Verilerin Korunması Kanunu'na
                uygun olarak işler ve korur. Detaylı bilgi için <Link href="/privacy" className="text-purple-600 hover:underline">Gizlilik Politikası</Link> sayfasını inceleyebilirsiniz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Uyuşmazlık Çözümü
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>İşbu sözleşmeden doğan uyuşmazlıklarda Türk Hukuku uygulanır</li>
                <li>Tüketici hakem heyetleri ve tüketici mahkemeleri yetkilidir</li>
                <li>Uyuşmazlıklar için öncelikle <Link href="/contact" className="text-purple-600 hover:underline">müşteri hizmetleri</Link> ile iletişime geçilmesi önerilir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Yürürlük
              </h2>
              <p className="text-gray-700">
                ALICI, satın alma işlemini tamamlayarak işbu sözleşmenin tüm koşullarını okuduğunu,
                anladığını ve kabul ettiğini beyan ve taahhüt eder. Bu sözleşme, siparişin
                onaylanması ile birlikte yürürlüğe girer.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Bu sözleşme birmesajmutluluk.com için geçerlidir. SATICI, sözleşme hükümlerini
                önceden bildirerek değiştirme hakkını saklı tutar. Güncellemeler bu sayfada yayınlanacaktır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
