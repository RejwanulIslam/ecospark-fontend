"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { categoriesApi } from "@/lib/api";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { Category } from "@/types";

export default function CategoriesPage() {
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", icon: "🌱", color: "#22c55e" });
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll().then((r) => r.data.categories as Category[]),
  });

  const createMutation = useMutation({
    mutationFn: () => categoriesApi.create(form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["categories"] }); setAdding(false); setForm({ name: "", description: "", icon: "🌱", color: "#22c55e" }); toast.success("Category created!"); },
    onError: () => toast.error("Failed to create category"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["categories"] }); toast.success("Category deleted"); },
    onError: () => toast.error("Cannot delete — ideas may be using this category"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof form }) => categoriesApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["categories"] }); setEditId(null); toast.success("Category updated!"); },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage idea categories</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 transition-colors">
          <Plus size={15} /> New Category
        </button>
      </div>

      {adding && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">New Category</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name (e.g. Energy)" className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Icon emoji (e.g. ⚡)" className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Color:</label>
              <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => createMutation.mutate()} disabled={!form.name || createMutation.isPending} className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg disabled:opacity-50 hover:bg-primary-700 transition-colors">
              <Check size={13} /> Create
            </button>
            <button onClick={() => setAdding(false)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-lg">
              <X size={13} /> Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5">
            {editId === cat.id ? (
              <div className="space-y-2">
                <input defaultValue={cat.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500" />
                <div className="flex gap-2">
                  <button onClick={() => updateMutation.mutate({ id: cat.id, data: { ...form, name: form.name || cat.name } })} className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg"><Check size={11} /> Save</button>
                  <button onClick={() => setEditId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-lg"><X size={11} /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: (cat.color ?? "#22c55e") + "22" }}>{cat.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{cat._count?.ideas ?? 0} ideas</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => { setEditId(cat.id); setForm({ name: cat.name, description: cat.description ?? "", icon: cat.icon ?? "🌱", color: cat.color ?? "#22c55e" }); }} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-500 transition-colors"><Edit size={13} /></button>
                  <button onClick={() => { if (confirm("Delete category?")) deleteMutation.mutate(cat.id); }} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
