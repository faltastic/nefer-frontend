-- Drop all existing select policies on profiles first to avoid dependency errors
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Drop old visibility columns if they exist from previous migrations
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_public;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_visible;

-- Ensure is_confirmed is present and set to false by default
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='is_confirmed'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_confirmed BOOLEAN DEFAULT false NOT NULL;
  END IF; 
END $$;

-- Create the single correct policy for public viewing
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (is_confirmed = true);