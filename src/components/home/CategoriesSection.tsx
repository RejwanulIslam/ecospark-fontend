"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { Category } from "@/types";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CategoriesSection() {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll().then((r) => r.data.categories as Category[]),
  });

  return (
    <section className="py-24 bg-muted/10 eco-pattern relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionWrapper variant="slideUp" className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none px-4 py-1.5">
            <Layers size={14} className="mr-1.5" /> Browse by Category
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Sustainability Topics
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            From clean energy to zero-waste living — find ideas that match your passion.
          </p>
        </MotionWrapper>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {data?.map((cat, i) => (
            <MotionWrapper key={cat.id} variant="slideUp" delay={i * 0.05}>
              <Link href={`/ideas?category=${cat.slug}`}>
                <Card className="group flex flex-col items-center text-center p-6 hover:border-[var(--color-primary-400)] dark:hover:border-[var(--color-primary-500)] hover:shadow-xl hover:shadow-[var(--color-primary-500)]/10 transition-all duration-300 bg-background/80 backdrop-blur-sm h-full">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-sm"
                    style={{ backgroundColor: cat.color + "15" }}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm sm:text-base mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-auto">
                    {cat._count?.ideas ?? 0} ideas
                  </p>
                </Card>
              </Link>
            </MotionWrapper>
          ))}
        </div>

        <MotionWrapper variant="fade" delay={0.4} className="text-center mt-12">
          <Link href="/ideas">
            <Button variant="ghost" className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] font-semibold group hover:bg-[var(--color-primary-50)] dark:hover:bg-[var(--color-primary-950)]/50 rounded-full px-6">
              View all categories <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </MotionWrapper>
      </div>
    </section>
  );
}
