-- Add AI-related columns to subscription_plans table
ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS ai_generation_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_refine_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS active_drafts_limit INTEGER DEFAULT 0;

-- Update existing plans with AI limits
UPDATE public.subscription_plans
SET
  ai_generation_limit = 10,
  ai_refine_limit = 20,
  active_drafts_limit = 3
WHERE id = 'monthly-10';

UPDATE public.subscription_plans
SET
  ai_generation_limit = 20,
  ai_refine_limit = 40,
  active_drafts_limit = 5
WHERE id = 'monthly-20';

UPDATE public.subscription_plans
SET
  ai_generation_limit = 30,
  ai_refine_limit = 60,
  active_drafts_limit = 10
WHERE id = 'monthly-30';

-- Insert free tier plan
INSERT INTO public.subscription_plans (id, name, subtitle, price, monthly_message_count, access_days, features, is_popular, ai_generation_limit, ai_refine_limit, active_drafts_limit)
VALUES
  ('free', 'Free', 'Ücretsiz Plan', 0.00, 1, 7,
   '["1 mesaj/ay", "Tüm şablon kütüphanesine erişim", "1 aktif AI taslak", "Ayda 5 AI oluşturma", "Düzenleme hakkı yok (abonelik gerekli)"]'::jsonb,
   false, 5, 0, 1)
ON CONFLICT (id) DO UPDATE SET
  monthly_message_count = 1,
  ai_generation_limit = 5,
  ai_refine_limit = 0,
  active_drafts_limit = 1;

-- Update features to include AI benefits
UPDATE public.subscription_plans
SET features = features || '["10 AI tasarım oluşturma/ay", "20 AI düzenleme hakkı/ay", "3 aktif AI taslak"]'::jsonb
WHERE id = 'monthly-10';

UPDATE public.subscription_plans
SET features = features || '["20 AI tasarım oluşturma/ay", "40 AI düzenleme hakkı/ay", "5 aktif AI taslak", "Premium AI stiller"]'::jsonb
WHERE id = 'monthly-20';

UPDATE public.subscription_plans
SET features = features || '["30 AI tasarım oluşturma/ay", "60 AI düzenleme hakkı/ay", "10 aktif AI taslak", "Tüm premium stiller", "AI ile otomatik optimizasyon"]'::jsonb
WHERE id = 'monthly-30';
