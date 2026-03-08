import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowSquareOut, MapPin, Camera, User, House, Heart, BookmarkSimple } from "@phosphor-icons/react/dist/ssr";

export interface ProfileData {
  url: string;
  name: string;
  profile_type: string;
  short_description: string;
  long_description: string;
  image_urls: string[];
  keywords: string[];
}

interface ProfileCardProps {
  profile: ProfileData;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  // Use the first image as main, others as thumbnails
  const mainImage = profile.image_urls[0];
  const thumbnails = profile.image_urls.slice(1, 5);

  return (
    <Card className="w-full max-w-lg border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden group shadow-2xl">
      {/* Image Section */}
      <div className="relative">
        <div className="h-[340px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={mainImage} 
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
        <div className="absolute bottom-4 left-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           <button className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-emerald-600 transition-colors">
              <Heart size={20} weight="bold" />
           </button>
           <button className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-emerald-600 transition-colors">
              <BookmarkSimple size={20} weight="bold" />
           </button>
        </div>
      </div>

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

      <CardContent className="p-6 space-y-5">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-zinc-50 tracking-tight leading-none flex items-center gap-2">
              {profile.name}
            </h2>
            <div className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
              <House size={14} />
              <Link href={profile.url} target="_blank" className="hover:text-emerald-500 underline-offset-4 hover:underline decoration-emerald-500/30">
                {new URL(profile.url).hostname}
              </Link>
            </div>
          </div>
          
          <Link 
            href={profile.url} 
            target="_blank" 
            className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-emerald-600 hover:text-white transition-all shadow-inner"
          >
            <ArrowSquareOut size={20} weight="bold" />
          </Link>
        </div>

        <div className="space-y-3">
          <p className="text-zinc-200 font-bold leading-snug">
            {profile.short_description}
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 font-medium">
            {profile.long_description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {profile.keywords.map((keyword, index) => (
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
