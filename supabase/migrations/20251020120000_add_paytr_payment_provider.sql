-- Add PayTR as a valid payment provider
-- Drop the old constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_provider_check;

-- Add new constraint with 'paytr' included
ALTER TABLE orders
ADD CONSTRAINT orders_payment_provider_check
CHECK (payment_provider = ANY (ARRAY['iyzico'::text, 'stripe'::text, 'paynkolay'::text, 'paytr'::text]));

-- Update any existing orders to use 'paytr' if needed (optional)
-- UPDATE orders SET payment_provider = 'paytr' WHERE payment_provider = 'paynkolay';
