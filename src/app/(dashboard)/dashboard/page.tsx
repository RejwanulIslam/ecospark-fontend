"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { adminApi, userApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  Lightbulb, Users, ThumbsUp, MessageCircle, CheckCircle,
  Clock, XCircle, FileText, ShoppingBag, TrendingUp, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

const DashboardSkeleton = () => (
  <div className="p-6 space-y-6 animate-pulse">
    <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded-2xl" />
      <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded-2xl" />
    </div>
  </div>
);

export default function DashboardPage() {
  const { user, isAuthenticated, token } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  // ১. Hydration Fix: রিফ্রেশ দিলে যাতে সাথে সাথে লগইন পেজে না পাঠায়
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ২. প্রোটেক্টেড রাউট লজিক: Hydration শেষ হওয়ার পর চেক করবে
  useEffect(() => {
    if (isHydrated && !isAuthenticated && !token) {
      router.replace("/auth/login");
    }
  }, [isHydrated, isAuthenticated, token, router]);

  const isAdmin = user?.role === "ADMIN";

  const {
    data: adminData,
    isLoading: isAdminLoading,
    isError: isAdminError
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getStats().then((r) => r.data),
    enabled: !!user && isAdmin && isHydrated, // Hydrated হওয়ার পর ডাটা কল হবে
  });

  const {
    data: memberData,
    isLoading: isMemberLoading
  } = useQuery({
    queryKey: ["member-stats"],
    queryFn: () => userApi.getStats().then((r) => r.data),
    enabled: !!user && !isAdmin && isHydrated,
  });

  if (!isHydrated || isAdminLoading || isMemberLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) return null;

  if (isAdminError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold">Failed to load statistics</h2>
        <p className="text-gray-500 mt-2">Please check your internet connection or admin permissions.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-transparent">
      {isAdmin ? (
        <AdminDashboard data={adminData} />
      ) : (
        <MemberDashboard data={memberData} />
      )}
    </div>
  );
}

/**
 * ADMIN DASHBOARD VIEW
 */
function AdminDashboard({ data }: { data: any }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stats = data?.stats || {};
  const ideasByStatus = data?.ideasByStatus || {};
  const recentIdeas = data?.recentIdeas || [];

  const statusChartData = Object.entries(ideasByStatus).map(([name, value]) => ({
    name: name.replace("_", " "),
    value: Number(value),
  }));

  const barData = [
    { name: "Review", count: ideasByStatus?.UNDER_REVIEW || 0 },
    { name: "Approved", count: ideasByStatus?.APPROVED || 0 },
    { name: "Rejected", count: ideasByStatus?.REJECTED || 0 },
    { name: "Draft", count: ideasByStatus?.DRAFT || 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Admin Control Center</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Real-time platform metrics and management</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Users", value: stats.totalUsers || 0, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { icon: Lightbulb, label: "Total Ideas", value: stats.totalIdeas || 0, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { icon: ThumbsUp, label: "Total Votes", value: stats.totalVotes || 0, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { icon: MessageCircle, label: "Total Comments", value: stats.totalComments || 0, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</h4>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-6">Submission Status</h3>
          <div className="h-[250px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-6">Distribution</h3>
          <div className="h-[250px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData.length ? statusChartData : [{ name: "No Data", value: 1 }]}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Tables and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
            <h3 className="font-bold">Recent Submissions</h3>
            <Link href="/dashboard/admin/ideas" className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-tight">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] uppercase text-gray-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentIdeas.map((idea: any) => (
                  <tr key={idea.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium truncate max-w-[200px]">{idea.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{idea.author?.name || "System"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${idea.status === "APPROVED" ? "bg-green-100 text-green-700 dark:bg-green-900/20" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20"
                        }`}>
                        {idea.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">{formatDate(idea.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { href: "/dashboard/admin/ideas?status=UNDER_REVIEW", icon: Clock, label: "Review Submissions", color: "text-amber-600" },
              { href: "/dashboard/admin/users", icon: Users, label: "User Management", color: "text-blue-600" },
              { href: "/dashboard/admin/categories", icon: TrendingUp, label: "Manage Categories", color: "text-purple-600" },
              { href: "/ideas", icon: Lightbulb, label: "Public Gallery", color: "text-emerald-600" },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
              >
                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors`}>
                  <Icon size={16} className={color} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MEMBER / USER DASHBOARD VIEW
 */
function MemberDashboard({ data }: { data: any }) {
  const ideasByStatus = data?.ideasByStatus || {};

  const cards = [
    { label: "Approved", val: ideasByStatus.APPROVED || 0, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending", val: ideasByStatus.UNDER_REVIEW || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Drafts", val: ideasByStatus.DRAFT || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Rejected", val: ideasByStatus.REJECTED || 0, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="p-6 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workspace Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here is what is happening with your ideas.</p>
        </div>
        <Link href="/dashboard/ideas/new" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all">
          + Submit New Idea
        </Link>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <item.icon className={`mb-3 ${item.color}`} size={24} />
            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{item.val}</h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/purchases" className="group p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingBag className="text-blue-600" size={32} />
          </div>
          <div>
            <h4 className="text-lg font-bold">My Purchases</h4>
            <p className="text-sm text-gray-500">Access your saved and paid sustainability solutions</p>
          </div>
        </Link>

        <Link href="/dashboard/profile" className="group p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-6 hover:shadow-xl hover:shadow-purple-500/5 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="text-purple-600" size={32} />
          </div>
          <div>
            <h4 className="text-lg font-bold">Account Profile</h4>
            <p className="text-sm text-gray-500">Update your preferences and security settings</p>
          </div>
        </Link>
      </div>
    </div>
  );
}