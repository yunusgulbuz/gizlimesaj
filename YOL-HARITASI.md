# Heartnote Yol Haritası ve Görev Listesi

> Kaynak: `yapilacaklar.txt` ve ilgili ekran/bileşen analizi.

Bu doküman, gizlimesaj/Heartnote projesinde yapılması gereken işleri modern, kullanıcı dostu bir formatta toplar. Her madde için önerilen çözüm, ilgili dosyalar ve net kabul kriterleri belirtilmiştir.

## Önceliklendirme
- P0 – Kritik: 14, 15, 16, 18, 21, 29
- P1 – Yüksek: 1, 2, 4, 8, 9, 12, 13, 17, 19, 22, 25, 26, 27, 28
- P2 – Orta: 3, 5, 6, 7, 10, 11, 20, 23, 24

## Detaylı Görevler

### 1) Anasayfaya en çok tercih edilen 3 şablonun eklenmesi
- Önerilen Çözüm: `app/page.tsx` içinde “Öne Çıkan Heartnote” bölümünü dinamik hale getirip en çok satın alınan 3 şablonun kartlarını göster. Kartlar tıklanınca ilgili template detayına gidip satın alma akışına girsin.
- İlgili Dosyalar: `app/page.tsx`, `app/templates/[slug]/page.tsx`, `app/api/admin/templates/route.ts`
- Kabul Kriterleri: 3 kart görünür, kartın herhangi bir yerine tıklama detay sayfasına gider, satın alma akışına ulaşılır.

### 2) “Hesabım var” buton text renginin düzeltilmesi (anasayfa)
- Önerilen Çözüm: Header’daki auth bileşeninde `variant` ve sınıfları güncelle. Gerekirse `HeaderAuthButton` içinde `Button` variant’ını `outline` yerine kontrastı yüksek bir tema ile değiştir.
- İlgili Dosyalar: `components/auth/header-auth-button.tsx`, `components/ui/button.tsx`, `app/page.tsx`
- Kabul Kriterleri: Işık ve koyu arkaplanlarda yeterli kontrast, WCAG AA.

### 3) Anasayfadaki yorumların daha gerçekçi hale getirilmesi
- Önerilen Çözüm: Supabase’den gerçek yorumları çek veya örnek veri metinlerini daha doğal hale getir. Varsa `template-comments` bileşeni kullanılabilir.
- İlgili Dosyalar: `components/template-comments.tsx`, `app/page.tsx`
- Kabul Kriterleri: En az 3 gerçekçi yorum, isim/rol alanları doldurulmuş.

### 4) “Hikayeni yazmaya başla” → “Giriş yap” (anasayfa)
- Önerilen Çözüm: CTA metnini `app/page.tsx` içinde güncelle ve `href`’i `/login` yap.
- İlgili Dosyalar: `app/page.tsx`, `components/auth/header-auth-button.tsx`
- Kabul Kriterleri: Buton metni “Giriş Yap”, tıklandığında login sayfası.

### 5) Pricing sayfası ve planlar
- Önerilen Çözüm: `/pricing` rotasını oluştur. Planlar: “Aylık 10 hediye”, “Aylık 20 hediye”, “Aylık 30 hediye”, “Kurumsal – iletişime geçin”.
- İlgili Dosyalar: `app/pricing/page.tsx` (yeni), `app/api/admin/templates/route.ts`
- Kabul Kriterleri: 4 plan kartı, seçilince ödeme/plan akışı.

### 6) Hakkımızda sayfası
- Önerilen Çözüm: `/about` rotasını oluştur, marka hikayesi ve güven bölümünü ekle.
- İlgili Dosyalar: `app/about/page.tsx` (yeni)
- Kabul Kriterleri: Metin ve görsel içerikli sayfa, header’dan erişilebilir.

### 7) Anasayfanın daha anlaşılır hale getirilmesi
- Önerilen Çözüm: Bölüm başlıklarını sadeleştir, “nasıl çalışır” adımları daha net; CTA’ları birincil/ikincil olarak ayır.
- İlgili Dosyalar: `app/page.tsx`
- Kabul Kriterleri: İlk bakışta akış anlaşılır, tek bir birincil CTA.

### 8) Templates sayfasının sade ve e-ticaret benzeri olması
- Önerilen Çözüm: Liste kartlarını sadeleştir, kategori/filtre alanları ekle; grid düzeni ve hover etkileri modernize.
- İlgili Dosyalar: `app/templates/page.tsx`, `components/ui/card.tsx`
- Kabul Kriterleri: 2–4 sütun grid, filtre/sıralama barı, kartın tamamı tıklanabilir.

### 9) Templates’te kartın herhangi yerine tıklanınca detay açılması
- Önerilen Çözüm: Kartın wrapper’ını `Link` ile sarmala; “Şablonu seç” butonuna bağlı kalma.
- İlgili Dosyalar: `app/templates/page.tsx`
- Kabul Kriterleri: Kartın her bölgesi tıklanabilir; detay sayfasına gidilir.

### 10) Şablon talep formunda telefon numarası
- Önerilen Çözüm: Formlara `phone` alanı ekle ve backend’de doğrula.
- İlgili Dosyalar: `templates/*/form.tsx`, `app/api/payments/create-payment/route.ts`
- Kabul Kriterleri: Zorunlu alan, temel format doğrulama, backend’de kaydedilir.

### 11) İletişim sayfası
- Önerilen Çözüm: `/contact` rotası; form + sosyal linkler.
- İlgili Dosyalar: `app/contact/page.tsx` (yeni)
- Kabul Kriterleri: Form gönderimi (dummy veya gerçek), doğrulama.

### 12) Preview sayfasındaki stil butonları mobil uyumlu
- Önerilen Çözüm: Stil anahtarlarını yatay scroll veya `segmented control` yapısıyla responsive hale getir.
- İlgili Dosyalar: `templates/shared/preview-page.tsx`, `components/ResizableLayout.tsx`, `components/PreviewPane.tsx`
- Kabul Kriterleri: 320–768px aralığında taşmadan kullanılır; erişilebilirlik (tab/enter).

### 13) Detay sayfasında buton “Satın Al” ve başlığın yanına buton
- Önerilen Çözüm: “Sepete ekle” metnini “Satın Al” yap; başlık yanına kısa yol butonu ekle.
- İlgili Dosyalar: `app/templates/[slug]/page.tsx`, `templates/*/form.tsx`
- Kabul Kriterleri: Metin güncel, üst bölümde ikinci “Satın Al” butonu.

### 14) “Satın Al” tıklandığında tekrar tıklanamamalı, loading
- Önerilen Çözüm: `disabled` ve `isLoading` durumları ekle; `Button` bileşeninin `disabled` durum stilini kullan.
- İlgili Dosyalar: `components/ui/button.tsx`, `templates/*/form.tsx`, `app/api/payments/create-payment/route.ts`
- Kabul Kriterleri: İstek süresince buton disable + spinner; idempotent istek.

### 15) Ödeme ekranından önceki loading ekranı modernize
- Önerilen Çözüm: Tam ekran overlay, marka renkleriyle `Loader2` animasyon; durum mesajları.
- İlgili Dosyalar: `components/ui/paynkolay-payment-form.tsx`, `templates/*/form.tsx`
- Kabul Kriterleri: 2–3 saniyelik akıcı animasyon; hata/başarı ayrımı.

### 16) Ödeme başarılı ekranı güncellemesi
- Önerilen Çözüm: Paylaşım seçeneklerini genişlet (Instagram yönergeli), modern kartlar ve net CTA.
- İlgili Dosyalar: `app/payment/success/page.tsx`, `components/ui/social-share.tsx`
- Kabul Kriterleri: WhatsApp/Twitter/Instagram (yönerge) seçenekleri; link kopyalama geri bildirimi.

### 17) Kişisel sayfadaki paylaş butonu ve “heartnote ile yapıldı” görünürlüğü
- Önerilen Çözüm: Paylaş butonunun kontrastını arkaplana göre ayarlayan mevcut mantık korunmalı; üst/alt sabit konumda metinler beyaz gölgeli.
- İlgili Dosyalar: `app/m/[shortId]/page.tsx`, `components/share-button.tsx`
- Kabul Kriterleri: Koyu/açık arkaplanda net görünür; mobilde taşma yok.

### 18) Paylaş butonuna Instagram eklenmesi
- Önerilen Çözüm: `SocialShare` Instagram yönergesini içeriyor; `ShareButton` menüsüne “Instagram” seçeneğini ekle veya `SocialShare` birleşik bileşenini kullan.
- İlgili Dosyalar: `components/ui/social-share.tsx`, `components/share-button.tsx`
- Kabul Kriterleri: Instagram için link kopyalama + story/kare görsel export bilgi mesajı.

### 19) Detay ekranında tüm şablonlara YouTube linki
- Önerilen Çözüm: Formlara `musicUrl` alanı ekle; `YouTubePlayer` ile ID çıkarıp oynat.
- İlgili Dosyalar: `templates/*/form.tsx`, `components/ui/youtube-player.tsx`
- Kabul Kriterleri: YouTube ve direkt ses URL destekli; mobil kontrol/erişilebilir.

### 20) Tüm şablonlar mobil uyumlu
- Önerilen Çözüm: Grid ve tipografi ölçekleri; 320–768px test; scroll/overflow problemleri gider.
- İlgili Dosyalar: `templates/*/components/*`, `templates/shared/template-renderer.tsx`
- Kabul Kriterleri: Lighthouse mobile ≥ 90; layout kırılması yok.

### 21) Gizlilik sözleşmesi ve kullanım şartları
- Önerilen Çözüm: `/legal/privacy` ve `/legal/terms` sayfaları oluştur; kayıt formundaki metinlere link ver.
- İlgili Dosyalar: `app/legal/privacy/page.tsx` (yeni), `app/legal/terms/page.tsx` (yeni), `app/register/register-form.tsx`
- Kabul Kriterleri: Linkler çalışır; içerik yayınlanır.

### 22) Templates ekranına sıralama
- Önerilen Çözüm: “En Yeni”, “En Popüler”, “Fiyat” sıralama seçenekleri; API’de `order` parametresi.
- İlgili Dosyalar: `app/templates/page.tsx`, `app/api/admin/templates/route.ts`
- Kabul Kriterleri: Sıralama değiştiğinde liste güncellenir; URL query yansır.

### 23) WP üzerinden şablon oluşturma (sonra)
- Önerilen Çözüm: WordPress JSON API entegrasyonu (gelecek sürüm).
- İlgili Dosyalar: `scripts/` (yeni), entegrasyon notları.
- Kabul Kriterleri: Yol haritasına eklendi; şimdilik kapsam dışı.

### 24) WP danışma hattı (sonra)
- Önerilen Çözüm: WhatsApp/Telefon CTA; WP’de canlı destek widget’ı.
- İlgili Dosyalar: `app/contact/page.tsx`
- Kabul Kriterleri: Yol haritasına eklendi; şimdilik kapsam dışı.

### 25) WP paylaşım küçük resim ve açıklama uygunluğu
- Önerilen Çözüm: Open Graph/Twitter meta’ları hediye odaklı güncelle; `seo.ts` ile şablon bazlı resim.
- İlgili Dosyalar: `lib/seo.ts`, `app/templates/[slug]/page.tsx`
- Kabul Kriterleri: WhatsApp/Twitter/FB önizlemeleri uygun başlık/açıklama/görsel gösterir.

### 26) Anasayfa ve templates ekranındaki `&apos;` düzeltmeleri
- Önerilen Çözüm: Metinlerde gerçek apostrof kullan; `&apos;` HTML entity’lerini düz metne çevir.
- İlgili Dosyalar: `app/page.tsx`, `app/templates/page.tsx`
- Kabul Kriterleri: Metinlerde `&apos;` görünmez; doğru karakter kullanılır.

### 27) Kayıt ol sayfasındaki “anasayfa > kayıt ol” breadcrumb kaldırılması
- Önerilen Çözüm: Breadcrumb varsa kaldır; header sade.
- İlgili Dosyalar: `app/register/page.tsx`
- Kabul Kriterleri: Breadcrumb elementi görünmez.

### 28) Kayıt sayfasındaki GitHub kaldırılması
- Önerilen Çözüm: Sosyal login seçeneklerinden GitHub’ı kaldır; sadece Google (var) veya e-posta kullan.
- İlgili Dosyalar: `components/auth/google-auth-button.tsx`, `app/register/page.tsx`
- Kabul Kriterleri: GitHub butonu yok; kayıt akışı çalışır.

### 29) Ödeme başarısız ekranı çalışmıyor – düzeltilmesi
- Önerilen Çözüm: Başarısız senaryoların yönlendirmesi `payment/error` mi `payment/fail` mi netleştir; API tarafında `reason=payment_failed` ile `/payment/error` kullanılıyor. Uyum için tek sayfada (error) konsolide edilebilir veya doğru route’a yönlendirme eklenir.
- İlgili Dosyalar: `app/payment/error/page.tsx`, `app/payment/fail/page.tsx`, `app/api/payment/success/route.ts`, `app/api/payments/*/success/route.ts`
- Kabul Kriterleri: Başarısız işlemde anlamlı mesajlar; doğru sayfaya yönlendirme; kullanıcı ana sayfaya dönebilir.

## Paylaşım Mimarisini Birleştirme
- Mevcut: `components/share-button.tsx` (dropdown), `components/ui/social-share.tsx` (kapsamlı kart).
- Öneri: Tek bir “Share” katmanı oluşturup Instagram gibi yönerge gerektiren akışları burada standartlaştırın. ShareButton’a Instagram seçeneği eklenmeli.

## SEO ve Sosyal Önizleme
- `lib/seo.ts` ile şablon/kişisel sayfa için `title/description/images` ayarlanıyor. Şablon bazlı özel OG görselleri tanımlanmalı (Romantik, Doğum Günü vb.).

## Test Planı (Özet)
- Akışlar: Şablon seçimi → form → ödeme → success/fail → paylaşım.
- Cihazlar: iOS Safari, Android Chrome, Desktop Chrome/Firefox.
- Kontroller: Buton disable/loading, responsive grid, paylaşım linkleri (WhatsApp/Twitter/Instagram yönerge), OG önizlemeleri.

## Notlar ve Riskler
- Instagram doğrudan link paylaşımı desteklemez; yönergeli akış (link kopyala + story görseli) kullanılmalı.
- Ödeme sağlayıcısı (Paynkolay) dönüş parametrelerine göre `/payment/error` ve `/payment/success` yönlendirmeleri teyit edilmeli.

---

Güncellemeler commit’lenmeden önce görsel kontroller ve temel E2E akış testleri önerilir.