'use server';

import { createClient } from '@/lib/supabase/server';

export async function loginUser(data: { email: string; password: string }) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(data);
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

export async function signupUser(data: { email: string; password: string }) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(data);
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

export async function registerUser(data: {
  email: string;
  password: string;
  inviteCode: string;
  url: string;
  profileData: any;
}) {
  const supabase = await createClient();

  const VALID_INVITE_CODES = ['NEFER2026', 'CREATOR26']; // Hardcoded for MVP
  const isInviteValid = data.inviteCode && VALID_INVITE_CODES.includes(data.inviteCode.toUpperCase());

  // We sign up the user regardless, so the trigger creates their profile.
  // We assume email confirmations are disabled in Supabase for this demo,
  // allowing them to log in immediately.
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        profile_data: data.profileData,
        invite_code: data.inviteCode || null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // We still return 'waitlist' to the UI if the code wasn't valid,
  // but they can now log in and see their status.
  return { type: isInviteValid ? 'confirmation' : 'waitlist' };
}
