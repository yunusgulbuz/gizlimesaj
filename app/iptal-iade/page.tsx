import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, XCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'İptal ve İade Koşulları | birmesajmutluluk',
  description: 'Dijital ürünler için iptal ve iade prosedürü bilgileri.',
};

export default function IptalIadePage() {
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              İptal ve İade Koşulları
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Son Güncellenme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {/* Önemli Uyarı */}
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">ÖNEMLİ UYARI</h3>
                  <p className="text-gray-700">
                    birmesajmutluluk.com üzerinden satın alınan tüm ürünler <strong>dijital içerik</strong> niteliğindedir
                    ve anında teslim edilmektedir. Bu nedenle, yasal düzenlemeler gereği <strong className="text-red-700">cayma
                    hakkı ve iade hakkı bulunmamaktadır</strong>.
                  </p>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-600" />
                1. Yasal Düzenleme
              </h2>
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-4">
                <p className="text-gray-700 mb-4">
                  <strong>6502 Sayılı Tüketicinin Korunması Hakkında Kanun</strong> ve <strong>Mesafeli Sözleşmeler Yönetmeliği</strong>'nin
                  15. maddesi gereğince, aşağıdaki durumlar cayma hakkının kullanılamayacağı istisnalar arasındadır:
                </p>
                <div className="border-l-4 border-blue-500 pl-4 mb-4">
                  <p className="text-gray-700 italic">
                    "15. madde (ı) bendi: Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye
                    anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz."
                  </p>
                </div>
                <p className="text-gray-700">
                  Platformumuzda satılan tüm ürünler (kişisel mesaj şablonları ve AI krediler) bu kapsamdadır.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Dijital Ürün Özellikleri
              </h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-2">2.1. Kişisel Mesaj Şablonları</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Ödeme onaylandığı anda benzersiz URL oluşturulur</li>
                    <li>Mesaj sayfanız anında aktif hale gelir</li>
                    <li>Dijital içerik teslim edilmiş sayılır</li>
                    <li>URL oluşturulduktan sonra geri alınamaz</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-2">2.2. AI Kredi Paketleri</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Krediler hesabınıza anında tanımlanır</li>
                    <li>Tek kullanımlık dijital kod niteliğindedir</li>
                    <li>Kullanıldığında geri alınamaz</li>
                    <li>Transfer edilemez ve iade edilemez</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. İptal Durumları
              </h2>
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  <strong>Ödeme Öncesi İptal:</strong> Ödeme işlemi tamamlanmadan önce siparişinizi iptal edebilirsiniz.
                  Ödeme sayfasını kapatmanız yeterlidir.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Ödeme Sonrası İptal:</strong> Ödeme tamamlandıktan ve ürün teslim edildikten sonra
                  iptal veya iade <strong>mümkün değildir</strong>.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                4. İstisnai Durumlar
              </h2>
              <p className="text-gray-700 mb-4">
                Aşağıdaki durumlarda iade veya değişim talebiniz değerlendirilebilir:
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">4.1. Teknik Sorunlar</h3>
                  <p className="text-gray-700">
                    Satın aldığınız ürün teknik bir hata nedeniyle çalışmıyorsa veya erişilemiyorsa,
                    <Link href="/contact" className="text-purple-600 hover:underline ml-1">destek ekibimize</Link> başvurabilirsiniz.
                    Sorun tespit edilirse ücretsiz çözüm sunulur.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">4.2. Hatalı Ücretlendirme</h3>
                  <p className="text-gray-700">
                    Yanlış tutar tahsil edildiğini düşünüyorsanız, 7 gün içinde destek ekibimize başvurmanız halinde
                    inceleme yapılır ve fark iadesi gerçekleştirilir.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">4.3. Çifte Ödeme</h3>
                  <p className="text-gray-700">
                    Aynı sipariş için yanlışlıkla iki kez ödeme yaptıysanız, fazla ödenen tutar
                    iade edilir. Banka dekontunu destek ekibimize iletmeniz yeterlidir.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. İade Prosedürü (İstisnai Durumlar İçin)
              </h2>
              <p className="text-gray-700 mb-4">
                Yukarıdaki istisnai durumlardan biri geçerliyse aşağıdaki adımları izleyin:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>
                  <Link href="/contact" className="text-purple-600 hover:underline">İletişim formunu</Link> doldurun
                  veya <a href="mailto:birmesajmutluluk@gmail.com" className="text-purple-600 hover:underline">birmesajmutluluk@gmail.com</a> adresine e-posta gönderin
                </li>
                <li>Sipariş numaranızı ve sorun detaylarını belirtin</li>
                <li>Varsa ekran görüntüleri veya kanıt belgelerini ekleyin</li>
                <li>Destek ekibimiz 2-3 iş günü içinde talebinizi değerlendirir</li>
                <li>Onaylanan iadeler 5-7 iş günü içinde kredi kartınıza yapılır</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. İade Süreleri
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>İade Talep Süresi:</strong> Satın alma tarihinden itibaren 7 gün içinde</li>
                <li><strong>İnceleme Süresi:</strong> Talep alındıktan sonra 2-3 iş günü</li>
                <li><strong>İade İşlem Süresi:</strong> Onay sonrası 5-7 iş günü</li>
                <li><strong>Banka İşlem Süresi:</strong> İadeyi aldıktan sonra bankanız 2-4 iş günü içinde hesabınıza yansıtır</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Tüketici Hakları
              </h2>
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Haklarınızla ilgili şikayetlerinizi aşağıdaki kurumlara iletebilirsiniz:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Tüketici Hakem Heyetleri:</strong> <a href="https://tuketici.ticaret.gov.tr" target="_blank" rel="noopener" className="text-purple-600 hover:underline">tuketici.ticaret.gov.tr</a></li>
                  <li><strong>Tüketici Mahkemeleri:</strong> Bulunduğunuz ilin tüketici mahkemesi</li>
                  <li><strong>Gümrük ve Ticaret Bakanlığı Tüketici Bilgi Hattı:</strong> 1530</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. İletişim
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  İptal ve iade ile ilgili tüm sorularınız için:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>E-posta:</strong> <a href="mailto:birmesajmutluluk@gmail.com" className="text-purple-600 hover:underline">birmesajmutluluk@gmail.com</a></li>
                  <li><strong>İletişim Formu:</strong> <Link href="/contact" className="text-purple-600 hover:underline">İletişim Sayfası</Link></li>
                  <li><strong>Çalışma Saatleri:</strong> Hafta içi 09:00 - 18:00</li>
                </ul>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                <strong>Önemli Not:</strong> Ürün satın almadan önce lütfen bu koşulları dikkatlice okuyunuz.
                Satın alma işlemini tamamlayarak bu koşulları kabul etmiş sayılırsınız.
              </p>
              <p className="text-sm text-gray-500">
                Bu iptal ve iade koşulları birmesajmutluluk.com için geçerlidir ve önceden bildirim
                yapılmaksızın güncellenebilir. Güncellemeler bu sayfada yayınlanacaktır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
