-- Create waitlist table
CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  invite_code TEXT,
  url TEXT NOT NULL,
  profile_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Anyone can insert into waitlist
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert into waitlist" 
ON public.waitlist FOR INSERT WITH CHECK (true);

-- Function to handle new user profile creation (only for those who successfully sign up)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  p_data JSONB;
  p_slug TEXT;
  base_slug TEXT;
BEGIN
  IF NEW.raw_user_meta_data ? 'profile_data' THEN
    p_data := NEW.raw_user_meta_data->'profile_data';
    
    base_slug := lower(regexp_replace(p_data->>'name', '[^a-zA-Z0-9]+', '-', 'g'));
    p_slug := base_slug || '-' || floor(random() * 10000)::text;

    INSERT INTO public.profiles (
      user_id,
      slug,
      name,
      profile_type,
      short_description,
      long_description,
      image_urls,
      keywords,
      source_url,
      is_confirmed
    ) VALUES (
      NEW.id,
      p_slug,
      p_data->>'name',
      p_data->>'profile_type',
      p_data->>'short_description',
      p_data->>'long_description',
      COALESCE(p_data->'image_urls', '[]'::jsonb),
      COALESCE(p_data->'keywords', '[]'::jsonb),
      p_data->>'source_url',
      false
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();