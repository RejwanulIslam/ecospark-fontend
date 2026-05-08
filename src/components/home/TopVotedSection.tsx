"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { ideasApi } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ThumbsUp, Crown, ArrowRight, Lock } from "lucide-react";
import { Idea } from "@/types";

const medals = ["🥇", "🥈", "🥉"];
const crownColors = ["text-yellow-500", "text-gray-400", "text-amber-700"];

export default function TopVotedSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data } = useQuery({
    queryKey: ["top-ideas"],
    queryFn: () => ideasApi.getTop().then((r) => r.data.ideas as Idea[]),
  });

  const topIdeas = data?.slice(0, 3) ?? [];

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-semibold mb-4">
            <Crown size={14} /> Community Favorites
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Top Voted Ideas This Month
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            These ideas earned the highest community votes. Be inspired and vote for your favorites!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topIdeas.map((idea, i) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative group bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/60 overflow-hidden hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-600/50 transition-all duration-300 card-hover"
            >
              {/* Medal */}
              <div className="absolute top-4 left-4 z-10 text-3xl drop-shadow-md">{medals[i]}</div>

              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-700">
                {idea.images?.[0] ? (
                  <Image src={idea.images[0]} alt={idea.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
                    {idea.category?.icon}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Votes badge */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-bold">
                  <ThumbsUp size={13} className={crownColors[i]} />
                  {(idea.upvotes ?? 0).toLocaleString()} votes
                </div>

                {idea.isPaid && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                    <Lock size={10} /> Paid
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div
                  className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold mb-3"
                  style={{ backgroundColor: (idea.category?.color ?? "#22c55e") + "22", color: idea.category?.color ?? "#16a34a" }}
                >
                  {idea.category?.icon} {idea.category?.name}
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                  {idea.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                  {idea.description}
                </p>
                <Link href={`/ideas/${idea.slug}`}>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors">
                    View Idea <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
