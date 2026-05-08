"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { adminApi, userApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Lightbulb, Users, ThumbsUp, MessageCircle, CheckCircle, Clock, XCircle, FileText, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const { data: adminStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getStats().then((r) => r.data),
    enabled: isAdmin,
  });

  const { data: memberStats } = useQuery({
    queryKey: ["member-stats"],
    queryFn: () => userApi.getStats().then((r) => r.data),
    enabled: !isAdmin,
  });

  if (isAdmin) {
    return <AdminDashboard data={adminStats} />;
  }
  return <MemberDashboard data={memberStats} />;
}

function AdminDashboard({ data }: { data: Record<string, unknown> | undefined }) {
  const stats = data?.stats as Record<string, number> | undefined;
  const ideasByStatus = data?.ideasByStatus as Record<string, number> | undefined;
  const recentIdeas = data?.recentIdeas as Array<Record<string, unknown>> | undefined;

  const statusChartData = ideasByStatus
    ? Object.entries(ideasByStatus).map(([name, value]) => ({ name, value }))
    : [];

  const barData = [
    { name: "Under Review", count: ideasByStatus?.UNDER_REVIEW ?? 0 },
    { name: "Approved", count: ideasByStatus?.APPROVED ?? 0 },
    { name: "Rejected", count: ideasByStatus?.REJECTED ?? 0 },
    { name: "Draft", count: ideasByStatus?.DRAFT ?? 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Platform overview and management</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Users", value: stats?.totalUsers ?? 0, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { icon: Lightbulb, label: "Total Ideas", value: stats?.totalIdeas ?? 0, color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
          { icon: ThumbsUp, label: "Total Votes", value: stats?.totalVotes ?? 0, color: "text-accent-600", bg: "bg-accent-50 dark:bg-accent-900/20" },
          { icon: MessageCircle, label: "Total Comments", value: stats?.totalComments ?? 0, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5"
          >
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5">
          <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4">Ideas by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5">
          <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {statusChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent ideas + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">Recent Ideas</h3>
            <Link href="/dashboard/admin/ideas" className="text-xs text-primary-600 dark:text-primary-400 font-semibold">View all</Link>
          </div>
          <div className="space-y-3">
            {recentIdeas?.map((idea) => (
              <div key={idea.id as string} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                  <Lightbulb size={16} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{idea.title as string}</p>
                  <p className="text-xs text-gray-400">{(idea.author as Record<string, string>)?.name} · {formatDate(idea.createdAt as string)}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  idea.status === "APPROVED" ? "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400" :
                  idea.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" :
                  "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }`}>
                  {idea.status as string}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5">
          <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { href: "/dashboard/admin/ideas?status=UNDER_REVIEW", icon: Clock, label: "Review Pending Ideas", color: "text-yellow-600" },
              { href: "/dashboard/admin/users", icon: Users, label: "Manage Users", color: "text-blue-600" },
              { href: "/dashboard/admin/categories", icon: TrendingUp, label: "Edit Categories", color: "text-purple-600" },
              { href: "/ideas", icon: Lightbulb, label: "Browse All Ideas", color: "text-primary-600" },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <Icon size={16} className={color} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberDashboard({ data }: { data: Record<string, unknown> | undefined }) {
  const ideasByStatus = data?.ideasByStatus as Record<string, number> | undefined;

  const statusData = ideasByStatus ? [
    { name: "Draft", value: ideasByStatus.DRAFT ?? 0, icon: FileText, color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-800" },
    { name: "Under Review", value: ideasByStatus.UNDER_REVIEW ?? 0, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { name: "Approved", value: ideasByStatus.APPROVED ?? 0, icon: CheckCircle, color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
    { name: "Rejected", value: ideasByStatus.REJECTED ?? 0, icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your ideas and activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusData.map(({ icon: Icon, name, value, color, bg }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5"
          >
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{name} Ideas</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: "/dashboard/ideas", icon: Lightbulb, label: "My Ideas", desc: "Manage all your submitted ideas", color: "bg-primary-600" },
          { href: "/dashboard/ideas/new", icon: Lightbulb, label: "New Idea", desc: "Submit a new sustainability idea", color: "bg-accent-600" },
          { href: "/dashboard/purchases", icon: ShoppingBag, label: "Purchases", desc: "View your purchased ideas", color: "bg-blue-600" },
          { href: "/dashboard/profile", icon: Users, label: "Profile", desc: "Update your member profile", color: "bg-purple-600" },
        ].map(({ href, icon: Icon, label, desc, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600/50 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{label}</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
