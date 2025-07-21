
-- 1. Find the name of the constraint (assume standard name, or alter if yours is custom)
ALTER TABLE public.workouts DROP CONSTRAINT IF EXISTS workouts_level_check;

-- 2. Clean the data (trim, lowercase, fallback to 'beginner' if not a valid value)
UPDATE public.workouts
SET level = 
  CASE
    WHEN TRIM(LOWER(level)) = 'beginner' THEN 'beginner'
    WHEN TRIM(LOWER(level)) = 'intermediate' THEN 'intermediate'
    WHEN TRIM(LOWER(level)) = 'advanced' THEN 'advanced'
    ELSE 'beginner'
  END;

-- 3. Add back the CHECK constraint to enforce lowercase values only
ALTER TABLE public.workouts
  ADD CONSTRAINT workouts_level_check CHECK (
    level IN ('beginner','intermediate','advanced')
  );
