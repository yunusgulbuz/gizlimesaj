-- Şablonlar
create table if not exists public.templates (
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
create table if not exists public.durations (
  id serial primary key,
  label text not null,           -- "2 gün" gibi
  days int not null check (days between 1 and 30),
  price_try numeric(10,2) not null check (price_try >= 0),
  is_active boolean default true
);

-- Siparişler
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  status text check (status in ('pending','paid','failed','canceled')) default 'pending',
  payment_provider text check (payment_provider in ('iyzico','stripe')) not null,
  payment_ref text,              -- provider dönüş referansı
  total_try numeric(10,2) not null,
  created_at timestamptz default now()
);

-- Sepet kalemleri
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  template_id uuid references public.templates(id),
  duration_id int references public.durations(id),
  recipient_name text not null,
  message text not null,
  quantity int not null default 1 check (quantity=1),
  created_at timestamptz default now()
);

-- Üretilen kişisel sayfa
create table if not exists public.personal_pages (
  id uuid primary key default gen_random_uuid(),
  short_id text unique not null,       -- nanoid
  template_id uuid references public.templates(id),
  order_item_id uuid references public.order_items(id) on delete cascade,
  recipient_name text not null,
  message text not null,
  start_at timestamptz not null default now(),
  expire_at timestamptz not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Görüntülenme logu
create table if not exists public.page_views (
  id bigserial primary key,
  personal_page_id uuid references public.personal_pages(id) on delete cascade,
  viewed_at timestamptz default now(),
  ip inet,
  ua text
);

-- Adminler
create table if not exists public.admins (
  user_id uuid primary key,
  role text check (role in ('admin')) default 'admin'
);

-- RLS Policies
alter table public.templates enable row level security;
alter table public.durations enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.personal_pages enable row level security;
alter table public.page_views enable row level security;
alter table public.admins enable row level security;

-- Public read policies
create policy "templates_read" on public.templates for select using (is_active = true);
create policy "durations_read" on public.durations for select using (is_active = true);
create policy "personal_pages_public_read" on public.personal_pages for select using (true);
create policy "page_views_insert" on public.page_views for insert with check (true);

-- Seed data
INSERT INTO public.durations (label, days, price_try, is_active) VALUES
('2 Gün', 2, 49.90, true),
('3 Gün', 3, 69.90, true),
('4 Gün', 4, 84.90, true),
('5 Gün', 5, 99.90, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.templates (slug, title, audience, preview_url, bg_audio_url, is_active) VALUES
('seni-seviyorum-teen', 'Seni Seviyorum', 'teen', '/templates/teen-love.jpg', null, true),
('seni-seviyorum-premium', 'Seni Seviyorum Premium', 'adult', null, '/templates/romantic-music.mp3', true),
('affet-beni-classic', 'Affet Beni', 'classic', '/templates/classic-forgive.jpg', null, true),
('affet-beni-signature', 'Affet Beni Signature', 'elegant', null, null, true),
('evlilik-teklifi-elegant', 'Benimle Evlenir misin?', 'elegant', '/templates/elegant-proposal.jpg', '/templates/romantic-music.mp3', true),
('dogum-gunu-fun', 'Doğum Günün Kutlu Olsun', 'fun', '/templates/fun-birthday.jpg', '/templates/birthday-music.mp3', true),
('tesekkur-adult', 'Teşekkür Ederim', 'adult', '/templates/adult-thanks.jpg', null, true),
('ozur-dilerim-classic', 'Özür Dilerim', 'classic', '/templates/classic-sorry.jpg', null, true),
('mutlu-yillar-fun', 'Mutlu Yıllar', 'fun', '/templates/fun-newyear.jpg', '/templates/celebration-music.mp3', true),
('romantik-mesaj-elegant', 'Romantik Mesaj', 'elegant', '/templates/elegant-romantic.jpg', '/templates/romantic-music.mp3', true)
ON CONFLICT (slug) DO NOTHING;

-- auth.users tablosu için RLS politikaları
-- Kullanıcılar sadece kendi bilgilerini görebilir
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON auth.users
    FOR SELECT USING (auth.uid() = id);

-- Authenticated kullanıcılara auth.users tablosuna select yetkisi ver
GRANT SELECT ON auth.users TO authenticated;
