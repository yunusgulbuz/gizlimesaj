-- Puanlama ve Yorum Sistemi için Veritabanı Şeması
-- Bu kodu Supabase SQL Editor'e yapıştırın

-- 1. Şablon Puanlamaları Tablosu
CREATE TABLE IF NOT EXISTS public.template_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- Supabase auth.users tablosundan gelecek
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Bir kullanıcı bir şablona sadece bir kez puan verebilir
  UNIQUE(template_id, user_id)
);

-- 2. Şablon Yorumları Tablosu
CREATE TABLE IF NOT EXISTS public.template_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- Supabase auth.users tablosundan gelecek
  comment TEXT NOT NULL CHECK (LENGTH(comment) >= 10 AND LENGTH(comment) <= 1000),
  is_approved BOOLEAN DEFAULT TRUE, -- Moderasyon için
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Yorum Beğenileri Tablosu (Opsiyonel - yorumları beğenme sistemi)
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.template_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Bir kullanıcı bir yorumu sadece bir kez beğenebilir
  UNIQUE(comment_id, user_id)
);

-- 4. İndeksler (Performans için)
CREATE INDEX IF NOT EXISTS idx_template_ratings_template_id ON public.template_ratings(template_id);
CREATE INDEX IF NOT EXISTS idx_template_ratings_user_id ON public.template_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_template_comments_template_id ON public.template_comments(template_id);
CREATE INDEX IF NOT EXISTS idx_template_comments_user_id ON public.template_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_template_comments_approved ON public.template_comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);

-- 5. Updated_at trigger fonksiyonu (eğer yoksa)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Updated_at triggerları
CREATE TRIGGER update_template_ratings_updated_at 
    BEFORE UPDATE ON public.template_ratings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_comments_updated_at 
    BEFORE UPDATE ON public.template_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. RLS (Row Level Security) Politikaları
ALTER TABLE public.template_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Puanlamalar için RLS politikaları
-- Herkes onaylanmış puanlamaları okuyabilir
CREATE POLICY "template_ratings_read" ON public.template_ratings
    FOR SELECT USING (true);

-- Sadece giriş yapmış kullanıcılar puan verebilir
CREATE POLICY "template_ratings_insert" ON public.template_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar sadece kendi puanlamalarını güncelleyebilir
CREATE POLICY "template_ratings_update" ON public.template_ratings
    FOR UPDATE USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi puanlamalarını silebilir
CREATE POLICY "template_ratings_delete" ON public.template_ratings
    FOR DELETE USING (auth.uid() = user_id);

-- Yorumlar için RLS politikaları
-- Herkes onaylanmış yorumları okuyabilir
CREATE POLICY "template_comments_read" ON public.template_comments
    FOR SELECT USING (is_approved = true);

-- Sadece giriş yapmış kullanıcılar yorum yapabilir
CREATE POLICY "template_comments_insert" ON public.template_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar sadece kendi yorumlarını güncelleyebilir
CREATE POLICY "template_comments_update" ON public.template_comments
    FOR UPDATE USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi yorumlarını silebilir
CREATE POLICY "template_comments_delete" ON public.template_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Yorum beğenileri için RLS politikaları
-- Herkes beğenileri okuyabilir
CREATE POLICY "comment_likes_read" ON public.comment_likes
    FOR SELECT USING (true);

-- Sadece giriş yapmış kullanıcılar beğenebilir
CREATE POLICY "comment_likes_insert" ON public.comment_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar sadece kendi beğenilerini silebilir
CREATE POLICY "comment_likes_delete" ON public.comment_likes
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Şablon istatistikleri için view (Ortalama puan ve yorum sayısı)
CREATE OR REPLACE VIEW public.template_stats AS
SELECT 
    t.id,
    t.slug,
    t.title,
    COALESCE(AVG(tr.rating), 0) as average_rating,
    COUNT(DISTINCT tr.id) as total_ratings,
    COUNT(DISTINCT tc.id) as total_comments
FROM public.templates t
LEFT JOIN public.template_ratings tr ON t.id = tr.template_id
LEFT JOIN public.template_comments tc ON t.id = tc.template_id AND tc.is_approved = true
WHERE t.is_active = true
GROUP BY t.id, t.slug, t.title;

-- View için RLS politikası
ALTER VIEW public.template_stats SET (security_invoker = true);

-- 9. Kullanıcı profil bilgileri için view (auth.users tablosundan)
-- Bu view, yorumlarda kullanıcı adı göstermek için kullanılacak
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
    id,
    email,
    COALESCE(
        raw_user_meta_data->>'full_name',
        raw_user_meta_data->>'name',
        SPLIT_PART(email, '@', 1)
    ) as display_name,
    raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users;

-- User profiles view için RLS politikası
ALTER VIEW public.user_profiles SET (security_invoker = true);

-- 10. Yorum sayısı ile birlikte yorumları getiren view
CREATE OR REPLACE VIEW public.template_comments_with_user AS
SELECT 
    tc.*,
    up.display_name,
    up.avatar_url,
    COUNT(cl.id) as like_count,
    CASE WHEN auth.uid() IS NOT NULL THEN
        EXISTS(SELECT 1 FROM public.comment_likes WHERE comment_id = tc.id AND user_id = auth.uid())
    ELSE false END as user_has_liked
FROM public.template_comments tc
LEFT JOIN public.user_profiles up ON tc.user_id = up.id
LEFT JOIN public.comment_likes cl ON tc.id = cl.comment_id
WHERE tc.is_approved = true
GROUP BY tc.id, tc.template_id, tc.user_id, tc.comment, tc.is_approved, 
         tc.created_at, tc.updated_at, up.display_name, up.avatar_url;

-- View için RLS politikası
ALTER VIEW public.template_comments_with_user SET (security_invoker = true);

-- 11. Kullanıcının belirli bir şablona verdiği puanı kontrol eden fonksiyon
CREATE OR REPLACE FUNCTION get_user_rating_for_template(template_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN NULL;
    END IF;
    
    RETURN (
        SELECT rating 
        FROM public.template_ratings 
        WHERE template_id = template_uuid AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonksiyon için yetki verme
GRANT EXECUTE ON FUNCTION get_user_rating_for_template(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_rating_for_template(UUID) TO anon;

-- auth.users tablosu için RLS politikaları
-- Kullanıcılar sadece kendi bilgilerini görebilir
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON auth.users
    FOR SELECT USING (auth.uid() = id);

-- Authenticated kullanıcılara auth.users tablosuna select yetkisi ver
GRANT SELECT ON auth.users TO authenticated;