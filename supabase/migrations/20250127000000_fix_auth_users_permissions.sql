-- auth.users tablosu için RLS politikaları
-- Kullanıcılar sadece kendi bilgilerini görebilir
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON auth.users
    FOR SELECT USING (auth.uid() = id);

-- Authenticated kullanıcılara auth.users tablosuna select yetkisi ver
GRANT SELECT ON auth.users TO authenticated;