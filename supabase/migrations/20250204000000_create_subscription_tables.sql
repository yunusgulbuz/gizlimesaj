-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subtitle TEXT,
    price DECIMAL(10, 2) NOT NULL,
    monthly_message_count INTEGER NOT NULL,
    access_days INTEGER NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    instruction_number TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending',
    -- Statuses: pending, active, cancelled, expired, failed
    payment_start_date DATE,
    next_payment_date DATE,
    total_payments INTEGER,
    successful_payments INTEGER DEFAULT 0,
    remaining_messages INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subscription_payments table to track individual payments
CREATE TABLE IF NOT EXISTS public.subscription_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id UUID NOT NULL REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL,
    -- Statuses: pending, completed, failed
    transaction_reference TEXT,
    auth_code TEXT,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (id, name, subtitle, price, monthly_message_count, access_days, features, is_popular)
VALUES
    ('monthly-10', 'Başlangıç', 'Aylık 10 Sürpriz', 999.00, 10, 7,
     '["Ayda 10 dijital sürpriz mesajı", "Tüm şablon kütüphanesine erişim", "Müzik ve animasyon desteği", "7 gün erişim süresi", "E-posta desteği"]'::jsonb,
     false),
    ('monthly-20', 'Popüler', 'Aylık 20 Sürpriz', 1799.00, 20, 14,
     '["Ayda 20 dijital sürpriz mesajı", "Tüm şablon kütüphanesine erişim", "Müzik ve animasyon desteği", "14 gün erişim süresi", "Öncelikli e-posta desteği", "Özel şablon talebi hakkı"]'::jsonb,
     true),
    ('monthly-30', 'Premium', 'Aylık 30 Sürpriz', 2499.00, 30, 30,
     '["Ayda 30 dijital sürpriz mesajı", "Tüm şablon kütüphanesine erişim", "Müzik ve animasyon desteği", "30 gün erişim süresi", "7/24 öncelikli destek", "3 özel şablon talebi hakkı", "İlk erişim yeni özelliklere"]'::jsonb,
     false);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_instruction_number ON public.user_subscriptions(instruction_number);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_subscription_id ON public.subscription_payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_status ON public.subscription_payments(status);

-- Enable Row Level Security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read, admin write)
CREATE POLICY "subscription_plans_select_policy" ON public.subscription_plans
    FOR SELECT
    USING (is_active = true);

-- RLS Policies for user_subscriptions (users can only see their own)
CREATE POLICY "user_subscriptions_select_policy" ON public.user_subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "user_subscriptions_insert_policy" ON public.user_subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_subscriptions_update_policy" ON public.user_subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for subscription_payments (users can only see their own)
CREATE POLICY "subscription_payments_select_policy" ON public.subscription_payments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_subscriptions
            WHERE user_subscriptions.id = subscription_payments.subscription_id
            AND user_subscriptions.user_id = auth.uid()
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
