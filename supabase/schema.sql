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

-- Admin policies for CRUD operations
create policy "templates_admin_crud" on public.templates
  for all using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "durations_admin_crud" on public.durations
  for all using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Function to get personal page by short_id (secure access)
create or replace function get_page_by_short_id(short_id_param text)
returns table (
  id uuid,
  short_id text,
  template_id uuid,
  recipient_name text,
  message text,
  start_at timestamptz,
  expire_at timestamptz,
  is_active boolean,
  template_title text,
  template_audience text,
  template_preview_url text,
  template_bg_audio_url text
)
language plpgsql
security definer
as $$
begin
  return query
  select 
    pp.id,
    pp.short_id,
    pp.template_id,
    pp.recipient_name,
    pp.message,
    pp.start_at,
    pp.expire_at,
    pp.is_active,
    t.title as template_title,
    t.audience as template_audience,
    t.preview_url as template_preview_url,
    t.bg_audio_url as template_bg_audio_url
  from public.personal_pages pp
  join public.templates t on t.id = pp.template_id
  where pp.short_id = short_id_param
    and pp.is_active = true;
end;
$$;