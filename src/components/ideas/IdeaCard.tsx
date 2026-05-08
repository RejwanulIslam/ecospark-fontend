"use client";

import Link from "next/link";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, MessageCircle, Eye, Lock, ArrowRight, User } from "lucide-react";
import { Idea } from "@/types";
import { cn, timeAgo, truncate } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface IdeaCardProps {
  idea: Idea;
  index?: number;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Card className="group overflow-hidden flex flex-col h-full border-border hover:border-[var(--color-primary-400)] dark:hover:border-[var(--color-primary-600)]/50 hover:shadow-xl hover:shadow-[var(--color-primary-500)]/10 transition-all duration-300 p-0 bg-card/80 backdrop-blur-sm">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted shrink-0 w-full">
        {idea.images?.[0] ? (
          <Image
            src={idea.images[0]}
            alt={idea.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gradient-to-br from-[var(--color-primary-100)] to-blue-100 dark:from-[var(--color-primary-900)]/30 dark:to-blue-900/30">
            {idea.category?.icon ?? "🌱"}
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 flex items-center">
          <Badge className="gap-1.5 backdrop-blur-md shadow-sm bg-black/40 hover:bg-black/60 text-white border-white/20">
            <span>{idea.category?.icon}</span>
            {idea.category?.name}
          </Badge>
        </div>

        {/* Paid badge */}
        {idea.isPaid && (
          <div className="absolute top-3 right-3 flex items-center">
            <Badge className="gap-1 bg-amber-500 hover:bg-amber-600 text-white shadow-sm border-none">
              <Lock size={10} />
              {idea.price ? `$${idea.price}` : "Paid"}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-5 flex flex-col flex-1">
        {/* Author + date */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/30 flex items-center justify-center overflow-hidden shrink-0 border border-border">
            {idea.author?.avatar ? (
              <Image src={idea.author.avatar} alt={idea.author.name} width={24} height={24} className="object-cover" />
            ) : (
              <User size={12} className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]" />
            )}
          </div>
          <span className="text-xs text-muted-foreground font-medium truncate">
            {idea.author?.name}
          </span>
          <span className="text-border">·</span>
          <span className="text-xs text-muted-foreground shrink-0">{timeAgo(idea.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-foreground text-lg leading-snug mb-2 group-hover:text-[var(--color-primary-600)] dark:group-hover:text-[var(--color-primary-400)] transition-colors line-clamp-2">
          {idea.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-2">
          {truncate(idea.description, 120)}
        </p>
      </CardContent>

      {/* Stats + CTA */}
      <CardFooter className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-border/50 bg-muted/10">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-4">
          <span className={cn("flex items-center gap-1", (idea.upvotes ?? 0) > 0 && "text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] font-medium")}>
            <ThumbsUp size={13} />
            {idea.upvotes ?? 0}
          </span>
          <span className={cn("flex items-center gap-1", (idea.downvotes ?? 0) > 0 && "text-destructive font-medium")}>
            <ThumbsDown size={13} />
            {idea.downvotes ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={13} />
            {idea._count?.comments ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={13} />
            {idea.viewCount}
          </span>
        </div>

        <div className="mt-4">
          <Link href={`/ideas/${idea.slug}`}>
            <Button size="sm" className="rounded-full shadow-sm group-hover:shadow-md transition-all gap-1.5">
              View <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
