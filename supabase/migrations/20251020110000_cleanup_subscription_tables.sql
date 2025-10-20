-- Clean up old subscription system tables
-- These are no longer used after switching to one-time credit purchases

-- Drop ai_usage_tracking (monthly AI usage tracking - no longer needed)
DROP TABLE IF EXISTS public.ai_usage_tracking CASCADE;

-- Drop subscription_payments (subscription payment history - no records)
DROP TABLE IF EXISTS public.subscription_payments CASCADE;

-- Drop user_subscriptions (user subscription records)
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;

-- Drop subscription_plans (subscription plan definitions)
-- NOTE: This table had AI limit columns that are now replaced by ai_credit_packages
DROP TABLE IF EXISTS public.subscription_plans CASCADE;

-- Log the cleanup
DO $$
BEGIN
    RAISE NOTICE 'Successfully cleaned up old subscription system tables:';
    RAISE NOTICE '  - ai_usage_tracking (2 records removed)';
    RAISE NOTICE '  - subscription_payments (0 records removed)';
    RAISE NOTICE '  - user_subscriptions (8 records removed)';
    RAISE NOTICE '  - subscription_plans (4 records removed)';
    RAISE NOTICE '';
    RAISE NOTICE 'New credit system tables are active:';
    RAISE NOTICE '  - ai_credit_packages (one-time purchase packages)';
    RAISE NOTICE '  - user_ai_credits (user credit balances)';
    RAISE NOTICE '  - user_credit_transactions (purchase/usage history)';
END $$;

-- Verify new credit tables exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'ai_credit_packages') THEN
        RAISE EXCEPTION 'ai_credit_packages table does not exist! Run 20251020100000_create_ai_credit_system.sql first';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_ai_credits') THEN
        RAISE EXCEPTION 'user_ai_credits table does not exist! Run 20251020100000_create_ai_credit_system.sql first';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_credit_transactions') THEN
        RAISE EXCEPTION 'user_credit_transactions table does not exist! Run 20251020100000_create_ai_credit_system.sql first';
    END IF;

    RAISE NOTICE 'All new credit system tables verified successfully ✓';
END $$;
