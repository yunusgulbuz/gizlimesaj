-- AI Template Pricing Table
-- This table stores pricing for AI-generated templates based on durations
-- Unlike regular templates where each template has its own pricing,
-- AI templates share a single pricing structure by duration

CREATE TABLE IF NOT EXISTS public.ai_template_pricing (
    id SERIAL PRIMARY KEY,
    duration_id INTEGER NOT NULL REFERENCES public.durations(id) ON DELETE CASCADE,
    price_try DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(duration_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ai_template_pricing_duration_id ON public.ai_template_pricing(duration_id);
CREATE INDEX IF NOT EXISTS idx_ai_template_pricing_is_active ON public.ai_template_pricing(is_active);

-- Enable Row Level Security
ALTER TABLE public.ai_template_pricing ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read for active pricing)
CREATE POLICY "ai_template_pricing_select_policy" ON public.ai_template_pricing
    FOR SELECT
    USING (is_active = true);

-- Trigger for updated_at
CREATE TRIGGER update_ai_template_pricing_updated_at BEFORE UPDATE ON public.ai_template_pricing
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pricing (optional - can be managed via admin panel)
-- Example pricing structure:
INSERT INTO public.ai_template_pricing (duration_id, price_try, old_price)
SELECT
    d.id,
    CASE
        WHEN d.days = 1 THEN 19.99
        WHEN d.days = 3 THEN 39.99
        WHEN d.days = 7 THEN 49.99
        WHEN d.days = 14 THEN 79.99
        WHEN d.days = 30 THEN 99.99
        ELSE 29.99
    END as price_try,
    NULL as old_price
FROM public.durations d
WHERE d.is_active = true
ON CONFLICT (duration_id) DO NOTHING;

COMMENT ON TABLE public.ai_template_pricing IS 'Pricing structure for all AI-generated templates by duration';
COMMENT ON COLUMN public.ai_template_pricing.duration_id IS 'Reference to duration (1 day, 3 days, 7 days, etc.)';
COMMENT ON COLUMN public.ai_template_pricing.price_try IS 'Current price in Turkish Lira';
COMMENT ON COLUMN public.ai_template_pricing.old_price IS 'Original price for showing discounts';
