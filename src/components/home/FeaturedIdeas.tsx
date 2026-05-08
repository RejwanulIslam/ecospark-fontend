"use client";

import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { ideasApi } from "@/lib/api";
import IdeaCard from "@/components/ideas/IdeaCard";
import IdeaCardSkeleton from "@/components/ideas/IdeaCardSkeleton";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Idea } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

export default function FeaturedIdeas() {
  const { ref } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data, isLoading } = useQuery({
    queryKey: ["featured-ideas"],
    queryFn: () => ideasApi.getAll({ limit: 8, sortBy: "votes", order: "desc" }).then((r) => r.data),
  });

  const ideas: Idea[] = data?.ideas ?? [];

  return (
    <section ref={ref} className="py-20 bg-background relative overflow-hidden">
      {/* Background embellishments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary-500)]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionWrapper
          variant="slideUp"
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)]/30 dark:text-[var(--color-primary-400)] border-none">
              <Sparkles size={14} className="mr-1" /> Featured Ideas
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Top Community Ideas
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Discover highly-voted sustainability solutions from our community of innovators.
            </p>
          </div>
          <Link href="/ideas" className="shrink-0">
            <Button variant="outline" className="rounded-full shadow-sm group">
              View All <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </MotionWrapper>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <IdeaCardSkeleton key={i} />)
            : ideas.map((idea, i) => (
                <MotionWrapper key={idea.id} variant="slideUp" delay={i * 0.1}>
                  <IdeaCard idea={idea} index={i} />
                </MotionWrapper>
              ))}
        </div>
      </div>
    </section>
  );
}
