'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/supabase/server-auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface ProfileData {
  name: string;
  profile_type: string;
  short_description: string;
  long_description: string;
  image_urls: string[];
  keywords: string[];
  source_url: string;
}

export async function signOutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/');
}

export async function saveProfile(data: ProfileData) {
  const user = await requireAuth();
  const supabase = await createClient();

  // Create a base slug from the name
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // TODO: in a real app, you'd check uniqueness in DB first

  const { error } = await supabase.from('profiles').insert({
    user_id: user.id,
    name: data.name,
    profile_type: data.profile_type,
    short_description: data.short_description,
    long_description: data.long_description,
    image_urls: data.image_urls,
    keywords: data.keywords,
    source_url: data.source_url,
    slug: slug,
    is_confirmed: false,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/account');
  redirect('/account');
}
