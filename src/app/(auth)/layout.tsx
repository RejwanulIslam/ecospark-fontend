import Link from "next/link";
import { Leaf } from "lucide-react";
import { ThemeToggleButton } from "@/components/ui/theme-toggle";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative image side (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-[var(--color-primary-950)]">
        <Image
          src="/hero-bg.png"
          alt="EcoSpark — sustainable city"
          fill
          className="object-cover object-center opacity-60"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-900)]/80 via-[var(--color-primary-800)]/50 to-black/60" />

        {/* Content on image */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Eco<span className="text-[var(--color-primary-300)]">Spark</span>
            </span>
          </Link>

          {/* Quote */}
          <div className="max-w-sm">
            <blockquote className="text-white/90 text-2xl font-display font-semibold leading-snug mb-4">
              &quot;The best time to plant a tree was 20 years ago. The second best time is now.&quot;
            </blockquote>
            <p className="text-white/50 text-sm font-medium">— Chinese Proverb</p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8">
            {[
              { value: "12,400+", label: "Members" },
              { value: "3,200+", label: "Ideas" },
              { value: "48", label: "Countries" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-white font-display font-bold text-2xl">{value}</p>
                <p className="text-white/50 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Top bar */}
        <div className="flex items-center justify-between p-5 sm:p-8">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary-500)] to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Eco<span className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]">Spark</span>
            </span>
          </Link>
          <div className="lg:ml-auto">
            <ThemeToggleButton />
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-6">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
