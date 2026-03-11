'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/supabase/server-auth';
import { revalidatePath } from 'next/cache';

export async function toggleLike(profileId: string) {
  const user = await requireAuth();
  const supabase = await createClient();

  // Check if like exists
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('profile_id', profileId)
    .single();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);
      
    if (error) return { error: error.message };
    return { success: true, liked: false };
  } else {
    // Like
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: user.id, profile_id: profileId });
      
    if (error) return { error: error.message };
    return { success: true, liked: true };
  }
}

export async function toggleBookmark(profileId: string) {
  const user = await requireAuth();
  const supabase = await createClient();

  // Check if bookmark exists
  const { data: existingBookmark } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('profile_id', profileId)
    .single();

  if (existingBookmark) {
    // Remove Bookmark
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existingBookmark.id);
      
    if (error) return { error: error.message };
    return { success: true, bookmarked: false };
  } else {
    // Add Bookmark
    const { error } = await supabase
      .from('bookmarks')
      .insert({ user_id: user.id, profile_id: profileId });
      
    if (error) return { error: error.message };
    return { success: true, bookmarked: true };
  }
}
