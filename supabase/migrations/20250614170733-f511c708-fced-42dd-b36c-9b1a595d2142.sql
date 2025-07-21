
-- Rollback: Remove RLS and policies to restore full access (OPEN, UNRESTRICTED as before)

-- user_profiles
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- saved_workouts
ALTER TABLE public.saved_workouts DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their workouts" ON public.saved_workouts;

-- saved_nutrition_plans
ALTER TABLE public.saved_nutrition_plans DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their nutrition plans" ON public.saved_nutrition_plans;

-- subscriptions
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their subscriptions" ON public.subscriptions;

-- workouts
ALTER TABLE public.workouts DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view workouts" ON public.workouts;
DROP POLICY IF EXISTS "Admins can modify workouts" ON public.workouts;

-- nutrition_plans
ALTER TABLE public.nutrition_plans DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view nutrition plans" ON public.nutrition_plans;
DROP POLICY IF EXISTS "Admins can modify nutrition plans" ON public.nutrition_plans;

-- blogs
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can modify blogs" ON public.blogs;

-- community_posts
ALTER TABLE public.community_posts DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can see their own/community posts" ON public.community_posts;

-- community_comments
ALTER TABLE public.community_comments DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own comments" ON public.community_comments;
DROP POLICY IF EXISTS "Admins can access all comments" ON public.community_comments;

-- user_progress
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their progress" ON public.user_progress;

-- user_progress_logs
ALTER TABLE public.user_progress_logs DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their progress logs" ON public.user_progress_logs;

