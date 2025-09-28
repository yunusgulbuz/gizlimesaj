-- Bir kullanıcının aynı şablona birden fazla yorum yapmasını engelle
-- Unique constraint ekle: template_id + user_id kombinasyonu benzersiz olmalı

ALTER TABLE public.template_comments 
ADD CONSTRAINT unique_user_template_comment 
UNIQUE (template_id, user_id);

-- İndeks ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_template_comments_user_template 
ON public.template_comments(template_id, user_id);