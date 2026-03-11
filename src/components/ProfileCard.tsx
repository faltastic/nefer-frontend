'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowSquareOut, Camera, User, House } from "@phosphor-icons/react/dist/ssr";
import { Tables } from "@/types/database";
import { InteractionButtons } from "@/components/InteractionButtons";
import { useUser } from "@/lib/auth";

type ProfileRow = Tables<'profiles'>;

interface ProfileCardProps {
  profile: ProfileRow;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
}

export function ProfileCard({ profile, initialLiked = false, initialBookmarked = false }: ProfileCardProps) {
  // Safe parsing of JSON fields from Supabase
  const image_urls = (profile.image_urls as string[]) || [];
  const keywords = (profile.keywords as string[]) || [];
  
  // Use the first image as main, others as thumbnails
  const mainImage = image_urls[0];
  const thumbnails = image_urls.slice(1, 5);

  const { user } = useUser();
  const isAuthenticated = !!user;

  return (
    <Card className="w-full max-w-lg border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden group shadow-2xl flex flex-col h-full">
      {/* Image Section */}
      <Link href={`/${profile.slug}`} className="block relative">
        <div className="h-[340px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={mainImage || "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=1000"} 
            alt={profile.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-emerald-600/90 text-white hover:bg-emerald-600 border-none px-3 py-1 flex items-center gap-1.5 shadow-lg backdrop-blur-md">
            {profile.profile_type === "Photographer" ? <Camera size={14} weight="fill" /> : <User size={14} weight="fill" />}
            {profile.profile_type}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <InteractionButtons 
            profileId={profile.id} 
            initialLiked={initialLiked} 
            initialBookmarked={initialBookmarked}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </Link>

      {/* Thumbnails Row */}
      {thumbnails.length > 0 && (
        <div className="flex gap-1 p-1 bg-black/20">
          {thumbnails.map((url, i) => (
            <div key={i} className="flex-1 h-20 overflow-hidden bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={url} 
                alt={`${profile.name} thumb ${i}`}
                className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      <CardContent className="p-6 space-y-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <Link href={`/${profile.slug}`}>
              <h2 className="text-2xl font-extrabold text-zinc-50 tracking-tight leading-none hover:text-emerald-400 transition-colors">
                {profile.name}
              </h2>
            </Link>
            {profile.source_url && (
              <div className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
                <House size={14} />
                <Link href={profile.source_url} target="_blank" className="hover:text-emerald-500 underline-offset-4 hover:underline decoration-emerald-500/30">
                  {new URL(profile.source_url).hostname}
                </Link>
              </div>
            )}
          </div>
          
          {profile.source_url && (
            <Link 
              href={profile.source_url} 
              target="_blank" 
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-emerald-600 hover:text-white transition-all shadow-inner"
            >
              <ArrowSquareOut size={20} weight="bold" />
            </Link>
          )}
        </div>

        <div className="space-y-3 flex-1">
          <p className="text-zinc-200 font-bold leading-snug">
            {profile.short_description}
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 font-medium">
            {profile.long_description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 mt-auto">
          {keywords.slice(0, 5).map((keyword, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-emerald-400 font-semibold px-2.5 py-0.5 rounded-md transition-colors"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
