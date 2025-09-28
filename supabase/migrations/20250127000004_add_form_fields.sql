-- Add missing form fields to personal_pages and orders tables
-- These fields are needed to store complete form data from templates

-- Add text_fields (JSONB) to store dynamic form fields
ALTER TABLE public.personal_pages 
ADD COLUMN text_fields JSONB DEFAULT '{}' NOT NULL;

-- Add bg_audio_url to store background audio URL
ALTER TABLE public.personal_pages 
ADD COLUMN bg_audio_url TEXT;

-- Add design_style to store selected design style
ALTER TABLE public.personal_pages 
ADD COLUMN design_style TEXT DEFAULT 'modern' NOT NULL;

-- Add the same fields to orders table for consistency
ALTER TABLE public.orders 
ADD COLUMN text_fields JSONB DEFAULT '{}' NOT NULL;

ALTER TABLE public.orders 
ADD COLUMN bg_audio_url TEXT;

ALTER TABLE public.orders 
ADD COLUMN design_style TEXT DEFAULT 'modern' NOT NULL;

-- Add comments for clarity
COMMENT ON COLUMN public.personal_pages.text_fields IS 'Dynamic form fields as JSON (e.g., subtitle, footerMessage, quoteMessage)';
COMMENT ON COLUMN public.personal_pages.bg_audio_url IS 'Background audio URL for the personal page';
COMMENT ON COLUMN public.personal_pages.design_style IS 'Design style selected for the template (modern, classic, minimalist, eglenceli)';

COMMENT ON COLUMN public.orders.text_fields IS 'Dynamic form fields as JSON (e.g., subtitle, footerMessage, quoteMessage)';
COMMENT ON COLUMN public.orders.bg_audio_url IS 'Background audio URL for the personal page';
COMMENT ON COLUMN public.orders.design_style IS 'Design style selected for the template (modern, classic, minimalist, eglenceli)';