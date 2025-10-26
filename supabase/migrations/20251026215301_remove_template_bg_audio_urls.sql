-- Remove background audio URLs from all templates
-- This allows users to manually add music via YouTube links instead of automatic template music

UPDATE templates
SET bg_audio_url = NULL
WHERE bg_audio_url IS NOT NULL;
