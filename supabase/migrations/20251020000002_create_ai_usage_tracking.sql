-- Create ai_usage_tracking table to track monthly AI usage
CREATE TABLE IF NOT EXISTS public.ai_usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    generations_used INTEGER DEFAULT 0,
    refines_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_user_id ON public.ai_usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_period ON public.ai_usage_tracking(period_start, period_end);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_usage_tracking_user_period ON public.ai_usage_tracking(user_id, period_start);

-- Enable Row Level Security
ALTER TABLE public.ai_usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own usage
CREATE POLICY "ai_usage_tracking_select_policy" ON public.ai_usage_tracking
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "ai_usage_tracking_insert_policy" ON public.ai_usage_tracking
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ai_usage_tracking_update_policy" ON public.ai_usage_tracking
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_ai_usage_tracking_updated_at
    BEFORE UPDATE ON public.ai_usage_tracking
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get or create current period usage
CREATE OR REPLACE FUNCTION public.get_or_create_current_usage(p_user_id UUID, p_period_start TIMESTAMP WITH TIME ZONE, p_period_end TIMESTAMP WITH TIME ZONE)
RETURNS UUID AS $$
DECLARE
    v_usage_id UUID;
BEGIN
    -- Try to get existing usage record for this period
    SELECT id INTO v_usage_id
    FROM public.ai_usage_tracking
    WHERE user_id = p_user_id
      AND period_start = p_period_start
      AND period_end = p_period_end;

    -- If not found, create a new one
    IF v_usage_id IS NULL THEN
        INSERT INTO public.ai_usage_tracking (user_id, period_start, period_end, generations_used, refines_used)
        VALUES (p_user_id, p_period_start, p_period_end, 0, 0)
        RETURNING id INTO v_usage_id;
    END IF;

    RETURN v_usage_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
