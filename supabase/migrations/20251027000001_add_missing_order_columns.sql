-- Add missing columns to orders table for credit purchases and other features

-- Add columns if they don't exist
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.templates(id);

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS recipient_name TEXT;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS sender_name TEXT;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS message TEXT;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS special_date DATE;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS short_id TEXT UNIQUE;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2);

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS buyer_email TEXT;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_reference TEXT;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_response JSONB;

-- Add comments for new columns
COMMENT ON COLUMN public.orders.template_id IS 'Reference to template (NULL for credit purchases)';
COMMENT ON COLUMN public.orders.recipient_name IS 'Recipient name or package name for credit purchases';
COMMENT ON COLUMN public.orders.sender_name IS 'Sender name or buyer name';
COMMENT ON COLUMN public.orders.message IS 'Message content or purchase description';
COMMENT ON COLUMN public.orders.short_id IS 'Unique short identifier for the order';
COMMENT ON COLUMN public.orders.buyer_email IS 'Email address of the buyer';
COMMENT ON COLUMN public.orders.payment_reference IS 'Payment provider reference/merchant_oid';
COMMENT ON COLUMN public.orders.paid_at IS 'Timestamp when payment was completed';
COMMENT ON COLUMN public.orders.payment_response IS 'Full payment provider response as JSON';
