
-- Add tags column to community_posts table
ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT ARRAY[]::text[];
