import { createClient } from "@/lib/supabase/server";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/supabase/server-auth";
import { SearchBar } from "@/components/SearchBar";

export default async function HomePage() {
  const supabase = await createClient();
  const user = await getUser();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_confirmed", true)
    .order("created_at", { ascending: false })
    .limit(24);

  let likedProfileIds = new Set<string>();
  let bookmarkedProfileIds = new Set<string>();

  if (user) {
    const { data: likes } = await supabase
      .from("likes")
      .select("profile_id")
      .eq("user_id", user.id);

    const { data: bookmarks } = await supabase
      .from("bookmarks")
      .select("profile_id")
      .eq("user_id", user.id);

    if (likes) {
      likedProfileIds = new Set(likes.map((like) => like.profile_id));
    }
    if (bookmarks) {
      bookmarkedProfileIds = new Set(
        bookmarks.map((bookmark) => bookmark.profile_id),
      );
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-emerald-950/20 to-background">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Connect with the world's{" "}
            <span className="text-emerald-500">top creatives</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            The next-generation platform for photographers, models, and brands
            to find their next collaboration.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/join">
              <Button size="lg" className="rounded-full px-8 text-lg font-bold">
                Get Started
              </Button>
            </Link>
            <Link href="/join">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-lg font-bold"
              >
                Browse Professionals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Profiles Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {/* Mobile Search Bar */}
          <SearchBar variant="mobile" className="md:hidden mb-10" />

          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Professionals
              </h2>
              <p className="text-muted-foreground mt-2">
                Discover talented creators joining the Nefer community.
              </p>
            </div>
            <Link
              href="/join"
              className="text-emerald-500 font-bold hover:underline"
            >
              View all
            </Link>
          </div>

          {!profiles || profiles.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-zinc-800">
              <h3 className="text-xl font-semibold mb-2">No profiles yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first professional to join Nefer!
              </p>
              <Link href="/join">
                <Button>Create Profile</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  initialLiked={likedProfileIds.has(profile.id)}
                  initialBookmarked={bookmarkedProfileIds.has(profile.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer-like CTA */}
      <section className="py-24 px-4 bg-emerald-950/10 border-t border-zinc-900 mt-auto">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to showcase your portfolio?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Our AI analyzes your existing work to build a professional Nefer
            profile in seconds.
          </p>
          {user ? (
            <Link href="/account">
              <Button
                size="lg"
                className="rounded-full px-12 h-14 text-lg font-bold"
              >
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/join">
              <Button
                size="lg"
                className="rounded-full px-12 h-14 text-lg font-bold bg-fuchsia-600"
              >
                Join Nefer Today
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
