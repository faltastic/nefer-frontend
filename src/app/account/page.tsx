import { requireAuth } from '@/lib/supabase/server-auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Info } from '@phosphor-icons/react/dist/ssr';
import { signOutUser } from './actions';

export default async function AccountDashboard() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  let placeInLine = 105;
  if (profile && !profile.is_confirmed) {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_confirmed', false)
      .lt('created_at', profile.created_at);
      
    placeInLine = (count || 0) + 1;
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {!profile ? (
        <div className="bg-muted p-8 rounded-lg text-center max-w-md mx-auto mt-10">
          <h2 className="text-xl font-semibold mb-2">Create Your Profile</h2>
          <p className="text-muted-foreground mb-6">You haven't generated a profile yet. Let our AI build one for you based on your existing portfolio or social media.</p>
          <Link href="/account/generate">
            <Button size="lg">Generate Profile Now</Button>
          </Link>
        </div>
      ) : !profile.is_confirmed ? (
        <div className="bg-muted/50 border border-zinc-800 p-8 rounded-xl text-center max-w-lg mx-auto mt-10 space-y-4">
          <Info className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Account Under Review</h2>
          <p className="text-muted-foreground">
            Thanks for creating your Nefer profile! We are currently reviewing your request to ensure quality across our creative network.
          </p>
          <div className="bg-background border border-zinc-800 rounded-lg p-4 mt-6 inline-block">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Profiles In Review</p>
            <p className="text-4xl font-extrabold text-emerald-500">#{placeInLine}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            We will email you as soon as your profile is approved and made public.
          </p>
          <form action={signOutUser} className="pt-6">
            <Button type="submit" variant="ghost" className="w-full text-muted-foreground">Sign Out</Button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Your Active Profile</h2>
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-bold text-lg">{profile.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{profile.profile_type}</p>
              <div className="flex gap-4">
                <Link href={`/${profile.slug}`}>
                  <Button variant="outline">View Public Profile</Button>
                </Link>
                <Link href="/account/share">
                  <Button variant="secondary">Share / QR Code</Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Settings</h2>
            <div className="border rounded-lg p-6 bg-card flex flex-col gap-4">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
              <form action={signOutUser}>
                <Button type="submit" variant="destructive" className="w-full">Sign Out</Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
