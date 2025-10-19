-- Create ai_generated_templates table
CREATE TABLE IF NOT EXISTS public.ai_generated_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('teen', 'adult', 'classic', 'fun', 'elegant', 'romantic', 'birthday', 'apology', 'thank-you', 'celebration')),
    user_prompt TEXT NOT NULL,
    template_code TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Create index for user_id
CREATE INDEX IF NOT EXISTS idx_ai_templates_user_id ON public.ai_generated_templates(user_id);

-- Create index for slug
CREATE INDEX IF NOT EXISTS idx_ai_templates_slug ON public.ai_generated_templates(slug);

-- Create index for active templates
CREATE INDEX IF NOT EXISTS idx_ai_templates_active ON public.ai_generated_templates(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.ai_generated_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only view their own AI templates
CREATE POLICY "Users can view their own AI templates"
    ON public.ai_generated_templates
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own AI templates
CREATE POLICY "Users can create their own AI templates"
    ON public.ai_generated_templates
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own AI templates
CREATE POLICY "Users can update their own AI templates"
    ON public.ai_generated_templates
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own AI templates
CREATE POLICY "Users can delete their own AI templates"
    ON public.ai_generated_templates
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_ai_templates_timestamp
    BEFORE UPDATE ON public.ai_generated_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_templates_updated_at();
