-- Seed data for durations
INSERT INTO public.durations (label, days, price_try, is_active) VALUES
('2 Gün', 2, 49.90, true),
('3 Gün', 3, 69.90, true),
('4 Gün', 4, 84.90, true),
('5 Gün', 5, 99.90, true);

-- Seed data for templates
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
('romantik-mesaj-elegant', 'Romantik Mesaj', 'elegant', '/templates/elegant-romantic.jpg', '/templates/romantic-music.mp3', true);

-- Create a sample admin user (you'll need to replace this with actual user ID after creating user in Supabase Auth)
-- INSERT INTO public.admins (user_id, role) VALUES ('your-admin-user-id-here', 'admin');
