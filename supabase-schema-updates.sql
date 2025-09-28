-- Schema updates for Paynkolay integration and new features
-- Apply these changes to your Supabase database

-- 1. Update orders table to match new requirements
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES templates(id),
ADD COLUMN IF NOT EXISTS recipient_name text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS sender_name text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS message text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS special_date text,
ADD COLUMN IF NOT EXISTS expires_at timestamptz,
ADD COLUMN IF NOT EXISTS short_id text UNIQUE,
ADD COLUMN IF NOT EXISTS amount numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_reference text,
ADD COLUMN IF NOT EXISTS payment_response jsonb,
ADD COLUMN IF NOT EXISTS paid_at timestamptz,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Update status enum to include 'completed' instead of 'paid'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'canceled'::text]));

-- Update payment_provider enum to include 'paynkolay'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_provider_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_provider_check 
CHECK (payment_provider = ANY (ARRAY['iyzico'::text, 'stripe'::text, 'paynkolay'::text]));

-- 2. Update personal_pages table to match new requirements
ALTER TABLE personal_pages 
ADD COLUMN IF NOT EXISTS order_id uuid REFERENCES orders(id),
ADD COLUMN IF NOT EXISTS sender_name text,
ADD COLUMN IF NOT EXISTS special_date text,
ADD COLUMN IF NOT EXISTS expires_at timestamptz;

-- Rename columns to match new naming convention
ALTER TABLE personal_pages RENAME COLUMN expire_at TO expires_at;
ALTER TABLE personal_pages RENAME COLUMN start_at TO created_at;

-- 3. Create page_analytics table for button click tracking
CREATE TABLE IF NOT EXISTS page_analytics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    personal_page_id uuid REFERENCES personal_pages(id) ON DELETE CASCADE,
    event_type text NOT NULL CHECK (event_type IN ('view', 'button_click', 'share')),
    event_data jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS on page_analytics
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- 4. Create email_notifications table for tracking sent emails
CREATE TABLE IF NOT EXISTS email_notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    personal_page_id uuid REFERENCES personal_pages(id) ON DELETE CASCADE,
    recipient_email text NOT NULL,
    email_type text NOT NULL CHECK (email_type IN ('page_ready', 'reminder', 'expiring_soon')),
    sent_at timestamptz DEFAULT now(),
    status text DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
    error_message text
);

-- Enable RLS on email_notifications
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- 5. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_short_id ON orders(short_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_personal_pages_short_id ON personal_pages(short_id);
CREATE INDEX IF NOT EXISTS idx_personal_pages_expires_at ON personal_pages(expires_at);
CREATE INDEX IF NOT EXISTS idx_page_analytics_personal_page_id ON page_analytics(personal_page_id);
CREATE INDEX IF NOT EXISTS idx_page_analytics_event_type ON page_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_page_analytics_created_at ON page_analytics(created_at);

-- 6. Create RLS policies for new tables

-- page_analytics policies
CREATE POLICY "Allow public read access to page_analytics" ON page_analytics
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to page_analytics" ON page_analytics
    FOR INSERT WITH CHECK (true);

-- email_notifications policies (admin only)
CREATE POLICY "Allow admin access to email_notifications" ON email_notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE user_id = auth.uid()
        )
    );

-- 7. Update existing RLS policies for orders and personal_pages if needed
-- (These might need adjustment based on your current policies)

-- Allow public read access to orders by short_id (for payment pages)
DROP POLICY IF EXISTS "Allow public read access to orders by short_id" ON orders;
CREATE POLICY "Allow public read access to orders by short_id" ON orders
    FOR SELECT USING (short_id IS NOT NULL);

-- Allow public insert to orders (for creating payments)
DROP POLICY IF EXISTS "Allow public insert to orders" ON orders;
CREATE POLICY "Allow public insert to orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Allow public update to orders (for payment callbacks)
DROP POLICY IF EXISTS "Allow public update to orders" ON orders;
CREATE POLICY "Allow public update to orders" ON orders
    FOR UPDATE USING (true);

-- Allow public read access to personal_pages by short_id
DROP POLICY IF EXISTS "Allow public read access to personal_pages by short_id" ON personal_pages;
CREATE POLICY "Allow public read access to personal_pages by short_id" ON personal_pages
    FOR SELECT USING (short_id IS NOT NULL AND is_active = true);

-- Allow public insert to personal_pages (for payment success)
DROP POLICY IF EXISTS "Allow public insert to personal_pages" ON personal_pages;
CREATE POLICY "Allow public insert to personal_pages" ON personal_pages
    FOR INSERT WITH CHECK (true);

-- 8. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for orders table
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Add sample data for testing (optional)
-- INSERT INTO durations (label, days) VALUES 
-- ('1 Gün', 1),
-- ('3 Gün', 3),
-- ('7 Gün', 7),
-- ('14 Gün', 14),
-- ('30 Gün', 30)
-- ON CONFLICT DO NOTHING;