"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { ideasApi, categoriesApi, bookmarkApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import IdeaCard from "@/components/ideas/IdeaCard";
import IdeaCardSkeleton from "@/components/ideas/IdeaCardSkeleton";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Category, Idea, PaginationMeta } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

const SORT_OPTIONS = [
  { value: "createdAt", label: "Most Recent" },
  { value: "votes", label: "Top Voted" },
  { value: "comments", label: "Most Discussed" },
  { value: "viewCount", label: "Most Viewed" },
];

function IdeasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") ?? "createdAt");
  const [isPaid, setIsPaid] = useState(searchParams.get("isPaid") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll().then((r) => r.data.categories as Category[]),
  });

  const { isAuthenticated } = useAuthStore();

  const { data: bookmarkedIdsData } = useQuery({
    queryKey: ["bookmarked-ids"],
    queryFn: () => bookmarkApi.getIds().then((r) => r.data.ideaIds as string[]),
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const bookmarkedIds = new Set(bookmarkedIdsData ?? []);

  const queryParams = {
    page, limit: 12, search: search || undefined, category: category || undefined,
    sortBy, order: "desc", isPaid: isPaid || undefined,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["ideas", queryParams],
    queryFn: () => ideasApi.getAll(queryParams).then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const ideas: Idea[] = data?.ideas ?? [];
  const pagination: PaginationMeta = data?.pagination ?? { total: 0, page: 1, limit: 12, totalPages: 1 };

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sortBy !== "createdAt") params.set("sortBy", sortBy);
    if (isPaid) params.set("isPaid", isPaid);
    if (page > 1) params.set("page", String(page));
    router.replace(`/ideas?${params.toString()}`, { scroll: false });
  }, [search, category, sortBy, isPaid, page, router]);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleCategory = (v: string) => { setCategory(v === category ? "" : v); setPage(1); };
  const clearFilters = () => { setSearch(""); setCategory(""); setIsPaid(""); setSortBy("createdAt"); setPage(1); };

  const hasActiveFilters = search || category || isPaid || sortBy !== "createdAt";

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Header */}
      <div className="bg-card border-b border-border relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[var(--color-primary-500)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative z-10">
          <MotionWrapper variant="slideUp" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight">
                Sustainability Ideas
              </h1>
              <p className="text-muted-foreground text-base mt-2">
                Discover, share, and vote on <span className="font-semibold text-foreground">{pagination.total}</span> community ideas
              </p>
            </div>

            {/* Sort */}
            <div className="shrink-0 flex items-center gap-3">
              <label className="text-sm font-medium text-muted-foreground hidden sm:block">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] shadow-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </MotionWrapper>

          {/* Search + Filter bar */}
          <MotionWrapper variant="slideUp" delay={0.1} className="flex flex-wrap gap-3 mt-8">
            <div className="relative flex-1 min-w-[280px]">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search ideas by title, description..."
                className="w-full pl-11 pr-4 py-6 rounded-full border-border bg-background text-foreground placeholder:text-muted-foreground text-base shadow-sm"
              />
            </div>
            <Button
              size="lg"
              variant={showFilters || hasActiveFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full px-6 py-6 border-border shadow-sm gap-2"
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:block">Filters</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-white ml-1 animate-pulse" />}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="destructive"
                size="lg"
                onClick={clearFilters}
                className="rounded-full px-6 py-6 shadow-sm gap-2"
              >
                <X size={16} /> Clear
              </Button>
            )}
          </MotionWrapper>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-6 flex flex-wrap gap-4">
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-semibold text-muted-foreground mr-2">Category:</span>
                    {categoriesData?.map((cat) => (
                      <Badge
                        key={cat.id}
                        variant={category === cat.slug ? "default" : "secondary"}
                        className={cn(
                          "cursor-pointer px-3 py-1.5 text-xs font-medium hover:opacity-80 transition-opacity",
                          category === cat.slug ? "shadow-md" : "hover:bg-muted"
                        )}
                        onClick={() => handleCategory(cat.slug)}
                      >
                        <span className="mr-1.5">{cat.icon}</span> {cat.name}
                      </Badge>
                    ))}
                  </div>

                  {/* Free / Paid */}
                  <div className="flex gap-2 items-center w-full sm:w-auto sm:border-l sm:border-border sm:pl-4">
                    <span className="text-sm font-semibold text-muted-foreground mr-2">Type:</span>
                    <Badge
                      variant={isPaid === "false" ? "default" : "secondary"}
                      className="cursor-pointer px-3 py-1.5"
                      onClick={() => { setIsPaid(isPaid === "false" ? "" : "false"); setPage(1); }}
                    >
                      Free
                    </Badge>
                    <Badge
                      variant={isPaid === "true" ? "default" : "secondary"}
                      className="cursor-pointer px-3 py-1.5"
                      onClick={() => { setIsPaid(isPaid === "true" ? "" : "true"); setPage(1); }}
                    >
                      Premium
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative">
        {/* Loading overlay for refetching */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[2px] rounded-xl flex items-start justify-center pt-20">
            <div className="w-10 h-10 border-4 border-[var(--color-primary-500)] border-t-transparent rounded-full animate-spin shadow-lg" />
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <IdeaCardSkeleton key={i} />)}
          </div>
        ) : ideas.length === 0 ? (
          <MotionWrapper variant="scaleIn" className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center text-4xl">
              🔍
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">No ideas found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn&apos;t find any ideas matching your current filters. Try adjusting your search criteria or clearing filters.
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} className="mt-6 rounded-full px-8 py-6">
                Clear All Filters
              </Button>
            )}
          </MotionWrapper>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {ideas.map((idea, i) => (
                <MotionWrapper key={idea.id} variant="slideUp" delay={i * 0.05} layout>
                  <IdeaCard idea={idea} initialBookmarked={bookmarkedIds.has(idea.id)} />
                </MotionWrapper>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <MotionWrapper variant="fade" className="flex items-center justify-center gap-2 mt-16">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="rounded-full"
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let p = page;
                if (page <= 3) p = i + 1;
                else if (page >= pagination.totalPages - 2) p = pagination.totalPages - 4 + i;
                else p = page - 2 + i;
                
                if (p < 1 || p > pagination.totalPages) return null;

                return (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "ghost"}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={cn("w-10 h-10 rounded-full p-0", page === p && "shadow-md")}
                  >
                    {p}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              disabled={page === pagination.totalPages}
              onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="rounded-full"
            >
              Next
            </Button>
          </MotionWrapper>
        )}
      </div>
    </div>
  );
}

import React, { Suspense } from "react";
export default function IdeasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-[var(--color-primary-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <IdeasContent />
    </Suspense>
  );
}
