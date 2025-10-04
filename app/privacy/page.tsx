import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Gizlilik Sözleşmesi | birmesajmutluluk',
  description: 'birmesajmutluluk gizlilik sözleşmesi ve kişisel verilerin korunması politikası.',
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gizlilik Sözleşmesi</h1>
          <p className="text-gray-600">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Giriş</h2>
            <p className="text-gray-700 leading-relaxed">
              birmesajmutluluk olarak, kişisel verilerinizin güvenliği ve gizliliği bizim için son derece önemlidir. 
              Bu gizlilik sözleşmesi, hizmetlerimizi kullanırken kişisel verilerinizin nasıl toplandığını, 
              kullanıldığını, saklandığını ve korunduğunu açıklamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Toplanan Bilgiler</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">2.1 Kişisel Bilgiler</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Ad ve soyad bilgileri</li>
                  <li>E-posta adresi</li>
                  <li>Telefon numarası (isteğe bağlı)</li>
                  <li>Profil fotoğrafı (isteğe bağlı)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">2.2 Teknik Bilgiler</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>IP adresi</li>
                  <li>Tarayıcı bilgileri</li>
                  <li>Cihaz bilgileri</li>
                  <li>Kullanım istatistikleri</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Bilgilerin Kullanımı</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Topladığımız kişisel veriler aşağıdaki amaçlarla kullanılmaktadır:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Hizmetlerimizi sağlamak ve geliştirmek</li>
              <li>Kullanıcı hesaplarını yönetmek</li>
              <li>Ödemeler ve faturalandırma işlemlerini gerçekleştirmek</li>
              <li>Müşteri desteği sağlamak</li>
              <li>Güvenlik ve dolandırıcılık önleme</li>
              <li>Yasal yükümlülükleri yerine getirmek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Bilgi Paylaşımı</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Kişisel verilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmayız:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Açık rızanızın bulunması durumunda</li>
              <li>Yasal zorunluluklar gereği</li>
              <li>Hizmet sağlayıcılarımızla (ödeme işlemcileri, hosting sağlayıcıları)</li>
              <li>Güvenlik ve dolandırıcılık önleme amacıyla</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Veri Güvenliği</h2>
            <p className="text-gray-700 leading-relaxed">
              Kişisel verilerinizi korumak için endüstri standardı güvenlik önlemleri alıyoruz. 
              Bu önlemler arasında şifreleme, güvenli sunucular, erişim kontrolü ve düzenli 
              güvenlik denetimleri bulunmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Çerezler (Cookies)</h2>
            <p className="text-gray-700 leading-relaxed">
              Web sitemizde kullanıcı deneyimini iyileştirmek, site performansını analiz etmek 
              ve kişiselleştirilmiş içerik sunmak için çerezler kullanıyoruz. Tarayıcı 
              ayarlarınızdan çerezleri yönetebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Kullanıcı Hakları</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              KVKK kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
              <li>İşleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
              <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
              <li>Kişisel verilerin silinmesini veya yok edilmesini isteme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Veri Saklama Süresi</h2>
            <p className="text-gray-700 leading-relaxed">
              Kişisel verilerinizi, işleme amacının gerektirdiği süre boyunca ve yasal 
              yükümlülüklerimizi yerine getirmek için gerekli olan süre boyunca saklarız. 
              Hesabınızı sildiğinizde, kişisel verileriniz yasal saklama süreleri dışında silinir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Değişiklikler</h2>
            <p className="text-gray-700 leading-relaxed">
              Bu gizlilik sözleşmesini zaman zaman güncelleyebiliriz. Önemli değişiklikler 
              durumunda size e-posta yoluyla bildirim göndereceğiz. Güncellenmiş sözleşme 
              yayınlandığı tarihte yürürlüğe girer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. İletişim</h2>
            <p className="text-gray-700 leading-relaxed">
              Gizlilik sözleşmesi hakkında sorularınız veya kişisel verilerinizle ilgili 
              talepleriniz için bizimle iletişime geçebilirsiniz:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>E-posta:</strong> privacy@birmesajmutluluk.com<br />
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