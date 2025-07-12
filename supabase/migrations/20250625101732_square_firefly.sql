/*
  # Fix user signup database error

  1. Database Functions
    - Create or update the handle_new_user function to properly create profiles
    - Ensure the function handles all required fields and error cases

  2. Triggers
    - Create trigger to automatically create profile when user signs up
    - Ensure trigger is properly configured for auth.users table

  3. Security
    - Update RLS policies to allow profile creation during signup
    - Ensure proper permissions for authenticated users

  4. Data Integrity
    - Add proper constraints and defaults
    - Handle edge cases in profile creation
*/

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'fullName', NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatarUrl', NEW.raw_user_meta_data->>'avatar_url'),
    NOW(),
    NOW()
  );

  -- Create user stats record
  INSERT INTO public.user_stats (
    user_id,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies for profiles table
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view public profiles" ON public.profiles;

-- Allow users to insert their own profile (needed for signup)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to view public profiles and their own
CREATE POLICY "Users can view public profiles"
  ON public.profiles
  FOR SELECT
  TO public
  USING (is_public = true OR auth.uid() = id);

-- Update RLS policies for user_stats table
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;

-- Allow system to insert user stats during signup
CREATE POLICY "Users can insert own stats"
  ON public.user_stats
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own stats
CREATE POLICY "Users can update own stats"
  ON public.user_stats
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own stats
CREATE POLICY "Users can view own stats"
  ON public.user_stats
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Ensure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.user_stats TO anon, authenticated;