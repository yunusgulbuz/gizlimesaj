import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Kullanım Şartları | Heartnote',
  description: 'Heartnote kullanım şartları ve hizmet koşulları.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanım Şartları</h1>
          <p className="text-gray-600">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Hizmet Tanımı</h2>
            <p className="text-gray-700 leading-relaxed">
              Heartnote, kullanıcıların kişiselleştirilmiş dijital mesajlar oluşturmasına ve 
              paylaşmasına olanak sağlayan bir platformdur. Bu kullanım şartları, platformumuzun 
              kullanımına ilişkin kuralları ve koşulları belirlemektedir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Kabul ve Onay</h2>
            <p className="text-gray-700 leading-relaxed">
              Heartnote hizmetlerini kullanarak, bu kullanım şartlarını okuduğunuzu, anladığınızı 
              ve kabul ettiğinizi beyan edersiniz. Bu şartları kabul etmiyorsanız, lütfen 
              hizmetlerimizi kullanmayınız.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Kullanıcı Hesapları</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">3.1 Hesap Oluşturma</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Hesap oluştururken doğru ve güncel bilgiler vermelisiniz</li>
                  <li>Hesap güvenliğinizden siz sorumlusunuz</li>
                  <li>Şifrenizi güvenli tutmalı ve kimseyle paylaşmamalısınız</li>
                  <li>Hesabınızda gerçekleşen tüm aktivitelerden sorumlusunuz</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">3.2 Hesap Askıya Alma</h3>
                <p className="text-gray-700">
                  Bu şartları ihlal etmeniz durumunda hesabınızı askıya alabilir veya 
                  kapatabilir, hizmetlere erişiminizi kısıtlayabiliriz.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Kabul Edilebilir Kullanım</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Hizmetlerimizi kullanırken aşağıdaki kurallara uymalısınız:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">4.1 İzin Verilen Kullanım</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Kişisel, ticari olmayan amaçlarla kullanım</li>
                  <li>Yasal ve etik kurallara uygun içerik oluşturma</li>
                  <li>Diğer kullanıcıların haklarına saygı gösterme</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">4.2 Yasaklanan Kullanım</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Yasadışı, zararlı, tehditkar, taciz edici içerik oluşturma</li>
                  <li>Telif hakkı ihlali yapan içerik paylaşma</li>
                  <li>Spam, dolandırıcılık veya yanıltıcı içerik</li>
                  <li>Sistemi hackleme, virüs yayma veya güvenlik açığı arama</li>
                  <li>Diğer kullanıcıların kişisel bilgilerini toplama</li>
                  <li>Platformu ticari amaçlarla kötüye kullanma</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. İçerik ve Fikri Mülkiyet</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">5.1 Kullanıcı İçeriği</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Oluşturduğunuz içeriğin telif haklarına sahipsiniz</li>
                  <li>İçeriğinizin yasal ve uygun olmasından sorumlusunuz</li>
                  <li>Platformda paylaştığınız içeriği kullanmamız için bize lisans verirsiniz</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">5.2 Platform İçeriği</h3>
                <p className="text-gray-700">
                  Heartnote platformunun tasarımı, şablonları, logosu ve diğer içerikleri 
                  bizim fikri mülkiyetimizdir ve izinsiz kullanılamaz.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Ödeme ve Faturalandırma</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">6.1 Ücretler</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Ücretler web sitesinde belirtildiği gibidir</li>
                  <li>Tüm ödemeler peşin olarak alınır</li>
                  <li>Fiyatları önceden haber vermeksizin değiştirme hakkımız saklıdır</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">6.2 İade Politikası</h3>
                <p className="text-gray-700">
                  Dijital ürünlerin özelliği gereği, hizmet teslim edildikten sonra 
                  iade kabul edilmez. Teknik sorunlar durumunda müşteri hizmetleri 
                  ile iletişime geçebilirsiniz.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Hizmet Kullanılabilirliği</h2>
            <p className="text-gray-700 leading-relaxed">
              Hizmetlerimizi kesintisiz sunmaya çalışsak da, teknik bakım, güncelleme 
              veya beklenmeyen durumlar nedeniyle geçici kesintiler yaşanabilir. 
              Bu durumlardan dolayı sorumluluk kabul etmeyiz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Sorumluluk Sınırlaması</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Heartnote olarak aşağıdaki konularda sorumluluk kabul etmeyiz:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Kullanıcı içeriğinin doğruluğu veya uygunluğu</li>
              <li>Hizmet kesintilerinden kaynaklanan zararlar</li>
              <li>Üçüncü taraf hizmetlerinden kaynaklanan sorunlar</li>
              <li>Veri kaybı veya güvenlik ihlalleri (kendi kusurumuz olmadığı sürece)</li>
              <li>Dolaylı, özel veya sonuçsal zararlar</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Fesih</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">9.1 Kullanıcı Tarafından Fesih</h3>
                <p className="text-gray-700">
                  Hesabınızı istediğiniz zaman kapatabilirsiniz. Hesap kapatıldıktan sonra 
                  verileriniz gizlilik politikamıza uygun olarak işlenir.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">9.2 Platform Tarafından Fesih</h3>
                <p className="text-gray-700">
                  Bu şartları ihlal etmeniz durumunda hesabınızı önceden haber vermeksizin 
                  kapatabilir ve hizmetlere erişiminizi engelleyebiliriz.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Uygulanacak Hukuk</h2>
            <p className="text-gray-700 leading-relaxed">
              Bu kullanım şartları Türkiye Cumhuriyeti kanunlarına tabidir. 
              Herhangi bir uyuşmazlık durumunda Türkiye mahkemeleri yetkilidir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Değişiklikler</h2>
            <p className="text-gray-700 leading-relaxed">
              Bu kullanım şartlarını zaman zaman güncelleyebiliriz. Önemli değişiklikler 
              durumunda size bildirim göndereceğiz. Güncellenmiş şartlar yayınlandığı 
              tarihte yürürlüğe girer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. İletişim</h2>
            <p className="text-gray-700 leading-relaxed">
              Kullanım şartları hakkında sorularınız için bizimle iletişime geçebilirsiniz:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>E-posta:</strong> support@heartnote.com<br />
                <strong>Adres:</strong> [Şirket Adresi]<br />
                <strong>Telefon:</strong> [Telefon Numarası]
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}