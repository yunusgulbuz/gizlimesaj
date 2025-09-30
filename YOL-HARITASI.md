# Heartnote Yol Haritası ve Görev Listesi

> Kaynak: `yapilacaklar.txt` ve ilgili ekran/bileşen analizi.

Bu doküman, gizlimesaj/Heartnote projesinde yapılması gereken işleri modern, kullanıcı dostu bir formatta toplar. Her madde için önerilen çözüm, ilgili dosyalar ve net kabul kriterleri belirtilmiştir.

## Önceliklendirme
- P0 – Kritik: ~~14~~, ~~15~~, ~~16~~, ~~18~~, ~~21~~, ~~29~~ ✅ **TAMAMLANDI**
- P1 – Yüksek: ~~1~~, ~~2~~, ~~4~~, ~~9~~, ~~13~~, ~~22~~, ~~26~~, ~~27~~, ~~28~~, ~~12~~, ~~17~~, ~~19~~, ~~25~~ ✅ **TAMAMLANDI** | 8, 30
- P2 – Orta: 3, 5, 6, 7, 10, 11, 20, 23, 24

## Detaylı Görevler

### ✅ 1) Anasayfaya en çok tercih edilen 3 şablonun eklenmesi **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: `app/page.tsx` içinde `getFeaturedTemplates` fonksiyonu ile en çok satın alınan 3 şablon (veya fallback olarak en yeni 3) dinamik olarak çekiliyor. Modern, sade kartlar eklendi. TemplateCardPreview ile canlı önizleme gösteriliyor.
- ✅ **Değişiklik Yapılan Dosyalar**: `app/page.tsx`
- ✅ **Kabul Kriterleri**: 3 kart görünür, kartın tamamı tıklanabilir, detay sayfasına gider, modern ve profesyonel görünüm sağlandı.

### ✅ 2) "Hesabım var" buton text renginin düzeltilmesi (anasayfa) **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: `HeaderAuthButton` bileşeninde buton variant'ı `outline`'dan `default`'a değiştirildi. Daha yüksek kontrast sağlandı.
- ✅ **Değişiklik Yapılan Dosyalar**: `components/auth/header-auth-button.tsx`
- ✅ **Kabul Kriterleri**: Giriş butonu daha görünür, WCAG AA uyumlu kontrast sağlandı.

### 3) Anasayfadaki yorumların daha gerçekçi hale getirilmesi
- Önerilen Çözüm: Supabase’den gerçek yorumları çek veya örnek veri metinlerini daha doğal hale getir. Varsa `template-comments` bileşeni kullanılabilir.
- İlgili Dosyalar: `components/template-comments.tsx`, `app/page.tsx`
- Kabul Kriterleri: En az 3 gerçekçi yorum, isim/rol alanları doldurulmuş.

### ✅ 4) "Hikayeni yazmaya başla" → "Giriş yap" (anasayfa) **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: Anasayfadaki CTA butonu metni "Hikayeni Yazmaya Başla"dan "Giriş Yap"a değiştirildi ve `/login` sayfasına yönlendiriliyor.
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

### ✅ 9) Templates'te kartın herhangi yerine tıklanınca detay açılması **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: Template kartlarının tamamı `Link` ile sarmalandı. Artık kartın her yerine tıklanarak detay sayfasına gidilebiliyor.
- ✅ **Değişiklik Yapılan Dosyalar**: `app/templates/page.tsx`
- ✅ **Kabul Kriterleri**: Kartın her bölgesi tıklanabilir; detay sayfasına gidilir.

### 10) Şablon talep formunda telefon numarası
- Önerilen Çözüm: Formlara `phone` alanı ekle ve backend’de doğrula.
- İlgili Dosyalar: `templates/*/form.tsx`, `app/api/payments/create-payment/route.ts`
- Kabul Kriterleri: Zorunlu alan, temel format doğrulama, backend’de kaydedilir.

### 11) İletişim sayfası
- Önerilen Çözüm: `/contact` rotası; form + sosyal linkler.
- İlgili Dosyalar: `app/contact/page.tsx` (yeni)
- Kabul Kriterleri: Form gönderimi (dummy veya gerçek), doğrulama.

### ✅ 12) Preview sayfasındaki stil butonları mobil uyumlu **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: Preview sayfasında stil butonları yatay scroll ile responsive hale getirildi. Mobilde sadece emoji, masaüstünde emoji + label gösteriliyor.
- ✅ **Değişiklik Yapılan Dosyalar**: `templates/shared/preview-page.tsx`, `templates/shared/form-page.tsx`
- ✅ **Kabul Kriterleri**: 320–768px aralığında taşmadan kullanılır; mobil uyumlu tasarım sağlandı.

### ✅ 13) Detay sayfasında buton "Satın Al" ve başlığın yanına buton **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: Form butonu metni "Sepete Ekle"den "Satın Al"a değiştirildi. Başlık bölümüne scroll-to-form butonu eklendi (Client Component).
- ✅ **Değişiklik Yapılan Dosyalar**: `templates/shared/form-page.tsx`, `templates/shared/scroll-to-form-button.tsx` (yeni)
- ✅ **Kabul Kriterleri**: İki "Satın Al" butonu mevcut, biri başlık yanında biri formda.

### ✅ 14) "Satın Al" tıklandığında tekrar tıklanamamalı, loading **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: `templates/shared/form-page.tsx` dosyasında `isSubmitting` state'i eklendi. "Sepete Ekle" butonu tıklandığında disable olup "İşleniyor..." metni gösteriyor.
- ✅ **Değişiklik Yapılan Dosyalar**: `templates/shared/form-page.tsx`
- ✅ **Kabul Kriterleri**: İstek süresince buton disable + spinner; idempotent istek sağlandı.

### ✅ 15) Ödeme ekranından önceki loading ekranı modernize **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: `app/payment/[orderId]/payment-form.tsx` dosyasında modern loading ekranı oluşturuldu. Yeni animasyonlar, güvenlik mesajları ve çağdaş tasarım eklendi.
- ✅ **Değişiklik Yapılan Dosyalar**: `app/payment/[orderId]/payment-form.tsx`
- ✅ **Kabul Kriterleri**: 2–3 saniyelik akıcı animasyon; hata/başarı ayrımı sağlandı.

### ✅ 16) Ödeme başarılı ekranı güncellemesi **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: `app/payment/success/page.tsx` dosyasında Instagram paylaşım butonu eklendi. 3 sütunlu grid düzeni ile WhatsApp, Instagram ve Twitter paylaşım seçenekleri düzenlendi.
- ✅ **Değişiklik Yapılan Dosyalar**: `app/payment/success/page.tsx`
- ✅ **Kabul Kriterleri**: WhatsApp/Twitter/Instagram (yönerge) seçenekleri; link kopyalama geri bildirimi sağlandı.

### ✅ 17) Kişisel sayfadaki paylaş butonu ve "heartnote ile yapıldı" görünürlüğü **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: Paylaş butonu ve "HeartNote ile yapılmıştır" yazısı sabit siyah arkaplan (bg-gray-900/95) ve beyaz metin ile her zaman görünür hale getirildi.
- ✅ **Değişiklik Yapılan Dosyalar**: `app/m/[shortId]/page.tsx`, `components/share-button.tsx`
- ✅ **Kabul Kriterleri**: Koyu/açık arkaplanda net görünür; mobilde taşma yok; backdrop-blur ve shadow efektleri eklendi.

### ✅ 18) Paylaş butonuna Instagram eklenmesi **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: `components/share-button.tsx` dosyasında Instagram paylaşım seçeneği eklendi. `shareToInstagram` fonksiyonu ve Instagram ikonu entegre edildi.
- ✅ **Değişiklik Yapılan Dosyalar**: `components/share-button.tsx`
- ✅ **Kabul Kriterleri**: Instagram için link kopyalama + story/kare görsel export bilgi mesajı sağlandı.

### ✅ 19) Detay ekranında tüm şablonlara YouTube linki **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: Tüm şablonlarda `musicUrl` field'ı eklendi. `is-tebrigi` şablonu için `isTebrigiCommonFields` array'ine `musicUrl` eklendi. Form sayfasında YouTube player ile önizleme destekleniyor.
- ✅ **Değişiklik Yapılan Dosyalar**: `templates/shared/types.ts`, `templates/shared/form-page.tsx`
- ✅ **Kabul Kriterleri**: YouTube ve direkt ses URL destekli; form sayfasında input + preview gösteriliyor.

### 20) Tüm şablonlar mobil uyumlu
- Önerilen Çözüm: Grid ve tipografi ölçekleri; 320–768px test; scroll/overflow problemleri gider.
- İlgili Dosyalar: `templates/*/components/*`, `templates/shared/template-renderer.tsx`
- Kabul Kriterleri: Lighthouse mobile ≥ 90; layout kırılması yok.

### ✅ 21) Gizlilik sözleşmesi ve kullanım şartları **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: `app/privacy/page.tsx` ve `app/terms/page.tsx` sayfaları oluşturuldu. Ana sayfa footer'ında linkler mevcut.
- ✅ **Değişiklik Yapılan Dosyalar**: `app/privacy/page.tsx`, `app/terms/page.tsx`
- ✅ **Kabul Kriterleri**: Linkler çalışır; içerik yayınlandı.

### ✅ 22) Templates ekranına sıralama **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: Templates sayfasına 4 sıralama seçeneği eklendi: "En Yeni", "Popüler", "Fiyat ↑", "Fiyat ↓". URL query parametresiyle çalışıyor.
- ✅ **Değişiklik Yapılan Dosyalar**: `app/templates/page.tsx`
- ✅ **Kabul Kriterleri**: Sıralama seçenekleri çalışıyor, URL'de query yansıyor, filtreleme ile birlikte kullanılabiliyor.

### 23) WP üzerinden şablon oluşturma (sonra)
- Önerilen Çözüm: WordPress JSON API entegrasyonu (gelecek sürüm).
- İlgili Dosyalar: `scripts/` (yeni), entegrasyon notları.
- Kabul Kriterleri: Yol haritasına eklendi; şimdilik kapsam dışı.

### 24) WP danışma hattı (sonra)
- Önerilen Çözüm: WhatsApp/Telefon CTA; WP’de canlı destek widget’ı.
- İlgili Dosyalar: `app/contact/page.tsx`
- Kabul Kriterleri: Yol haritasına eklendi; şimdilik kapsam dışı.

### ✅ 25) WhatsApp paylaşım küçük resim ve açıklama uygunluğu **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: Open Graph ve Twitter Card meta'ları hediye odaklı güncellendi. `generatePersonalPageMetadata` ve `generateTemplateMetadata` fonksiyonları image parametresi almaya başladı. Personal page için özel layout oluşturuldu.
- ✅ **Değişiklik Yapılan Dosyalar**: `lib/seo.ts`, `app/templates/[slug]/page.tsx`, `app/m/[shortId]/layout.tsx` (yeni), `app/layout.tsx`, `next.config.ts`
- ✅ **Kabul Kriterleri**: WhatsApp/Twitter/FB önizlemeleri uygun başlık/açıklama/görsel gösteriyor; emoji ve hediye odaklı metinler kullanılıyor.

### ✅ 26) Anasayfa ve templates ekranındaki `&apos;` düzeltmeleri **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: Tüm `&apos;` HTML entity'leri gerçek apostrof karakterine (`'`) çevrildi.
- ✅ **Değişiklik Yapılan Dosyalar**: `app/page.tsx`, `app/templates/page.tsx`
- ✅ **Kabul Kriterleri**: Metinlerde `&apos;` görünmüyor; doğru karakter kullanılıyor.

### ✅ 27) Kayıt ol sayfasındaki "anasayfa > kayıt ol" breadcrumb kaldırılması **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: Breadcrumb component ve ilgili importlar kaldırıldı. Sayfa daha sade görünüyor.
- ✅ **Değişiklik Yapılan Dosyalar**: `app/register/page.tsx`
- ✅ **Kabul Kriterleri**: Breadcrumb elementi görünmüyor.

### ✅ 28) Kayıt sayfasındaki GitHub kaldırılması **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: GitHub sosyal login butonu kaldırıldı. Sadece Google ve e-posta ile kayıt mevcut.
- ✅ **Değişiklik Yapılan Dosyalar**: `app/register/page.tsx`
- ✅ **Kabul Kriterleri**: GitHub butonu yok; kayıt akışı çalışıyor.

### ✅ 29) Ödeme başarısız ekranı çalışmıyor – düzeltilmesi **[TAMAMLANDI]**
- ✅ **Çözüm Uygulandı**: `app/api/payment/fail/route.ts` dosyasında route uyumsuzluğu giderildi. Tüm başarısız ödeme senaryoları `/payment/error` sayfasına yönlendiriliyor.
- ✅ **Değişiklik Yapılan Dosyalar**: `app/api/payment/fail/route.ts`
- ✅ **Kabul Kriterleri**: Başarısız işlemde anlamlı mesajlar; doğru sayfaya yönlendirme; kullanıcı ana sayfaya dönebilir sağlandı.

### 30) Uygulama genelinde loading state'lerinin modernizasyonu
- Önerilen Çözüm: Tüm sayfalarda (`loading.tsx`), formda, veri yüklenirken modern skeleton/spinner ekle. Gradient animasyonlar, pulse efektleri, anlamlı loading mesajları kullan.
- İlgili Dosyalar: `app/loading.tsx`, `app/templates/loading.tsx`, `components/ui/skeleton.tsx`, tüm form sayfaları
- Kabul Kriterleri: Tutarlı loading deneyimi; skeleton UI kullanımı; akıcı animasyonlar; en az 300ms loading için gösterim.

## ✅ Tamamlanan Görevler Özeti

### P0 - Kritik Görevler ✅ **TAMAMLANDI**
**Tüm kritik P0 görevleri başarıyla tamamlandı! 🎉**

1. **Satın Al Butonu Loading/Disable** - Form gönderimi sırasında buton devre dışı kalıyor
2. **Modern Ödeme Loading Ekranı** - Ödeme öncesi profesyonel loading deneyimi
3. **Instagram Paylaşım Entegrasyonu** - Hem ödeme başarı sayfasında hem paylaş butonunda
4. **Gizlilik ve Kullanım Şartları** - Yasal sayfalar oluşturuldu ve footer'a eklendi
5. **Ödeme Başarısız Ekranı Düzeltmesi** - Route uyumsuzluğu giderildi

### P1 - Yüksek Öncelikli Görevler ✅ **13/15 TAMAMLANDI**

**Tamamlanan:**
1. **Öne Çıkan Şablonlar** - Anasayfaya 8 popüler şablon eklendi, e-ticaret tarzı modern tasarım (kare görsel, indirim badge, büyük fiyat)
2. **Giriş Butonu Renk Düzeltmesi** - Header'daki "Giriş Yap" butonu daha görünür (default variant)
3. **CTA Metni Değişikliği** - "Hikayeni Yazmaya Başla" → "Giriş Yap"
4. **Template Kartları Tıklanabilir** - Kartın her yerine tıklanarak detaya gidilebiliyor
5. **Satın Al Butonları** - Form ve başlık bölümünde iki adet "Satın Al" butonu
6. **Sıralama Özelliği** - Templates sayfasına 4 sıralama seçeneği (Yeni, Popüler, Fiyat)
7. **&apos; Düzeltmeleri** - HTML entity'leri temizlendi
8. **Breadcrumb Kaldırma** - Kayıt sayfasından breadcrumb silindi
9. **GitHub Kaldırma** - Kayıt sayfasından GitHub login kaldırıldı
10. **Preview Stil Butonları Mobil** - Yatay scroll, emoji gösterimi
11. **Paylaş Butonu Görünürlüğü** - Siyah arkaplan/beyaz metin ile her zaman görünür
12. **YouTube Link Desteği** - Tüm şablonlara musicUrl field'ı eklendi
13. **WhatsApp Meta Tags** - Open Graph/Twitter Card meta'ları hediye odaklı güncellendi

**Anasayfa İyileştirmeleri:**
- Modern, sade tasarım (sticky header, gradient hero)
- E-ticaret benzeri ürün kartları (kare görsel, indirim badge'leri)
- Gerçek kategoriler (veritabanından çekiliyor, mobil uyumlu)
- 8 popüler şablon gösterimi (4 sütun grid)
- "Nasıl Çalışır" bölümü üstte (3 adım, kompakt)

**Kalan:**
- 8) Templates sayfası modernizasyonu (e-ticaret benzeri) - İsteğe bağlı
- 30) Uygulama genelinde loading state'lerinin modernizasyonu

### Değişiklik Yapılan Dosyalar (P0 + P1):
- `templates/shared/form-page.tsx`
- `templates/shared/scroll-to-form-button.tsx` (yeni)
- `templates/shared/preview-page.tsx`
- `templates/shared/types.ts`
- `app/payment/[orderId]/payment-form.tsx`
- `app/payment/success/page.tsx`
- `app/page.tsx` (tamamen yeniden tasarlandı)
- `app/templates/page.tsx`
- `app/register/page.tsx`
- `app/m/[shortId]/page.tsx`
- `app/m/[shortId]/layout.tsx` (yeni)
- `app/layout.tsx`
- `components/auth/header-auth-button.tsx`
- `components/share-button.tsx`
- `app/privacy/page.tsx` (yeni)
- `app/terms/page.tsx` (yeni)
- `app/api/payment/fail/route.ts`
- `lib/seo.ts`
- `next.config.ts`

---

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