
-- Create user_progress_logs table for daily progress tracking
CREATE TABLE IF NOT EXISTS public.user_progress_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  calories_consumed INTEGER DEFAULT 0,
  workouts_completed INTEGER DEFAULT 0,
  current_weight DECIMAL(5,2),
  water_intake INTEGER DEFAULT 0, -- in ml
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date) -- One entry per user per day
);

-- Enable RLS on user_progress_logs
ALTER TABLE public.user_progress_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_progress_logs
CREATE POLICY "Users can view their own progress logs" 
  ON public.user_progress_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress logs" 
  ON public.user_progress_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress logs" 
  ON public.user_progress_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress logs" 
  ON public.user_progress_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add updated_at trigger for user_progress_logs
CREATE TRIGGER update_user_progress_logs_updated_at
  BEFORE UPDATE ON public.user_progress_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update user_goals table to include more goal types
ALTER TABLE public.user_goals 
ADD COLUMN IF NOT EXISTS weight_goal DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS goal_type TEXT DEFAULT 'fitness',
ADD COLUMN IF NOT EXISTS target_date DATE,
ADD COLUMN IF NOT EXISTS macros_protein INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS macros_carbs INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS macros_fat INTEGER DEFAULT 0;

-- Enable RLS on user_goals if not already enabled
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_goals
DROP POLICY IF EXISTS "Users can view their own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can insert their own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON public.user_goals;

CREATE POLICY "Users can view their own goals" 
  ON public.user_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" 
  ON public.user_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
  ON public.user_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
  ON public.user_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);
