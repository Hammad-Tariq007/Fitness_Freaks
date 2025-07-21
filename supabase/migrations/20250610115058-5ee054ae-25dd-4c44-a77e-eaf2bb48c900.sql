
-- Add youtube_url column to workouts table for storing YouTube links
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS youtube_url text;

-- Update existing workouts with sample YouTube URLs based on their categories
UPDATE public.workouts 
SET youtube_url = CASE 
  WHEN category = 'Strength' THEN 'https://www.youtube.com/watch?v=UBMk30rjy0o'
  WHEN category = 'Cardio' THEN 'https://www.youtube.com/watch?v=ml6cT4AZdqI'
  WHEN category = 'HIIT' THEN 'https://www.youtube.com/watch?v=Nz3fPtOvJSE'
  WHEN category = 'Yoga' THEN 'https://www.youtube.com/watch?v=v7AYKMP6rOE'
  WHEN category = 'Flexibility' THEN 'https://www.youtube.com/watch?v=g_tea8ZNk5A'
  ELSE 'https://www.youtube.com/watch?v=UBMk30rjy0o'
END
WHERE youtube_url IS NULL;
