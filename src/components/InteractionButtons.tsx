'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleLike, toggleBookmark } from '@/app/actions/interactions';
import { Star, BookmarkSimple } from '@phosphor-icons/react/dist/ssr';

interface InteractionButtonsProps {
  profileId: string;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  isAuthenticated: boolean;
  className?: string; // Additional classes for positioning/sizing if needed
}

export function InteractionButtons({ 
  profileId, 
  initialLiked = false, 
  initialBookmarked = false,
  isAuthenticated,
  className = ""
}: InteractionButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/join');
      return;
    }

    // Optimistic UI update
    const previousState = isLiked;
    setIsLiked(!isLiked);

    startTransition(async () => {
      try {
        const result = await toggleLike(profileId);
        if (result.error) {
          // Revert on error
          setIsLiked(previousState);
          console.error(result.error);
        }
      } catch (err) {
        setIsLiked(previousState);
      }
    });
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/join');
      return;
    }

    // Optimistic UI update
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);

    startTransition(async () => {
      try {
        const result = await toggleBookmark(profileId);
        if (result.error) {
          // Revert on error
          setIsBookmarked(previousState);
          console.error(result.error);
        }
      } catch (err) {
        setIsBookmarked(previousState);
      }
    });
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button 
        onClick={handleLike}
        disabled={isPending}
        className={`p-2.5 rounded-full backdrop-blur-md transition-colors shadow-sm
          ${isLiked 
            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
            : 'bg-black/60 text-white hover:bg-emerald-600'
          }`}
        aria-label={isLiked ? "Unlike profile" : "Like profile"}
      >
        <Star size={20} weight={isLiked ? "fill" : "bold"} />
      </button>
      
      <button 
        onClick={handleBookmark}
        disabled={isPending}
        className={`p-2.5 rounded-full backdrop-blur-md transition-colors shadow-sm
          ${isBookmarked 
            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
            : 'bg-black/60 text-white hover:bg-emerald-600'
          }`}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark profile"}
      >
        <BookmarkSimple size={20} weight={isBookmarked ? "fill" : "bold"} />
      </button>
    </div>
  );
}
