import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowSquareOut, Camera, User, House, Heart, BookmarkSimple, ShareNetwork } from "@phosphor-icons/react/dist/ssr";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!profile) {
    notFound();
  }

  const image_urls = (profile.image_urls as string[]) || [];
  const keywords = (profile.keywords as string[]) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
              <img 
                src={image_urls[0] || "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=1000"} 
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            {image_urls.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {image_urls.slice(1, 4).map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img src={url} alt={`${profile.name} ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col h-full py-4">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <Badge className="bg-emerald-600 text-white border-none px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                  {profile.profile_type === "Photographer" ? <Camera size={16} weight="fill" /> : <User size={16} weight="fill" />}
                  {profile.profile_type}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-zinc-900 border border-zinc-800">
                    <Heart size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-zinc-900 border border-zinc-800">
                    <BookmarkSimple size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-zinc-900 border border-zinc-800">
                    <ShareNetwork size={20} />
                  </Button>
                </div>
              </div>
              
              <h1 className="text-5xl font-black tracking-tight mb-2">{profile.name}</h1>
              {profile.source_url && (
                <div className="flex items-center gap-2 text-zinc-400 font-medium mb-6">
                  <House size={18} />
                  <Link href={profile.source_url} target="_blank" className="hover:text-emerald-500 underline underline-offset-4 decoration-emerald-500/30 transition-colors">
                    {new URL(profile.source_url).hostname}
                  </Link>
                </div>
              )}

              <p className="text-2xl font-bold text-emerald-500 mb-8 leading-tight">
                {profile.short_description}
              </p>

              <div className="prose prose-invert max-w-none mb-10">
                <p className="text-lg text-zinc-300 leading-relaxed">
                  {profile.long_description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-12">
                {keywords.map((kw, i) => (
                  <Badge key={i} variant="secondary" className="px-4 py-1.5 rounded-lg text-sm bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              {profile.source_url && (
                <Link href={profile.source_url} target="_blank" className="flex-1">
                  <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/20 flex items-center gap-2">
                    <ArrowSquareOut size={22} weight="bold" />
                    Visit Portfolio
                  </Button>
                </Link>
              )}
              <Button variant="outline" className="flex-1 h-14 rounded-2xl text-lg font-bold border-zinc-800 bg-zinc-900 hover:bg-zinc-800">
                Message Professional
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
