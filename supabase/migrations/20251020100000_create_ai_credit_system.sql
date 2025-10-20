-- AI Credit System Migration
-- This replaces the complex subscription-based AI limits with simple credit-based purchases

-- Create ai_credit_packages table (packages for sale)
CREATE TABLE IF NOT EXISTS public.ai_credit_packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subtitle TEXT,
    credits INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_ai_credits table (user credit balances)
CREATE TABLE IF NOT EXISTS public.user_ai_credits (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_credits INTEGER DEFAULT 0,
    used_credits INTEGER DEFAULT 0,
    remaining_credits INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT remaining_credits_check CHECK (remaining_credits >= 0)
);

-- Create user_credit_transactions table (purchase and usage history)
CREATE TABLE IF NOT EXISTS public.user_credit_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'bonus')),
    credits INTEGER NOT NULL,
    description TEXT,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    template_id UUID REFERENCES public.ai_generated_templates(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default credit packages
INSERT INTO public.ai_credit_packages (id, name, subtitle, credits, price, is_popular)
VALUES
    ('credits-10', 'Başlangıç', '10 AI Kullanım Hakkı', 10, 199.00, false),
    ('credits-30', 'Popüler', '30 AI Kullanım Hakkı', 30, 499.00, true),
    ('credits-100', 'Premium', '100 AI Kullanım Hakkı', 100, 999.00, false)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_ai_credits_user_id ON public.user_ai_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credit_transactions_user_id ON public.user_credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credit_transactions_type ON public.user_credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_user_credit_transactions_created_at ON public.user_credit_transactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.ai_credit_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ai_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_credit_packages (public read)
CREATE POLICY "ai_credit_packages_select_policy" ON public.ai_credit_packages
    FOR SELECT
    USING (is_active = true);

-- RLS Policies for user_ai_credits (users can only see their own)
CREATE POLICY "user_ai_credits_select_policy" ON public.user_ai_credits
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "user_ai_credits_insert_policy" ON public.user_ai_credits
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_ai_credits_update_policy" ON public.user_ai_credits
    FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for user_credit_transactions (users can only see their own)
CREATE POLICY "user_credit_transactions_select_policy" ON public.user_credit_transactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Trigger for updated_at on ai_credit_packages
CREATE TRIGGER update_ai_credit_packages_updated_at BEFORE UPDATE ON public.ai_credit_packages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on user_ai_credits
CREATE TRIGGER update_user_ai_credits_updated_at BEFORE UPDATE ON public.user_ai_credits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to initialize user credits (give 1 free credit to new users)
CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_ai_credits (user_id, total_credits, used_credits, remaining_credits)
    VALUES (NEW.id, 1, 0, 1)
    ON CONFLICT (user_id) DO NOTHING;

    -- Record the free credit transaction
    INSERT INTO public.user_credit_transactions (user_id, type, credits, description)
    VALUES (NEW.id, 'bonus', 1, 'Ücretsiz başlangıç kredisi')
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to give free credit when user signs up
CREATE TRIGGER on_auth_user_created_give_free_credit
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.initialize_user_credits();

-- Function to add credits to user (called after purchase)
CREATE OR REPLACE FUNCTION public.add_user_credits(
    p_user_id UUID,
    p_credits INTEGER,
    p_order_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Insert or update user_ai_credits
    INSERT INTO public.user_ai_credits (user_id, total_credits, used_credits, remaining_credits)
    VALUES (p_user_id, p_credits, 0, p_credits)
    ON CONFLICT (user_id) DO UPDATE SET
        total_credits = user_ai_credits.total_credits + p_credits,
        remaining_credits = user_ai_credits.remaining_credits + p_credits,
        updated_at = timezone('utc'::text, now());

    -- Record transaction
    INSERT INTO public.user_credit_transactions (user_id, type, credits, description, order_id)
    VALUES (p_user_id, 'purchase', p_credits, p_description, p_order_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to use credits (called when generating/refining AI template)
CREATE OR REPLACE FUNCTION public.use_user_credit(
    p_user_id UUID,
    p_template_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_remaining INTEGER;
BEGIN
    -- Check if user has credits
    SELECT remaining_credits INTO v_remaining
    FROM public.user_ai_credits
    WHERE user_id = p_user_id;

    IF v_remaining IS NULL OR v_remaining < 1 THEN
        RETURN FALSE;
    END IF;

    -- Deduct credit
    UPDATE public.user_ai_credits
    SET
        used_credits = used_credits + 1,
        remaining_credits = remaining_credits - 1,
        updated_at = timezone('utc'::text, now())
    WHERE user_id = p_user_id;

    -- Record transaction
    INSERT INTO public.user_credit_transactions (user_id, type, credits, description, template_id)
    VALUES (p_user_id, 'usage', -1, p_description, p_template_id);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.add_user_credits TO authenticated;
GRANT EXECUTE ON FUNCTION public.use_user_credit TO authenticated;

COMMENT ON TABLE public.ai_credit_packages IS 'AI credit packages available for purchase (one-time payment)';
COMMENT ON TABLE public.user_ai_credits IS 'User AI credit balances - no expiration, no monthly reset';
COMMENT ON TABLE public.user_credit_transactions IS 'History of credit purchases and usage';
COMMENT ON FUNCTION public.add_user_credits IS 'Add credits to user account after successful purchase';
COMMENT ON FUNCTION public.use_user_credit IS 'Deduct 1 credit when user generates or refines AI template';
