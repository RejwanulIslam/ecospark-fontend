"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Sparkles, TrendingUp, Users, Zap, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";

const floatingItems = [
  { icon: "☀️", label: "Solar Energy", delay: 0, x: "5%", y: "20%" },
  { icon: "♻️", label: "Zero Waste", delay: 0.6, x: "87%", y: "18%" },
  { icon: "🌱", label: "Urban Farming", delay: 1.2, x: "91%", y: "62%" },
  { icon: "💧", label: "Water Save", delay: 1.8, x: "3%", y: "68%" },
  { icon: "🚲", label: "Green Transit", delay: 2.4, x: "48%", y: "82%" },
];

const stats = [
  { icon: Users, value: "12,400+", label: "Members" },
  { icon: Zap, value: "3,200+", label: "Ideas Shared" },
  { icon: TrendingUp, value: "890+", label: "Approved" },
];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with parallax */}
      <motion.div style={{ y: imageY }} className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Sustainable eco-friendly city"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay for readability – lighter in light mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/80 dark:from-black/75 dark:via-black/65 dark:to-black/90" />
        {/* Coloured tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-900)]/40 via-transparent to-blue-950/30" />
      </motion.div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating eco badges */}
      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: item.delay + 1, duration: 0.5 },
            scale: { delay: item.delay + 1, duration: 0.5, type: "spring", stiffness: 200 },
            y: { delay: item.delay + 1.5, duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-lg z-10"
          style={{ left: item.x, top: item.y }}
        >
          <span className="text-base">{item.icon}</span>
          {item.label}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium shadow-md">
            <Sparkles size={14} className="text-yellow-300 animate-pulse" />
            Community-Powered Sustainability Platform
            <Sparkles size={14} className="text-yellow-300 animate-pulse" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight drop-shadow-xl"
        >
          Ideas That{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-400)] via-emerald-300 to-cyan-400">
              Spark
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--color-primary-400)] to-cyan-400 rounded-full origin-left"
            />
          </span>
          <br />
          <span className="text-white/95">Real Change</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/75 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Share sustainability ideas, vote on the best solutions, and collaborate
          with thousands of eco-innovators to build a greener future.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/ideas">
            <Button
              size="lg"
              className="rounded-full px-9 py-6 text-base shadow-2xl bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-400)] border border-[var(--color-primary-400)]/50 group transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
            >
              <Leaf size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
              Explore Ideas
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-9 py-6 text-base bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-md transition-all duration-300"
            >
              <Sparkles size={18} className="mr-2 text-yellow-300" />
              Share Your Idea
            </Button>
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex items-center justify-center gap-8 sm:gap-14 mt-16 pt-10 border-t border-white/15"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center group cursor-default">
              <div className="flex items-center justify-center gap-1.5 text-white font-display font-bold text-2xl sm:text-3xl drop-shadow-md group-hover:scale-105 transition-transform">
                <Icon size={20} className="text-[var(--color-primary-400)]" />
                {value}
              </div>
              <p className="text-white/55 text-sm mt-1 font-medium">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/40"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}
