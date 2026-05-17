"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, MessageCircle, Eye, Lock, User, Heart, Share2, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Idea } from "@/types";
import { cn, timeAgo, truncate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bookmarkApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

interface IdeaCardProps {
  idea: Idea;
  index?: number;
  initialBookmarked?: boolean;
}

export default function IdeaCard({ idea, initialBookmarked = false }: IdeaCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(initialBookmarked);
  const [isSaving, setIsSaving] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsSaved(initialBookmarked);
  }, [initialBookmarked]);

  const hasMultipleImages = Boolean(idea.images && idea.images.length > 1);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (idea.images) {
      setCurrentImageIndex((prev) => (prev + 1) % idea.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (idea.images) {
      setCurrentImageIndex((prev) => (prev - 1 + idea.images.length) % idea.images.length);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to save ideas");
      return;
    }

    if (isSaving) return;
    setIsSaving(true);

    // Optimistic update
    const prev = isSaved;
    setIsSaved(!prev);

    try {
      const res = await bookmarkApi.toggle(idea.id);
      setIsSaved(res.data.bookmarked);
      toast.success(res.data.bookmarked ? "Added to Wishlist!" : "Removed from Wishlist!");
    } catch {
      setIsSaved(prev);
      toast.error("Failed to update wishlist");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/ideas/${idea.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Link href={`/ideas/${idea.slug}`} className="block h-full group outline-none">
      <Card className="relative flex flex-col h-full rounded-3xl overflow-hidden border border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/40 backdrop-blur-md shadow-lg shadow-gray-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-primary-500/15 hover:border-primary-500/40 dark:hover:border-primary-500/40 transition-all duration-300 hover:-translate-y-1.5">
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/0 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image Container */}
        <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
          {idea.images?.[currentImageIndex] ? (
            <Image
              src={idea.images[currentImageIndex]}
              alt={idea.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-primary-100 to-teal-100 dark:from-primary-900/40 dark:to-teal-900/40 group-hover:scale-105 transition-transform duration-700">
              {idea.category?.icon ?? "🌿"}
            </div>
          )}

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-70" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
            <Badge className="gap-1.5 backdrop-blur-md shadow-lg bg-white/20 hover:bg-white/30 text-white border border-white/30 py-1.5 px-3 rounded-xl font-bold tracking-wide">
              <span>{idea.category?.icon}</span>
              {idea.category?.name}
            </Badge>

            {idea.isPaid && (
              <Badge className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border-none py-1.5 px-3 rounded-xl font-bold">
                <Lock size={12} />
                {idea.price ? `$${idea.price}` : "Premium"}
              </Badge>
            )}
          </div>

          {/* Carousel Controls */}
          {hasMultipleImages && idea.images && (
            <div className="absolute inset-0 z-10 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={prevImage}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImage}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          
          {/* Dots */}
          {hasMultipleImages && idea.images && (
            <div className="absolute bottom-[4.5rem] left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {idea.images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    currentImageIndex === idx ? "bg-white w-4 shadow-sm" : "bg-white/40 w-1.5"
                  )}
                />
              ))}
            </div>
          )}

          {/* Author Info */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden shrink-0 border border-white/40 shadow-lg">
              {idea.author?.avatar ? (
                <Image src={idea.author.avatar} alt={idea.author.name} width={40} height={40} className="object-cover w-full h-full" />
              ) : (
                <User size={18} className="text-white drop-shadow-sm" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-white font-bold tracking-wide drop-shadow-md truncate max-w-[150px]">
                {idea.author?.name}
              </span>
              <span className="text-xs text-white/80 font-medium drop-shadow-md">{timeAgo(idea.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6 flex flex-col flex-1 relative z-10">
          <h3 className="font-display font-extrabold text-gray-900 dark:text-white text-[1.1rem] leading-snug mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {idea.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1 line-clamp-2 mb-6">
            {truncate(idea.description, 120)}
          </p>

          <div className="mt-auto space-y-4">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
              <div className={cn("flex items-center gap-1.5", (idea.upvotes ?? 0) > 0 && "text-primary-600 dark:text-primary-400")}>
                <ThumbsUp size={15} />
                <span>{idea.upvotes ?? 0}</span>
              </div>
              <div className={cn("flex items-center gap-1.5", (idea.downvotes ?? 0) > 0 && "text-red-500")}>
                <ThumbsDown size={15} />
                <span>{idea.downvotes ?? 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle size={15} />
                <span>{idea._count?.comments ?? 0}</span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                <Eye size={13} />
                <span>{idea.viewCount} views</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800/60">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm border",
                    isSaving && "opacity-50 cursor-not-allowed",
                    isSaved 
                      ? "bg-red-50 dark:bg-red-500/10 text-red-500 border-red-200 dark:border-red-900/50" 
                      : "bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:border-red-200 border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  )}
                  title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart size={16} className={cn(isSaved && "fill-current", isSaving && "animate-pulse")} />
                </button>
                <button 
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border border-gray-200 dark:border-gray-700 hover:border-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all shadow-sm"
                  title="Share Idea"
                >
                  <Share2 size={15} />
                </button>
              </div>

              {/* View Details hint */}
              <div className="text-sm font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                View Details <ChevronRightIcon size={16} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
