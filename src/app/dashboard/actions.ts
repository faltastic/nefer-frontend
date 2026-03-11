'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/supabase/server-auth';
import { revalidatePath } from 'next/cache';

interface BatchProfileData {
  name: string;
  profile_type: string;
  short_description: string;
  long_description: string;
  image_urls: string[];
  keywords: string[];
  source_url: string;
  email?: string;
}

export async function saveGeneratedProfile(data: BatchProfileData) {
  // Ensure only authenticated users (admins) can run this
  const user = await requireAuth();
  const supabase = await createClient();

  // Create a base slug from the name
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // TODO: in a real app, you'd check uniqueness in DB first


  // TODO: Handle 'email' logic for sending invites.
  // We can either create a new table for pending invites, or send the email directly using a service like Resend.
  if (data.email) {
    console.log(`[INFO] Scheduled invite to be sent to: ${data.email} for profile ${data.name}`);
    // await sendInviteEmail(data.email, slug);
  }

  const { error } = await supabase.from('profiles').insert({
    // We attribute the profile to the admin running the script for now,
    // or we could make user_id nullable in the DB to represent unclaimed profiles.
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

  // Clear cache for homepage to show new profiles
  revalidatePath('/');
  
  return { success: true, slug };
}
