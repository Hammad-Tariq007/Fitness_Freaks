
-- Allow admins to delete any community post, not just their own.

-- 1. Remove any existing DELETE policies on community_posts
DROP POLICY IF EXISTS "Users can delete their own post" ON public.community_posts;
DROP POLICY IF EXISTS "Admins can delete any post" ON public.community_posts;

-- 2. Create DELETE policy for regular users (can delete own post)
CREATE POLICY "Users can delete their own post"
  ON public.community_posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Create DELETE policy for admins (can delete any post)
CREATE POLICY "Admins can delete any post"
  ON public.community_posts
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.user_id = auth.uid()
      AND up.role = 'admin'
    )
  );

-- (If not enabled) Enable RLS on community_posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
