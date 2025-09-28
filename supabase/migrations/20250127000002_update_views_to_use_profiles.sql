-- Update user_profiles view to use public.profiles instead of auth.users
-- This fixes the permission issue by avoiding direct access to auth.users

-- First drop dependent views in correct order
DROP VIEW IF EXISTS public.template_comments_with_user;
DROP VIEW IF EXISTS public.user_profiles;

-- Create new user_profiles view using public.profiles table
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
    id,
    email,
    display_name,
    avatar_url
FROM public.profiles;

-- No need for security_invoker since we're using public.profiles with proper RLS

-- Recreate template_comments_with_user view to use the new user_profiles view

CREATE OR REPLACE VIEW public.template_comments_with_user AS
SELECT 
    tc.*,
    up.display_name,
    up.avatar_url,
    COUNT(cl.id) as like_count,
    CASE WHEN auth.uid() IS NOT NULL THEN
        EXISTS(SELECT 1 FROM public.comment_likes WHERE comment_id = tc.id AND user_id = auth.uid())
    ELSE false
    END as user_has_liked
FROM public.template_comments tc
LEFT JOIN public.user_profiles up ON tc.user_id = up.id
LEFT JOIN public.comment_likes cl ON tc.id = cl.comment_id
GROUP BY tc.id, tc.template_id, tc.user_id, tc.comment, tc.created_at, tc.updated_at, 
         up.display_name, up.avatar_url
ORDER BY tc.created_at DESC;