"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ThumbsUp, ThumbsDown, MessageCircle, Eye, Lock, ArrowLeft,
  Calendar, User, Tag, Share2, CheckCircle, XCircle, Clock
} from "lucide-react";
import { ideasApi, votesApi, commentsApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { cn, timeAgo, formatDate, STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";
import { Comment } from "@/types";
import toast from "react-hot-toast";
import PaymentModal from "@/components/ideas/PaymentModal";

export default function IdeaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["idea", slug],
    queryFn: () => ideasApi.getBySlug(slug).then((r) => r.data.idea),
  });

  const { data: commentsData, refetch: refetchComments } = useQuery({
    queryKey: ["comments", data?.id],
    queryFn: () => commentsApi.getByIdea(data!.id).then((r) => r.data.comments as Comment[]),
    enabled: !!data?.id,
  });

  const voteMutation = useMutation({
    mutationFn: (type: "UPVOTE" | "DOWNVOTE") => votesApi.vote(data!.id, type),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["idea", slug] }),
    onError: () => toast.error("Failed to vote"),
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) =>
      commentsApi.create(data!.id, { content, parentId: replyTo?.id }),
    onSuccess: () => {
      setComment("");
      setReplyTo(null);
      refetchComments();
      toast.success("Comment posted!");
    },
    onError: () => toast.error("Failed to post comment"),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => commentsApi.delete(id),
    onSuccess: () => { refetchComments(); toast.success("Comment deleted"); },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading idea...</p>
        </div>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 flex flex-col items-center justify-center gap-4">
      <div className="text-5xl">🌿</div>
      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Idea not found</h2>
      <Link href="/ideas" className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium">
        <ArrowLeft size={16} /> Back to ideas
      </Link>
    </div>
  );

  const isLocked = data.isPaidAndLocked;
  const isAuthor = user?.id === data.author?.id;
  const isAdmin = user?.role === "ADMIN";
  const canVote = isAuthenticated && data.status === "APPROVED";

  const handleVote = (type: "UPVOTE" | "DOWNVOTE") => {
    if (!isAuthenticated) { toast.error("Login to vote"); router.push("/auth/login"); return; }
    voteMutation.mutate(type);
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    commentMutation.mutate(comment);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Ideas
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 overflow-hidden"
            >
              {/* Image gallery */}
              {data.images?.length > 0 && (
                <div className="relative">
                  <div className="relative h-72 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image src={data.images[activeImage]} alt={data.title} fill className="object-cover" />
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                        <Lock className="w-12 h-12 text-white/80" />
                        <p className="text-white font-semibold text-lg">Premium Idea</p>
                        <p className="text-white/70 text-sm">Purchase to view full content</p>
                        <button
                          onClick={() => isAuthenticated ? setShowPayment(true) : router.push("/auth/login")}
                          className="mt-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors"
                        >
                          <Lock size={16} /> Unlock for ${data.price}
                        </button>
                      </div>
                    )}
                  </div>
                  {data.images.length > 1 && (
                    <div className="flex gap-2 p-3 overflow-x-auto">
                      {data.images.map((img: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={cn(
                            "relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all",
                            activeImage === i ? "border-primary-500" : "border-transparent"
                          )}
                        >
                          <Image src={img} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", STATUS_COLORS[data.status])}>
                    {data.status === "APPROVED" ? <CheckCircle size={11} className="inline mr-1" /> :
                      data.status === "REJECTED" ? <XCircle size={11} className="inline mr-1" /> :
                        <Clock size={11} className="inline mr-1" />}
                    {STATUS_LABELS[data.status]}
                  </span>
                  {data.category && (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: (data.category.color ?? "#22c55e") + "22", color: data.category.color ?? "#16a34a" }}
                    >
                      {data.category.icon} {data.category.name}
                    </span>
                  )}
                  {data.isPaid && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 flex items-center gap-1">
                      <Lock size={10} /> ${data.price}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-snug">
                  {data.title}
                </h1>

                {/* Rejection feedback */}
                {data.rejectionFeedback && isAuthor && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 mb-4">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Admin Feedback:</p>
                    <p className="text-sm text-red-600 dark:text-red-300">{data.rejectionFeedback}</p>
                  </div>
                )}

                {/* Problem + Solution */}
                {!isLocked && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30">
                      <h3 className="font-semibold text-red-700 dark:text-red-400 text-sm mb-2 flex items-center gap-1.5">
                        <span className="text-base">⚠️</span> Problem Statement
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{data.problemStatement}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30">
                      <h3 className="font-semibold text-primary-700 dark:text-primary-400 text-sm mb-2 flex items-center gap-1.5">
                        <span className="text-base">💡</span> Proposed Solution
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{data.proposedSolution}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Full Description</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{data.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Comments Section */}
            {!isLocked && data.status === "APPROVED" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-6"
              >
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-5 flex items-center gap-2">
                  <MessageCircle size={20} className="text-primary-500" />
                  Discussion ({commentsData?.length ?? 0})
                </h3>

                {/* Comment input */}
                {isAuthenticated && (
                  <div className="mb-6">
                    {replyTo && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-primary-600 dark:text-primary-400 font-medium">
                        Replying to {replyTo.name}
                        <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-gray-600">
                          <XCircle size={13} />
                        </button>
                      </div>
                    )}
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={replyTo ? `Reply to ${replyTo.name}...` : "Share your thoughts..."}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleComment}
                        disabled={!comment.trim() || commentMutation.isPending}
                        className="px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        {commentMutation.isPending ? "Posting..." : "Post Comment"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Comments list */}
                <div className="space-y-4">
                  {commentsData?.map((c) => (
                    <CommentItem
                      key={c.id}
                      comment={c}
                      userId={user?.id}
                      isAdmin={isAdmin}
                      onReply={(id, name) => setReplyTo({ id, name })}
                      onDelete={(id) => deleteCommentMutation.mutate(id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Voting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Community Vote</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleVote("UPVOTE")}
                  disabled={!canVote || voteMutation.isPending}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition-all font-semibold text-sm",
                    data.userVote === "UPVOTE"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary-300 text-gray-600 dark:text-gray-400"
                  )}
                >
                  <ThumbsUp size={22} />
                  <span>{data.upvotes ?? 0}</span>
                  <span className="text-xs">Upvote</span>
                </button>
                <button
                  onClick={() => handleVote("DOWNVOTE")}
                  disabled={!canVote || voteMutation.isPending}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition-all font-semibold text-sm",
                    data.userVote === "DOWNVOTE"
                      ? "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                      : "border-gray-200 dark:border-gray-700 hover:border-red-300 text-gray-600 dark:text-gray-400"
                  )}
                >
                  <ThumbsDown size={22} />
                  <span>{data.downvotes ?? 0}</span>
                  <span className="text-xs">Downvote</span>
                </button>
              </div>
              {!isAuthenticated && (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
                  <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 font-medium">Login</Link> to vote
                </p>
              )}
            </motion.div>

            {/* Author info */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-1.5">
                <User size={15} /> Author
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary-100 dark:bg-primary-900/20 shrink-0">
                  {data.author?.avatar ? (
                    <Image src={data.author.avatar} alt={data.author.name} width={48} height={48} className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-600 font-bold text-lg">
                      {data.author?.name?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{data.author?.name}</p>
                  {data.author?.bio && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-2">{data.author.bio}</p>}
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Details</h3>
              {[
                { icon: Calendar, label: "Submitted", value: formatDate(data.createdAt) },
                { icon: Eye, label: "Views", value: data.viewCount.toLocaleString() },
                { icon: MessageCircle, label: "Comments", value: (data._count?.comments ?? 0).toString() },
                { icon: Tag, label: "Category", value: `${data.category?.icon} ${data.category?.name}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Icon size={14} /> {label}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5">
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
              >
                <Share2 size={15} /> Share Idea
              </button>
            </div>

            {/* Admin actions */}
            {isAdmin && data.status === "UNDER_REVIEW" && (
              <AdminActions ideaId={data.id} slug={slug} />
            )}
          </div>
        </div>
      </div>

      {/* Payment modal */}
      <AnimatePresence>
        {showPayment && (
          <PaymentModal
            idea={data}
            onClose={() => setShowPayment(false)}
            onSuccess={() => { setShowPayment(false); queryClient.invalidateQueries({ queryKey: ["idea", slug] }); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CommentItem({ comment, userId, isAdmin, onReply, onDelete }: {
  comment: Comment;
  userId?: string;
  isAdmin?: boolean;
  onReply: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center shrink-0 text-primary-600 font-bold text-xs overflow-hidden">
        {comment.user.avatar ? (
          <Image src={comment.user.avatar} alt={comment.user.name} width={32} height={32} className="object-cover" />
        ) : comment.user.name[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900 dark:text-white text-xs">{comment.user.name}</span>
          <span className="text-gray-400 text-xs">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{comment.content}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <button
            onClick={() => onReply(comment.id, comment.user.name)}
            className="text-xs text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
          >
            Reply
          </button>
          {(userId === comment.user.id || isAdmin) && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              Delete
            </button>
          )}
        </div>
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 ml-4 space-y-3 border-l-2 border-gray-100 dark:border-gray-700 pl-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} userId={userId} isAdmin={isAdmin} onReply={onReply} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminActions({ ideaId, slug }: { ideaId: string; slug: string }) {
  const [feedback, setFeedback] = useState("");
  const [showReject, setShowReject] = useState(false);
  const queryClient = useQueryClient();
  const { adminApi } = // eslint-disable-next-line @typescript-eslint/no-require-imports
require("@/lib/api");

  const approveMutation = useMutation({
    mutationFn: () => adminApi.approveIdea(ideaId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["idea", slug] }); toast.success("Idea approved!"); },
  });

  const rejectMutation = useMutation({
    mutationFn: () => adminApi.rejectIdea(ideaId, feedback),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["idea", slug] }); toast.success("Idea rejected"); setShowReject(false); },
  });

  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-700/50 p-5">
      <h3 className="font-semibold text-purple-800 dark:text-purple-300 text-sm mb-3">Admin Actions</h3>
      <div className="flex gap-2">
        <button
          onClick={() => approveMutation.mutate()}
          disabled={approveMutation.isPending}
          className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition-colors"
        >
          ✓ Approve
        </button>
        <button
          onClick={() => setShowReject(!showReject)}
          className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors"
        >
          ✗ Reject
        </button>
      </div>
      {showReject && (
        <div className="mt-3">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Rejection reason (required)..."
            rows={3}
            className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
          />
          <button
            onClick={() => rejectMutation.mutate()}
            disabled={!feedback.trim() || rejectMutation.isPending}
            className="w-full mt-2 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Confirm Reject
          </button>
        </div>
      )}
    </div>
  );
}
