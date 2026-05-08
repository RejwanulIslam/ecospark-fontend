"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ideasApi } from "@/lib/api";
import Link from "next/link";
import { Plus, Edit, Trash2, Send, Eye, Clock, CheckCircle, XCircle, FileText, Lock } from "lucide-react";
import { Idea } from "@/types";
import { cn, timeAgo, STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUS_FILTERS = ["ALL", "DRAFT", "UNDER_REVIEW", "APPROVED", "REJECTED"];

export default function MyIdeasPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-ideas", statusFilter],
    queryFn: () => ideasApi.getMy({ status: statusFilter === "ALL" ? undefined : statusFilter, limit: 50 }).then((r) => r.data),
  });

  const ideas: Idea[] = data?.ideas ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ideasApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["my-ideas"] }); toast.success("Idea deleted"); },
    onError: () => toast.error("Cannot delete this idea"),
  });

  const submitMutation = useMutation({
    mutationFn: (id: string) => ideasApi.submitForReview(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["my-ideas"] }); toast.success("Idea submitted for review!"); },
    onError: () => toast.error("Failed to submit"),
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">My Ideas</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{data?.pagination?.total ?? 0} ideas total</p>
        </div>
        <Link href="/dashboard/ideas/new">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-colors btn-glow"
          >
            <Plus size={16} /> New Idea
          </motion.button>
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
              statusFilter === s
                ? "bg-primary-600 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300"
            )}
          >
            {s === "DRAFT" && <FileText size={11} />}
            {s === "UNDER_REVIEW" && <Clock size={11} />}
            {s === "APPROVED" && <CheckCircle size={11} />}
            {s === "REJECTED" && <XCircle size={11} />}
            {s === "ALL" ? "All Ideas" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 skeleton rounded-2xl" />
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🌱</div>
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">No ideas yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Share your first sustainability idea with the community!</p>
          <Link href="/dashboard/ideas/new">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 transition-colors">
              <Plus size={15} /> Create Your First Idea
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea, i) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5 hover:border-primary-300 dark:hover:border-primary-600/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", STATUS_COLORS[idea.status])}>
                      {STATUS_LABELS[idea.status]}
                    </span>
                    {idea.isPaid && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                        <Lock size={9} /> ${idea.price}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(idea.createdAt)}</span>
                  </div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-1">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {idea.category?.icon} {idea.category?.name} · {idea._count?.votes ?? 0} votes · {idea._count?.comments ?? 0} comments
                  </p>

                  {/* Rejection feedback */}
                  {idea.rejectionFeedback && (
                    <div className="mt-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50">
                      <p className="text-xs text-red-600 dark:text-red-400">
                        <span className="font-semibold">Feedback:</span> {idea.rejectionFeedback}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/ideas/${idea.slug}`}>
                    <button className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all" title="View">
                      <Eye size={14} />
                    </button>
                  </Link>

                  {(idea.status === "DRAFT" || idea.status === "REJECTED") && (
                    <>
                      <Link href={`/dashboard/ideas/edit/${idea.id}`}>
                        <button className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Edit">
                          <Edit size={14} />
                        </button>
                      </Link>
                      <button
                        onClick={() => submitMutation.mutate(idea.id)}
                        disabled={submitMutation.isPending}
                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                        title="Submit for Review"
                      >
                        <Send size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this idea?")) deleteMutation.mutate(idea.id);
                        }}
                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
