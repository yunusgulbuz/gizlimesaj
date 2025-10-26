-- Add share_preview_meta column to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS share_preview_meta JSONB DEFAULT NULL;

-- Add share_preview_meta column to personal_pages table
ALTER TABLE personal_pages
ADD COLUMN IF NOT EXISTS share_preview_meta JSONB DEFAULT NULL;

-- Add comment to describe the columns
COMMENT ON COLUMN orders.share_preview_meta IS 'Share preview metadata including title, description, siteName, image, category, presetId, and isCustom flag';
COMMENT ON COLUMN personal_pages.share_preview_meta IS 'Share preview metadata including title, description, siteName, image, category, presetId, and isCustom flag';
