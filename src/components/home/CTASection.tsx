"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight, Leaf, Sparkles, Zap } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

export default function CTASection() {
  const { ref } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { isAuthenticated } = useAuthStore();

  return (
    <section ref={ref} className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <MotionWrapper variant="scaleIn">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--color-primary-600)] via-[var(--color-primary-700)] to-emerald-700 p-12 sm:p-16 text-center shadow-2xl">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full"
              />
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.6) 1px, transparent 0)",
                  backgroundSize: "28px 28px",
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-sm mb-6 border border-white/20"
              >
                <Leaf className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
                Ready to Spark{" "}
                <span className="text-yellow-300 drop-shadow-sm">Change?</span>
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Join thousands of eco-innovators sharing ideas that make a real environmental impact.
                Your idea could be the next big thing.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {isAuthenticated ? (
                  <Link href="/dashboard/ideas/new">
                    <Button
                      size="lg"
                      className="rounded-full px-10 py-6 text-base bg-white text-[var(--color-primary-700)] hover:bg-white/90 shadow-xl font-bold gap-2 hover:shadow-2xl transition-all"
                    >
                      <Sparkles size={20} />
                      Submit Your Idea
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/register">
                      <Button
                        size="lg"
                        className="rounded-full px-10 py-6 text-base bg-white text-[var(--color-primary-700)] hover:bg-white/90 shadow-xl font-bold gap-2 hover:shadow-2xl transition-all"
                      >
                        <Sparkles size={20} />
                        Join for Free
                      </Button>
                    </Link>
                    <Link href="/ideas">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full px-10 py-6 text-base bg-white/10 hover:bg-white/20 text-white font-bold border-white/20 backdrop-blur-sm gap-2 shadow-lg"
                      >
                        Browse Ideas <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex items-center justify-center gap-6 text-white/60 text-sm">
                <span className="flex items-center gap-1.5"><Zap size={14} className="text-yellow-300" /> 100% Free to join</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="flex items-center gap-1.5"><Leaf size={14} className="text-green-300" /> Real environmental impact</span>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
