"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { paymentApi } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, CheckCircle } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function PurchasesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-purchases"],
    queryFn: () => paymentApi.getMyPurchases().then((r) => r.data),
  });

  const purchases = data?.purchases ?? [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">My Purchases</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {purchases.length} purchased idea{purchases.length !== 1 ? "s" : ""}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 skeleton rounded-2xl" />
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">No purchases yet</h3>
          <p className="text-gray-400 dark:text-gray-500 mb-6 max-w-sm">
            Discover premium sustainability ideas from our community.
          </p>
          <Link href="/ideas?isPaid=true">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 transition-colors">
              Browse Premium Ideas <ArrowRight size={15} />
            </button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {purchases.map((p: Record<string, unknown>, i: number) => {
            const idea = p.idea as Record<string, unknown>;
            const category = idea?.category as Record<string, string> | undefined;
            const images = idea?.images as string[] | undefined;
            const author = idea?.author as Record<string, string> | undefined;
            return (
              <motion.div
                key={p.id as string}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                    {images?.[0] ? (
                      <Image src={images[0]} alt={idea?.title as string} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {category?.icon}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: (category?.color ?? "#22c55e") + "22", color: category?.color ?? "#16a34a" }}
                          >
                            {category?.icon} {category?.name}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-semibold">
                            <CheckCircle size={11} /> Purchased
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-1">
                          {idea?.title as string}
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          by {author?.name} · {formatDate(p.createdAt as string)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(p.amount as number)}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">paid</p>
                      </div>
                    </div>

                    <Link
                      href={`/ideas/${idea?.slug as string}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                    >
                      View Full Idea <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
