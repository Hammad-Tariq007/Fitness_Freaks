
-- Update the existing admin user's role to 'admin'
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
);

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved handle_new_user function that properly sets admin role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set admin role for specific email, otherwise set as regular user
  IF NEW.email = 'admin@gmail.com' THEN
    INSERT INTO public.user_profiles (user_id, name, gender, height, weight, goal, role)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'name', 'Admin'), 
      COALESCE(NEW.raw_user_meta_data->>'gender', 'other'),
      COALESCE((NEW.raw_user_meta_data->>'height')::INTEGER, 170),
      COALESCE((NEW.raw_user_meta_data->>'weight')::INTEGER, 70),
      COALESCE(NEW.raw_user_meta_data->>'goal', 'maintain'),
      'admin'
    );
  ELSE
    -- For regular users, only create profile if metadata is provided
    IF NEW.raw_user_meta_data IS NOT NULL THEN
      INSERT INTO public.user_profiles (user_id, name, gender, height, weight, goal, role)
      VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
        COALESCE(NEW.raw_user_meta_data->>'gender', 'other'),
        COALESCE((NEW.raw_user_meta_data->>'height')::INTEGER, 170),
        COALESCE((NEW.raw_user_meta_data->>'weight')::INTEGER, 70),
        COALESCE(NEW.raw_user_meta_data->>'goal', 'maintain'),
        'user'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
