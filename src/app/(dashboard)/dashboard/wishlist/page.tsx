"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { bookmarkApi } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, Trash2, Eye, ThumbsUp, MessageCircle } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { Idea } from "@/types";
import toast from "react-hot-toast";

interface BookmarkItem {
  id: string;
  createdAt: string;
  idea: Idea;
}

export default function WishlistPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-bookmarks"],
    queryFn: () => bookmarkApi.getAll().then((r) => r.data.bookmarks as BookmarkItem[]),
  });

  const removeMutation = useMutation({
    mutationFn: (ideaId: string) => bookmarkApi.toggle(ideaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarked-ids"] });
      toast.success("Removed from Wishlist");
    },
    onError: () => {
      toast.error("Failed to remove bookmark");
    },
  });

  const bookmarks = data ?? [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
          </div>
          My Wishlist
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          {bookmarks.length} saved idea{bookmarks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-5">
            <Heart className="w-10 h-10 text-red-300 dark:text-red-800" />
          </div>
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-6 max-w-sm">
            Save ideas you love by clicking the heart icon on any idea card.
          </p>
          <Link href="/ideas">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 transition-colors shadow-md">
              Browse Ideas <ArrowRight size={15} />
            </button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {bookmarks.map((bookmark, i) => {
              const idea = bookmark.idea;
              return (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all group"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link href={`/ideas/${idea.slug}`} className="shrink-0">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {idea.images?.[0] ? (
                          <Image
                            src={idea.images[0]}
                            alt={idea.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            {idea.category?.icon ?? "🌿"}
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {/* Category */}
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span
                              className="px-2.5 py-0.5 rounded-lg text-xs font-semibold"
                              style={{
                                backgroundColor: (idea.category?.color ?? "#22c55e") + "22",
                                color: idea.category?.color ?? "#16a34a",
                              }}
                            >
                              {idea.category?.icon} {idea.category?.name}
                            </span>
                            {idea.isPaid && (
                              <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                ${idea.price}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <Link href={`/ideas/${idea.slug}`}>
                            <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                              {idea.title}
                            </h3>
                          </Link>

                          {/* Author + date */}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            by {idea.author?.name} · saved {timeAgo(bookmark.createdAt)}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            <span className="flex items-center gap-1">
                              <ThumbsUp size={12} /> {idea.upvotes ?? 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle size={12} /> {idea._count?.comments ?? 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={12} /> {idea.viewCount}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => removeMutation.mutate(idea.id)}
                            disabled={removeMutation.isPending}
                            className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            title="Remove from Wishlist"
                          >
                            <Trash2 size={15} />
                          </button>
                          <Link
                            href={`/ideas/${idea.slug}`}
                            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-all"
                          >
                            View <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
