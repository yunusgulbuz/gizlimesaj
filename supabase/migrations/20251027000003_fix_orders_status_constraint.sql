-- Fix orders status constraint to include 'completed' and 'paid'
-- Drop old constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add new constraint with all valid statuses
ALTER TABLE public.orders
ADD CONSTRAINT orders_status_check
CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'completed'::text, 'failed'::text, 'canceled'::text, 'cancelled'::text]));

COMMENT ON CONSTRAINT orders_status_check ON public.orders IS 'Valid order statuses: pending, paid, completed, failed, canceled/cancelled';
