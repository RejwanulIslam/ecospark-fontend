"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { CheckCircle, XCircle, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { cn, timeAgo, STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";

const STATUS_TABS = ["ALL", "UNDER_REVIEW", "APPROVED", "REJECTED", "DRAFT"];

export default function AdminIdeasPage() {
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-ideas", status, search, page],
    queryFn: () =>
      adminApi
        .getIdeas({ status: status === "ALL" ? undefined : status, search: search || undefined, page, limit: 10 })
        .then((r) => r.data),
  });

  const ideas = data?.ideas ?? [];
  const pagination = data?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 1 };

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.approveIdea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ideas"] });
      toast.success("Idea approved!");
    },
    onError: () => toast.error("Failed to approve"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, fb }: { id: string; fb: string }) => adminApi.rejectIdea(id, fb),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ideas"] });
      toast.success("Idea rejected with feedback");
      setRejectId(null);
      setFeedback("");
    },
    onError: () => toast.error("Failed to reject"),
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Manage Ideas</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Review, approve, or reject community ideas
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
              status === s
                ? "bg-primary-600 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            )}
          >
            {s === "ALL" ? "All Ideas" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Ideas table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 skeleton rounded-2xl" />
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-display text-lg font-bold text-gray-900 dark:text-white">No ideas found</p>
          <p className="text-gray-400 text-sm mt-1">Try a different filter or search term</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea: Record<string, unknown>, i: number) => (
            <motion.div
              key={idea.id as string}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Image */}
                {((idea.images as string[])?.length ?? 0) > 0 && (
                  <div className="relative w-full sm:w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                    <Image
                      src={(idea.images as string[])[0]}
                      alt={idea.title as string}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", STATUS_COLORS[idea.status as string])}>
                      {STATUS_LABELS[idea.status as string]}
                    </span>
                    <span className="text-xs text-gray-400">
                      by{" "}
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        {(idea.author as Record<string, string>)?.name}
                      </span>
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(idea.createdAt as string)}</span>
                  </div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-1">
                    {idea.title as string}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                    {(idea.category as Record<string, string>)?.icon}{" "}
                    {(idea.category as Record<string, string>)?.name} ·{" "}
                    {((idea._count as Record<string, number>)?.votes ?? 0)} votes ·{" "}
                    {((idea._count as Record<string, number>)?.comments ?? 0)} comments
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/ideas/${idea.slug as string}`} target="_blank">
                    <button className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all" title="View">
                      <Eye size={14} />
                    </button>
                  </Link>

                  {idea.status === "UNDER_REVIEW" && (
                    <>
                      <button
                        onClick={() => approveMutation.mutate(idea.id as string)}
                        disabled={approveMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-700/50 text-xs font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors disabled:opacity-50"
                        title="Approve"
                      >
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button
                        onClick={() => setRejectId(idea.id as string)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700/50 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Reject"
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Rejection feedback form */}
              {rejectId === idea.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800"
                >
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Provide rejection feedback (visible to author only):
                  </p>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Explain why this idea is being rejected and how it can be improved..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => rejectMutation.mutate({ id: idea.id as string, fb: feedback })}
                      disabled={!feedback.trim() || rejectMutation.isPending}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      {rejectMutation.isPending ? "Rejecting..." : "Confirm Reject"}
                    </button>
                    <button
                      onClick={() => { setRejectId(null); setFeedback(""); }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(page - 1) * pagination.limit + 1}–{Math.min(page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-40 hover:border-primary-400 transition-all"
            >
              <ChevronLeft size={15} /> Prev
            </button>
            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={page === pagination.totalPages}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-40 hover:border-primary-400 transition-all"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
