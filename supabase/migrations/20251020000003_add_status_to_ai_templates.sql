-- Add status column to ai_generated_templates
ALTER TABLE public.ai_generated_templates
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'
CHECK (status IN ('draft', 'purchased', 'deleted'));

-- Update existing templates to draft status
UPDATE public.ai_generated_templates
SET status = 'draft'
WHERE status IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ai_generated_templates_status ON public.ai_generated_templates(status);
CREATE INDEX IF NOT EXISTS idx_ai_generated_templates_user_status ON public.ai_generated_templates(user_id, status);

-- Add comment for documentation
COMMENT ON COLUMN public.ai_generated_templates.status IS 'Template status: draft (active slot), purchased (freed slot), deleted (soft delete)';
