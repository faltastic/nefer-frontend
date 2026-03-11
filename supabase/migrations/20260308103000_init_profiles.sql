CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  profile_type TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT,
  image_urls JSONB DEFAULT '[]'::jsonb NOT NULL,
  keywords JSONB DEFAULT '[]'::jsonb NOT NULL,
  is_confirmed BOOLEAN DEFAULT false NOT NULL,
  source_url TEXT
);

CREATE INDEX idx_profiles_slug ON public.profiles(slug);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, profile_id)
);

CREATE INDEX idx_likes_profile_id ON public.likes(profile_id);

CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, profile_id)
);

CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (is_confirmed = true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own likes" 
ON public.likes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own likes" 
ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.likes FOR DELETE USING (auth.uid() = user_id);
