-- Add admin policies for ai_template_pricing table

-- Drop existing select policy
DROP POLICY IF EXISTS "ai_template_pricing_select_policy" ON public.ai_template_pricing;

-- Create new policies for ai_template_pricing

-- Public can view active pricing
CREATE POLICY "ai_template_pricing_select_policy" ON public.ai_template_pricing
    FOR SELECT
    USING (is_active = true);

-- Admins can insert pricing
CREATE POLICY "ai_template_pricing_insert_admin_policy" ON public.ai_template_pricing
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE admins.user_id = auth.uid()
        )
    );

-- Admins can update pricing
CREATE POLICY "ai_template_pricing_update_admin_policy" ON public.ai_template_pricing
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE admins.user_id = auth.uid()
        )
    );

-- Admins can delete pricing
CREATE POLICY "ai_template_pricing_delete_admin_policy" ON public.ai_template_pricing
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE admins.user_id = auth.uid()
        )
    );

COMMENT ON POLICY "ai_template_pricing_select_policy" ON public.ai_template_pricing IS 'Allow public to view active AI template pricing';
COMMENT ON POLICY "ai_template_pricing_insert_admin_policy" ON public.ai_template_pricing IS 'Allow admins to insert AI template pricing';
COMMENT ON POLICY "ai_template_pricing_update_admin_policy" ON public.ai_template_pricing IS 'Allow admins to update AI template pricing';
COMMENT ON POLICY "ai_template_pricing_delete_admin_policy" ON public.ai_template_pricing IS 'Allow admins to delete AI template pricing';
