# gizlimesaj.com — Teknik Tasarım & Uygulama Talimatı (Next.js + Supabase)

> **Amaç**: Aşağıdaki doküman, bir yapay zekâ/kod asistanına verildiğinde, uçtan uca çalışan **gizlimesaj.com** uygulamasını (hediye niteliğinde kişiselleştirilmiş mesaj sayfaları; örn. “Seni Seviyorum”, “Affet Beni”, “Benimle Evlenir misin?”) **Next.js (App Router) + Supabase** üzerinde kurup çalıştıracak şekilde net ve uygulanabilir talimatlar içerir.

---

## 1) Ürün Özeti

* Kullanıcı; temalardan birini seçip **alıcı adı** ve **özel not** girer, **gösterim süresi** (2/3/4/5 gün vb.) satın alır.
* Satın alım sonrası, sistem **kısa bir bağlantı** üretir: `https://gizlimesaj.com/<kisaId>`
* Bu sayfa, seçilen şablonla alıcıya özel içerik gösterir ve **süre bitince otomatik kapanır**.
* Sepet/checkout akışı ve kartla ödeme (Türkiye odaklı **iyzico**; alternatif **Stripe** bayrakla açılıp kapatılabilir).

## 2) Hedefler

* **Performans**: SSR/edge önbellekleme, hafif animasyonlar, Lighthouse 90+.
* **Güvenlik**: RLS, güvenli webhooks, rate‑limit, input doğrulama.
* **Operasyon**: Admin paneli, şablon yönetimi, sipariş ve sayfa raporları.

## 3) Teknoloji Seçimleri

* **Web**: Next.js 15+ (App Router), React Server Components, Server Actions.
* **UI**: Tailwind CSS, shadcn/ui, Framer Motion (minik animasyonlar).
* **DB & Auth**: Supabase (Postgres + Auth + Storage + Edge Functions + pgsodium).
* **Ödeme**: Varsayılan **iyzico** (TR), `PAYMENT_PROVIDER=stripe|iyzico` ile değiştirilebilir.
* **E‑posta**: Resend (opsiyonel), **SMS**: Twilio/TR alternatifi (opsiyonel).
* **Kısa ID**: `nanoid`.
* **Analitik**: PostHog (opsiyonel), Basit page\_view tablosu zorunlu.
* **Rate Limit**: Upstash Redis (opsiyonel) veya hafif DB‑temelli sayaç.

## 4) Dizın Yapısı (özet)

```
app/
  (marketing)/
    page.tsx                 # Landing
    templates/page.tsx       # Şablon galerisi
    templates/[slug]/page.tsx# Şablon detayı + kişiselleştirme formu
  cart/page.tsx
  checkout/page.tsx
  success/page.tsx
  [id]/page.tsx              # Alıcıya özel sayfa görüntüleyici
  account/(pages)/orders/page.tsx
  admin/(protected)/
    templates/page.tsx
    orders/page.tsx
    pages/page.tsx           # Kişisel sayfalar listesi/filtreler

lib/
  supabase.ts
  payments/iyzico.ts
  payments/stripe.ts
  shortid.ts
  seo.ts
  rateLimit.ts

server-actions/
  cart.ts
  checkout.ts
  templates.ts
  admin.ts

components/
  ui/* (shadcn)
  TemplateCard.tsx
  TemplatePreview.tsx
  PersonalizeForm.tsx
  Countdown.tsx
```

## 5) Supabase Şeması (SQL)

> **Talimat**: Aşağıdaki SQL’i sırasıyla çalıştır. Ardından RLS politikalarını uygula.

```sql
-- Şablonlar
create table public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  audience text check (audience in ('teen','adult','classic','fun','elegant')) not null,
  preview_url text,              -- storage public url
  bg_audio_url text,             -- opsiyonel müzik
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Fiyat/Süre seçenekleri
create table public.durations (
  id serial primary key,
  label text not null,           -- "2 gün" gibi
  days int not null check (days between 1 and 30),
  price_try numeric(10,2) not null check (price_try >= 0),
  is_active boolean default true
);

-- Siparişler
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text check (status in ('pending','paid','failed','canceled')) default 'pending',
  payment_provider text check (payment_provider in ('iyzico','stripe')) not null,
  payment_ref text,              -- provider dönüş referansı
  total_try numeric(10,2) not null,
  created_at timestamptz default now()
);

-- Sepet kalemleri (checkout öncesi istersen ayrı tutma; burada doğrudan siparişe bağlıyoruz)
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  template_id uuid references public.templates(id),
  duration_id int references public.durations(id),
  recipient_name text not null,
  message text not null,
  quantity int not null default 1 check (quantity=1),
  created_at timestamptz default now()
);

-- Üretilen kişisel sayfa (alışveriş sonrası)
create table public.personal_pages (
  id uuid primary key default gen_random_uuid(),
  short_id text unique not null,       -- nanoid
  template_id uuid references public.templates(id),
  order_item_id uuid references public.order_items(id) on delete cascade,
  recipient_name text not null,
  message text not null,
  start_at timestamptz not null default now(),
  expire_at timestamptz not null,
  is_active boolean generated always as (now() < expire_at) stored,
  created_at timestamptz default now()
);

-- Görüntülenme logu (basit analitik)
create table public.page_views (
  id bigserial primary key,
  personal_page_id uuid references public.personal_pages(id) on delete cascade,
  viewed_at timestamptz default now(),
  ip inet,
  ua text
);

-- Adminler
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('admin')) default 'admin'
);
```

### RLS Politikaları

```sql
-- Varsayılan: RLS açık
alter table public.templates enable row level security;
alter table public.durations enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.personal_pages enable row level security;
alter table public.page_views enable row level security;
alter table public.admins enable row level security;

-- templates & durations: herkes görebilir (aktif olanları)
create policy "templates_read" on public.templates for select using (is_active = true);
create policy "durations_read" on public.durations for select using (is_active = true);

-- orders: sadece sahibi görebilir/oluşturabilir
create policy "orders_insert" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id or
  exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- order_items: sadece sipariş sahibi
create policy "order_items_crud_own" on public.order_items
  for all using (
    exists(select 1 from public.orders o where o.id = order_items.order_id and (o.user_id = auth.uid() or
      exists (select 1 from public.admins a where a.user_id = auth.uid())))
  ) with check (
    exists(select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  );

-- personal_pages: herkes select yapabilir ama yalnız "is_active" ve yalnız kısa ID ile erişim app katmanında yönetilecek
create policy "personal_pages_public_read" on public.personal_pages for select using (true);

-- page_views: insert açık (anon dahil)
create policy "page_views_insert" on public.page_views for insert with check (true);

-- admins: sadece adminler görebilir
create policy "admins_admin_only" on public.admins for select using (auth.uid() = user_id);
```

> Not: `personal_pages` herkese açık okunuyor çünkü görüntüleme anonim. **Ancak** API katmanında yalnız `short_id` üzerinden erişim ver; id ile enumerate edilmesin. Gerekirse `rpc:get_page_by_short_id(short_id)` oluştur.

## 6) İş Akışları

### 6.1 Şablon seçimi → kişiselleştirme → sepet → ödeme → sayfa üretimi

1. Kullanıcı **şablon** ve **süre** seçer, **alıcı adı** ve **mesaj** girer.
2. Server Action `createPendingOrder` toplam fiyatı hesaplar; `orders.status='pending'` kaydı açar ve `order_items` ekler.
3. `PAYMENT_PROVIDER`:

   * **iyzico**: Sunucu tarafında iyzico `checkoutFormInitialize` ile token oluştur. Dönüş URL’si `/api/payments/iyzico/callback`.
   * **Stripe**: Checkout Session oluştur, success/cancel URL’leri ayarla.
4. Ödeme başarı webhook’unda:

   * `orders.status='paid'` güncelle,
   * `nanoid()` ile `short_id` üret,
   * `expire_at = now() + duration.days` ile `personal_pages` kaydı oluştur.
5. Success sayfasında: kısa linki göster, **kopyala** butonu, **önizleme** butonu.

### 6.2 Süresi dolan sayfalar

* `personal_pages.is_active` stored column (now() < expire\_at)
* Supabase **Scheduled Function** (günlük)

  * Expire olmuş sayfalara ait içerik public görünümünde 410/“Süresi doldu” göster; veriyi silme.

### 6.3 Görüntüleme & Sayaç

* `app/[id]/page.tsx` load olurken `page_views` insert (ip, ua) — **edge function** ya da server action.
* Rate limit: `rateLimit.ts` ile IP başına dakikada X görüntüleme.

## 7) API / Routes

* `POST /api/payments/iyzico/callback` — webhook doğrulama + sipariş tamamlama
* `POST /api/payments/stripe/webhook`
* `GET /api/pages/[shortId]` — JSON (title, message, expire\_at, template assets)

## 8) Next.js Bileşenleri/Özellikleri

* **TemplateCard**: başlık, mini önizleme, hedef kitle etiketi (teen/adult/classic/fun/elegant).
* **PersonalizeForm**: alıcı adı (max 50), mesaj (max 500), süre seçimi (dropdown), anında önizleme.
* **Countdown**: expire’a kadar kalan süre.
* **TemplatePreview**: şablona göre stil/animasyon; basit tema motoru (aşağıdaki gibi).

### Örnek basit tema motoru (kontrat)

```ts
export type TemplateData = {
  bg: string; // css sınıfı veya image url
  font: string; // tailwind class
  accent?: string; // renk class
  animation?: 'fade'|'slide'|'typewriter';
}
```

* `templates/[slug]/page.tsx` tema `TemplateData` döndürür; `PersonalizeForm` ile birleşir.

## 9) SEO/Paylaşım

* Her kişisel sayfa için **OpenGraph** meta:

  * `title`: `${recipient_name} için özel mesaj`
  * `description`: `${days} gün boyunca erişilebilir.`
  * `og:image`: Template’e özel dinamik OG (Vercel OG Image veya Supabase Storage görseli).

## 10) Ödeme Entegrasyonu

### iyzico (varsayılan)

* Ortam değişkenleri: `IYZICO_API_KEY`, `IYZICO_SECRET`, `IYZICO_BASE_URL` (sandbox/prod)
* Sunucu tarafında `initializeCheckout(form)` → token → kullanıcıyı iyzico hosted formuna yönlendir.
* Callback içinde imza doğrula; `order` → `paid`; `personal_pages` oluştur.

### Stripe (alternatif)

* `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
* Checkout Session; webhook’ta `payment_intent.succeeded` üstünden tamamlama.

## 11) Güvenlik

* **RLS** politikaları etkin (yukarıda).
* **Webhook** uçları: provider imza doğrulama/secret başlığı.
* **Input validation**: Zod şemaları (ad/mesaj/süre sınırları).
* **Rate limit**: Checkout ve sayfa görüntüleme uçlarının korunması.
* **Headers**: `X-Frame-Options`, `Content-Security-Policy` minimal ayarlar.

## 12) Ortam Değişkenleri (.env)

```
NEXT_PUBLIC_SITE_URL=https://gizlimesaj.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PAYMENT_PROVIDER=iyzico
IYZICO_API_KEY=
IYZICO_SECRET=
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
POSTHOG_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## 13) Admin Paneli (minimum)

* Şablon CRUD (başlık, slug, audience, preview, aktif/pasif).
* Fiyat/Süre CRUD (label, days, price\_try, aktif/pasif).
* Sipariş listele/filtrele (status, tarih aralığı, toplam, kullanıcı).
* Kişisel sayfalar: arama, aktif/pasif, kalan süre, şablon türü.
* Admin yetkisi: `admins` tablosu (email ile seed).

## 14) Storage

* Şablon önizleme görselleri (`public/templates/preview/*`).
* Opsiyonel arka plan müziği (`public/templates/audio/*`).
* Public read policy: yalnızca bu klasörler public.

## 15) Zamanlama & Bakım

* Supabase **Scheduler**: her gece 02:00 → expire olmuş sayfaları raporla (silme yok).
* Opsiyonel e‑posta: "Sayfanız X saat içinde kapanacak" (Resend template).

## 16) Test Planı & Kabul Kriterleri

* [ ] Şablon listesi SSR’de geliyor, 200ms altı TTFB (local/prod yakın).
* [ ] Kişiselleştirme formu: doğrulama hataları düzgün gösteriliyor.
* [ ] Ödeme başarılı → `orders.paid`, `personal_pages` yaratıldı, `short_id` çalışıyor.
* [ ] `GET /<short_id>`: kalan süre sayacı doğru; süre dolunca 410 sayfası.
* [ ] Webhook imzası hatalıysa sipariş değişmiyor.
* [ ] Admin paneli yetkisiz erişimi engelliyor.
* [ ] RLS ihlali denemelerinde 401/403.

## 17) Geliştirici Talimatları (AI’ya direkt prompt)

"""
**Rolün**: Kıdemli Full‑Stack mühendissin. Next.js (App Router) + Supabase ile üretime alınabilir bir uygulama geliştiriyorsun. Aşağıdaki gereksinimlere birebir uy:

1. Projeyi kur:

* Tailwind + shadcn/ui + Framer Motion ekle, ESLint/Prettier ayarla.
* `lib/supabase.ts` ile server/client helper yaz.
* `nanoid` ile `short_id` üret utility’si yaz.

2. Supabase şemasını kur ve RLS politikalarını uygula (yukarıdaki SQL). Seed verisi oluştur:

* 5 şablon: `teen`, `adult`, `classic`, `fun`, `elegant` karışık.
* Süreler: 2gün=49,90₺; 3gün=69,90₺; 4gün=84,90₺; 5gün=99,90₺.

3. Sayfaları uygula:

* `/` landing (hero, nasıl çalışır, CTA "Şablonları Gör").
* `/templates` grid liste; filtre: audience.
* `/templates/[slug]` önizleme + form; submit → `cart` state (server action).
* `/cart` özet, checkout butonu.
* `/checkout` ödeme sağlayıcısına yönlendirme; success/cancel handling.
* `/success` kısa bağlantı göster.
* `/[shortId]` kişisel sayfa (SSR): OG meta, countdown, `page_views` kaydı.

4. Ödeme entegrasyonu:

* `PAYMENT_PROVIDER` env’ine göre iyzico/stripe modülü kullanılacak.
* Webhook route’larında doğrulama, `orders→paid`, sonra `personal_pages` oluştur.

5. Admin paneli (korumalı): şablon & süre CRUD, sipariş & sayfalar listesi.

6. Güvenlik/kalite:

* Tüm input’larda Zod; Helmet‑vari header setleri.
* Basit rate limit (`rateLimit.ts`).
* 404/410 özel sayfaları.

7. CI/CD:

* Vercel deploy config; `vercel.json` edge runtime uygun sayfalar.
* Supabase migrations scriptleri.

8. Dokümantasyon:

* `README.md` kurulum, env, komutlar; `PAYMENTS.md` entegrasyon notları.

Çıktı: Çalışır repo, tohum verilerle lokal olarak ödeme simülasyonu (iyzico sandbox/stripe test) ve demo akışı.
"""

## 18) Görsel Stil Rehberi (kısa)

* **Tipografi**: Headline `text-3xl/4xl`, gövde `text-base`, romantik temalarda `serif` alternatif.
* **Renkler**: Pembe/eflatun tonları + neutral arka plan; temaya göre değiştirilebilir.
* **Animasyon**: Abartmadan; fade/slide; kalp ikonlarında küçük puls.
* **Erişilebilirlik**: Kontrast AA+, buton odak halkaları.

## 19) Hukuk/İçerik

* Kullanım Şartları, KVKK/Aydınlatma, İade & İptal (dijital içerik) sayfaları.
* Kullanıcı içeriklerinin hakaret/şiddet içermemesi; raporla/şikayet maili.

## 20) Yol Haritası (MVP → +1)

* **MVP**: Şablonlar, kişiselleştirme, ödeme, kısa link, süre bitimi.
* **+1**: Şifre korumalı sayfa, QR kartı çıktısı, özel domain alt yol (ör. `/yunus‑aysegul`).

---

**Not**: Ücretlendirme/kur değerleri ve sağlayıcı ayarlarını üretim öncesi nihai kararla güncelle.
