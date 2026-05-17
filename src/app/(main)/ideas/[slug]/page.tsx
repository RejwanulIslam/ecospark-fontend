"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ThumbsUp, ThumbsDown, MessageCircle, Eye, Lock, ArrowLeft,
  Calendar, User, Tag, Share2, CheckCircle, XCircle, Clock, Info, ShieldCheck, Flag
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
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">Loading idea details...</p>
        </div>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-24 flex flex-col items-center justify-center gap-6">
      <div className="w-24 h-24 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-5xl shadow-inner">
        🌿
      </div>
      <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Idea not found</h2>
      <button onClick={() => router.back()} className="px-6 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
        <ArrowLeft size={16} /> Go Back
      </button>
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
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pt-24 pb-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-semibold mb-8 transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:scale-105 group-hover:shadow-sm transition-all">
            <ArrowLeft size={14} />
          </span>
          Back to Ideas
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header & Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-gray-700/30 overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none"
            >
              {/* Image gallery */}
              {data.images?.length > 0 && (
                <div className="relative group">
                  <div className="relative h-80 sm:h-[400px] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image 
                      src={data.images[activeImage]} 
                      alt={data.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-display font-bold text-2xl">Premium Content</p>
                          <p className="text-white/70 text-sm mt-1">Purchase to view the full idea and details</p>
                        </div>
                        <button
                          onClick={() => isAuthenticated ? setShowPayment(true) : router.push("/auth/login")}
                          className="mt-4 px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                        >
                          <Lock size={16} /> Unlock for ${data.price}
                        </button>
                      </div>
                    )}
                  </div>
                  {data.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-2xl">
                      {data.images.map((img: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={cn(
                            "relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all hover:opacity-100",
                            activeImage === i ? "border-white opacity-100 scale-110 shadow-lg" : "border-transparent opacity-60"
                          )}
                        >
                          <Image src={img} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className={cn("p-8 sm:p-10", !data.images?.length && "pt-10")}>
                {/* Badges */}
                <div className="flex flex-wrap gap-2.5 mb-6">
                  <span className={cn("px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5", STATUS_COLORS[data.status].replace("text-", "text-").replace("bg-", "bg-opacity-20 bg-"))}>
                    {data.status === "APPROVED" ? <CheckCircle size={14} /> :
                      data.status === "REJECTED" ? <XCircle size={14} /> :
                        <Clock size={14} />}
                    {STATUS_LABELS[data.status]}
                  </span>
                  {data.category && (
                    <span
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-sm"
                      style={{ backgroundColor: (data.category.color ?? "#22c55e") + "15", color: data.category.color ?? "#16a34a", border: `1px solid ${(data.category.color ?? "#22c55e")}30` }}
                    >
                      {data.category.icon} {data.category.name}
                    </span>
                  )}
                  {data.isPaid && (
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center gap-1.5 shadow-sm">
                      <Lock size={12} /> Premium · ${data.price}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                  {data.title}
                </h1>

                {/* Rejection feedback */}
                {data.rejectionFeedback && isAuthor && (
                  <div className="p-5 rounded-2xl bg-red-50/80 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 mb-8 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                      <Flag className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-800 dark:text-red-300 mb-1">Admin Feedback</h4>
                      <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">{data.rejectionFeedback}</p>
                    </div>
                  </div>
                )}

                {/* Problem + Solution */}
                {!isLocked && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                        <h3 className="font-display font-bold text-red-800 dark:text-red-400 text-lg mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-sm">⚠️</span> 
                          The Problem
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed relative z-10">{data.problemStatement}</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-100 dark:border-emerald-900/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                        <h3 className="font-display font-bold text-emerald-800 dark:text-emerald-400 text-lg mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-sm">💡</span> 
                          The Solution
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed relative z-10">{data.proposedSolution}</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800/60">
                      <h3 className="font-display font-bold text-gray-900 dark:text-white text-xl mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary-500" /> Full Description
                      </h3>
                      <div className="prose prose-gray dark:prose-invert max-w-none prose-p:leading-loose prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:text-[15px]">
                        {data.description.split('\n').map((paragraph: string, idx: number) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>
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
                className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-gray-700/30 p-8 sm:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                      <MessageCircle size={20} />
                    </span>
                    Discussion
                  </h3>
                  <span className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold text-sm">
                    {commentsData?.length ?? 0} Comments
                  </span>
                </div>

                {/* Comment input */}
                {isAuthenticated ? (
                  <div className="mb-10 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-teal-400 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      {replyTo && (
                        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-xs text-primary-700 dark:text-primary-400 font-semibold border border-primary-100 dark:border-primary-500/20">
                          Replying to {replyTo.name}
                          <button onClick={() => setReplyTo(null)} className="hover:text-primary-900 dark:hover:text-primary-200 bg-white/50 dark:bg-black/20 rounded-full p-0.5">
                            <XCircle size={14} />
                          </button>
                        </div>
                      )}
                      <div className="relative">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your thoughts or ask a question..."
                          rows={3}
                          className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 resize-none transition-all shadow-sm"
                        />
                        <div className="absolute bottom-3 right-3">
                          <button
                            onClick={handleComment}
                            disabled={!comment.trim() || commentMutation.isPending}
                            className="px-6 py-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-md disabled:shadow-none"
                          >
                            {commentMutation.isPending ? "Posting..." : "Post"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-10 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Join the conversation to share your thoughts.</p>
                    <Link href="/auth/login">
                      <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-sm">
                        Log In to Comment
                      </button>
                    </Link>
                  </div>
                )}

                {/* Comments list */}
                <div className="space-y-6">
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
          <div className="lg:col-span-4 space-y-6">
            {/* Voting */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-gray-700/30 p-6 shadow-xl shadow-gray-200/50 dark:shadow-none"
            >
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-5 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary-500" /> Community Vote
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleVote("UPVOTE")}
                  disabled={!canVote || voteMutation.isPending}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 transition-all font-bold group",
                    data.userVote === "UPVOTE"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-inner"
                      : "border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:border-primary-200 dark:hover:border-primary-800 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800"
                  )}
                >
                  <ThumbsUp className={cn("w-7 h-7 transition-transform group-hover:-translate-y-1 group-active:scale-95", data.userVote === "UPVOTE" && "fill-current")} />
                  <span className="text-xl">{data.upvotes ?? 0}</span>
                </button>
                <button
                  onClick={() => handleVote("DOWNVOTE")}
                  disabled={!canVote || voteMutation.isPending}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 transition-all font-bold group",
                    data.userVote === "DOWNVOTE"
                      ? "border-red-400 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 shadow-inner"
                      : "border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:border-red-200 dark:hover:border-red-900/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800"
                  )}
                >
                  <ThumbsDown className={cn("w-7 h-7 transition-transform group-hover:translate-y-1 group-active:scale-95", data.userVote === "DOWNVOTE" && "fill-current")} />
                  <span className="text-xl">{data.downvotes ?? 0}</span>
                </button>
              </div>
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4 bg-gray-50 dark:bg-gray-800/50 py-2 rounded-lg">
                  <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Login</Link> to vote
                </p>
              )}
            </motion.div>

            {/* Author info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-gray-700/30 p-6 shadow-xl shadow-gray-200/50 dark:shadow-none"
            >
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" /> Author
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-primary-100 to-teal-100 dark:from-primary-900/30 dark:to-teal-900/30 shrink-0 border border-white/50 dark:border-white/5 shadow-sm">
                  {data.author?.avatar ? (
                    <Image src={data.author.avatar} alt={data.author.name} width={56} height={56} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl">
                      {data.author?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-base">{data.author?.name}</p>
                  {data.author?.bio && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-snug">{data.author.bio}</p>}
                </div>
              </div>
            </motion.div>

            {/* Meta */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-gray-700/30 p-6 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-4"
            >
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-2">Details</h3>
              <div className="space-y-1">
                {[
                  { icon: Calendar, label: "Submitted", value: formatDate(data.createdAt) },
                  { icon: Eye, label: "Views", value: data.viewCount.toLocaleString() },
                  { icon: MessageCircle, label: "Comments", value: (data._count?.comments ?? 0).toString() },
                  { icon: Tag, label: "Category", value: `${data.category?.icon} ${data.category?.name}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                    <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                      <Icon size={15} /> {label}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Share */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-gray-700/30 p-6 shadow-xl shadow-gray-200/50 dark:shadow-none"
            >
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700/80 hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-sm"
              >
                <Share2 size={16} /> Share Idea
              </button>
            </motion.div>

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
    <div className="flex gap-4 group">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shrink-0 text-gray-600 dark:text-gray-300 font-bold text-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        {comment.user.avatar ? (
          <Image src={comment.user.avatar} alt={comment.user.name} width={40} height={40} className="object-cover w-full h-full" />
        ) : comment.user.name[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0 bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800/50 relative">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-white text-sm">{comment.user.name}</span>
            {(comment.user as any).role === "ADMIN" && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">ADMIN</span>}
          </div>
          <span className="text-gray-400 text-xs font-medium">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed">{comment.content}</p>
        
        <div className="flex items-center gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onReply(comment.id, comment.user.name)}
            className="text-xs text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-bold flex items-center gap-1"
          >
            Reply
          </button>
          {(userId === comment.user.id || isAdmin) && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors font-bold flex items-center gap-1"
            >
              Delete
            </button>
          )}
        </div>
        
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-4">
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
  const { adminApi } = require("@/lib/api");

  const approveMutation = useMutation({
    mutationFn: () => adminApi.approveIdea(ideaId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["idea", slug] }); toast.success("Idea approved!"); },
  });

  const rejectMutation = useMutation({
    mutationFn: () => adminApi.rejectIdea(ideaId, feedback),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["idea", slug] }); toast.success("Idea rejected"); setShowReject(false); },
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/10 rounded-[2rem] border border-purple-200/60 dark:border-purple-700/30 p-6 shadow-lg shadow-purple-500/5"
    >
      <h3 className="font-display font-bold text-purple-900 dark:text-purple-300 text-lg mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5" /> Admin Actions
      </h3>
      <div className="flex gap-3">
        <button
          onClick={() => approveMutation.mutate()}
          disabled={approveMutation.isPending}
          className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20"
        >
          Approve Idea
        </button>
        <button
          onClick={() => setShowReject(!showReject)}
          className="flex-1 py-2.5 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold rounded-xl transition-all"
        >
          Reject Idea
        </button>
      </div>
      
      <AnimatePresence>
        {showReject && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-purple-100 dark:border-purple-800/30">
              <label className="block text-xs font-bold text-purple-800 dark:text-purple-300 mb-2">Rejection Reason (Required)</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Explain why this idea is being rejected..."
                rows={3}
                className="w-full px-4 py-3 text-sm rounded-xl border border-purple-200 dark:border-purple-700/50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none shadow-inner"
              />
              <button
                onClick={() => rejectMutation.mutate()}
                disabled={!feedback.trim() || rejectMutation.isPending}
                className="w-full mt-3 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-500/20"
              >
                Confirm Rejection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
