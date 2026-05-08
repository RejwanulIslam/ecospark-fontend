"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { adminApi } from "@/lib/api";
import { Search, UserCheck, UserX, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { cn, formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, page],
    queryFn: () =>
      adminApi.getUsers({ search: search || undefined, page, limit: 10 }).then((r) => r.data),
  });

  const users = data?.users ?? [];
  const pagination = data?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 1 };

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleUserStatus(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(res.data.message);
    },
    onError: () => toast.error("Failed to update user"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => adminApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role updated!");
    },
    onError: () => toast.error("Failed to update role"),
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {pagination.total} members on the platform
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Users list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 skeleton rounded-2xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-3">👥</div>
          <p className="font-display text-lg font-bold text-gray-900 dark:text-white">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user: Record<string, unknown>, i: number) => (
            <motion.div
              key={user.id as string}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Avatar + info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-primary-100 dark:bg-primary-900/20 shrink-0">
                    {user.avatar ? (
                      <Image
                        src={user.avatar as string}
                        alt={user.name as string}
                        width={44}
                        height={44}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-600 font-bold">
                        {(user.name as string)?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{user.name as string}</p>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-semibold",
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                          : "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      )}>
                        {user.role === "ADMIN" ? "👑 Admin" : "🌱 Member"}
                      </span>
                      {!(user.isActive as boolean) && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email as string}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Joined {formatDate(user.createdAt as string)} ·{" "}
                      {((user._count as Record<string, number>)?.ideas ?? 0)} ideas ·{" "}
                      {((user._count as Record<string, number>)?.votes ?? 0)} votes
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {/* Toggle role */}
                  <select
                    value={user.role as string}
                    onChange={(e) => roleMutation.mutate({ id: user.id as string, role: e.target.value })}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>

                  {/* Toggle status */}
                  <button
                    onClick={() => toggleMutation.mutate(user.id as string)}
                    disabled={toggleMutation.isPending}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50",
                      user.isActive
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700/50 hover:bg-red-100"
                        : "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-700/50 hover:bg-primary-100"
                    )}
                  >
                    {user.isActive ? (
                      <><UserX size={12} /> Deactivate</>
                    ) : (
                      <><UserCheck size={12} /> Activate</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {pagination.totalPages}
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
