
-- Add foreign key relationship between community_posts and user_profiles
ALTER TABLE public.community_posts 
ADD CONSTRAINT fk_community_posts_user_profiles 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;

-- Add foreign key relationship between community_comments and user_profiles  
ALTER TABLE public.community_comments
ADD CONSTRAINT fk_community_comments_user_profiles
FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;

-- Add foreign key relationship between saved_workouts and user_profiles
ALTER TABLE public.saved_workouts
ADD CONSTRAINT fk_saved_workouts_user_profiles
FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;

-- Add foreign key relationship between saved_nutrition_plans and user_profiles
ALTER TABLE public.saved_nutrition_plans
ADD CONSTRAINT fk_saved_nutrition_plans_user_profiles
FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;

-- Add foreign key relationship between user_progress and user_profiles
ALTER TABLE public.user_progress
ADD CONSTRAINT fk_user_progress_user_profiles
FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;

-- Add foreign key relationship between subscriptions and user_profiles
ALTER TABLE public.subscriptions
ADD CONSTRAINT fk_subscriptions_user_profiles
FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;

-- Add foreign key relationship between user_goals and user_profiles
ALTER TABLE public.user_goals
ADD CONSTRAINT fk_user_goals_user_profiles
FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;

-- Add foreign key relationship between post_likes and user_profiles
ALTER TABLE public.post_likes
ADD CONSTRAINT fk_post_likes_user_profiles
FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;
