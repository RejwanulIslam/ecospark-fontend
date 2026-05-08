"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, Menu, X, ChevronDown, User,
  LayoutDashboard, LogOut, Zap, Settings, Bell
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "@/components/ui/theme-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/ideas", label: "Ideas" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);

  const isHero = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  // On hero page: transparent until scroll; on other pages: always solid
  const solidBg = !isHero || isScrolled;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        solidBg
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary-500)] to-emerald-600 rounded-xl flex items-center justify-center shadow-md"
            >
              <Leaf className="w-5 h-5 text-white" />
            </motion.div>
            <span className={cn(
              "font-display font-bold text-xl transition-colors",
              solidBg ? "text-foreground" : "text-white"
            )}>
              Eco<span className="text-[var(--color-primary-500)]">Spark</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  solidBg
                    ? pathname === link.href
                      ? "text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    : pathname === link.href
                      ? "text-white bg-white/15"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  solidBg
                    ? pathname.startsWith("/dashboard")
                      ? "text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <div className={cn(!solidBg && "[&_button]:text-white [&_button:hover]:bg-white/15")}>
              <ThemeToggleButton />
            </div>

            {isAuthenticated && user ? (
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-colors",
                    solidBg
                      ? "bg-muted hover:bg-muted/80"
                      : "bg-white/10 hover:bg-white/20 border border-white/20"
                  )}
                >
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/30">
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.name} width={28} height={28} className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-primary-600)] font-bold text-xs">
                        {user.name[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    "hidden sm:block text-sm font-medium max-w-[100px] truncate",
                    solidBg ? "text-foreground" : "text-white"
                  )}>
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className={cn(
                    "transition-transform",
                    solidBg ? "text-muted-foreground" : "text-white/70",
                    profileOpen && "rotate-180"
                  )} />
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-card rounded-2xl shadow-xl border border-border overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <span className={cn(
                          "inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium",
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)]/30 dark:text-[var(--color-primary-400)]"
                        )}>
                          {user.role}
                        </span>
                      </div>
                      <div className="p-1.5">
                        {[
                          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
                          { icon: User, label: "My Profile", href: "/dashboard/profile" },
                          { icon: Zap, label: "My Ideas", href: "/dashboard/ideas" },
                          { icon: Bell, label: "Purchases", href: "/dashboard/purchases" },
                          { icon: Settings, label: "Settings", href: "/dashboard/settings" },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <item.icon size={15} className="text-muted-foreground" />
                            {item.label}
                          </Link>
                        ))}
                        <button
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    solidBg
                      ? "text-foreground hover:bg-muted"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="rounded-full px-5 shadow-md btn-glow">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "md:hidden w-9 h-9 rounded-lg flex items-center justify-center",
                solidBg ? "bg-muted text-foreground" : "bg-white/10 text-white"
              )}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden pb-4"
            >
              <div className={cn(
                "pt-2 space-y-1 border-t",
                solidBg ? "border-border" : "border-white/15"
              )}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      solidBg
                        ? pathname === link.href
                          ? "bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20 text-[var(--color-primary-700)] dark:text-[var(--color-primary-400)]"
                          : "text-foreground hover:bg-muted"
                        : pathname === link.href
                          ? "bg-white/15 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <Link href="/dashboard" className={cn(
                    "block px-4 py-2.5 rounded-xl text-sm font-medium",
                    solidBg ? "text-foreground hover:bg-muted" : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}>
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login" className={cn(
                      "block px-4 py-2.5 rounded-xl text-sm font-medium",
                      solidBg ? "text-foreground hover:bg-muted" : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}>
                      Login
                    </Link>
                    <Link href="/auth/register" className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary-600)] text-center hover:bg-[var(--color-primary-700)] transition-colors">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
