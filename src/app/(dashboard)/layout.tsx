"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, LayoutDashboard, Lightbulb, Users, Settings,
  LogOut, Menu, X, ChevronRight, ShoppingBag,
  Bell, User, Shield, Sun, Moon, Plus
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const memberLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/ideas", icon: Lightbulb, label: "My Ideas" },
  { href: "/dashboard/purchases", icon: ShoppingBag, label: "Purchases" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const adminLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/admin/ideas", icon: Lightbulb, label: "Manage Ideas" },
  { href: "/dashboard/admin/users", icon: Users, label: "Manage Users" },
  { href: "/dashboard/ideas", icon: Lightbulb, label: "My Ideas" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!isAuthenticated || !user) return null;

  const navLinks = user.role === "ADMIN" ? adminLinks : memberLinks;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary-500)] to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-[var(--shadow-glow)] transition-shadow">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Eco<span className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]">Spark</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/30 shrink-0 border border-border">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} width={40} height={40} className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-primary-600)] font-bold text-base">
                {user.name[0]}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-sm truncate">{user.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {user.role === "ADMIN" ? (
                <Badge className="text-[10px] px-1.5 py-0.5 h-auto bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-none gap-1">
                  <Shield size={8} /> Admin
                </Badge>
              ) : (
                <Badge className="text-[10px] px-1.5 py-0.5 h-auto bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)]/30 dark:text-[var(--color-primary-400)] border-none gap-1">
                  <Leaf size={8} /> Member
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Idea CTA */}
      <div className="px-4 pt-4">
        <Link href="/dashboard/ideas/new">
          <Button className="w-full rounded-xl gap-2 shadow-sm btn-glow text-sm py-5">
            <Plus size={16} /> New Idea
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 pt-4 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Navigation
        </p>
        <div className="space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
                  isActive
                    ? "bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20 text-[var(--color-primary-700)] dark:text-[var(--color-primary-400)] shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-primary-500)] rounded-full"
                  />
                )}
                <link.icon size={17} className={cn(
                  "transition-colors",
                  isActive
                    ? "text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]"
                    : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className="flex-1">{link.label}</span>
                {isActive && <ChevronRight size={14} className="text-[var(--color-primary-500)]" />}
              </Link>
            );
          })}
        </div>

        {/* Admin section */}
        {user.role === "ADMIN" && (
          <div className="mt-5 pt-4 border-t border-border">
            <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield size={10} /> Admin Panel
            </p>
            {[
              { href: "/dashboard/admin/ideas", label: "Review Ideas" },
              { href: "/dashboard/admin/users", label: "User Management" },
              { href: "/dashboard/admin/categories", label: "Categories" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  pathname === l.href
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <ChevronRight size={12} /> {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors group"
        >
          <LogOut size={17} className="group-hover:-translate-x-0.5 transition-transform" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border flex-col shrink-0 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 border-r border-border z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent />
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4 sm:px-6 gap-4 shrink-0 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {navLinks.find((l) => l.href === pathname)?.label ?? "Dashboard"}
            </p>
            <p className="text-xs text-muted-foreground">EcoSpark Hub</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground relative hover:bg-muted/80 transition-colors">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-primary-500)] rounded-full animate-pulse" />
            </button>
            <Link href="/dashboard/profile" className="w-9 h-9 rounded-xl overflow-hidden bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/30 border border-border hover:border-[var(--color-primary-400)] transition-colors">
              {user.avatar ? (
                <Image src={user.avatar} alt={user.name} width={36} height={36} className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--color-primary-600)] font-bold text-sm">
                  {user.name[0]}
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
