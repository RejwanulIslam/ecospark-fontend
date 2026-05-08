"use client";

import { useState } from "react";
import { newsletterApi } from "@/lib/api";
import toast from "react-hot-toast";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await newsletterApi.subscribe(email);
      setSuccess(true);
      toast.success("🌱 You're subscribed!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error ?? "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-muted/30 border-t border-border relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[var(--color-primary-500)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <MotionWrapper variant="slideUp">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/30 mb-6 border border-[var(--color-primary-200)] dark:border-[var(--color-primary-800)]/50 shadow-sm">
            <Mail className="w-8 h-8 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Stay in the <span className="gradient-text">Green Loop</span>
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg leading-relaxed">
            Get weekly curated sustainability ideas, top-voted projects, and platform updates delivered to your inbox.
          </p>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20 border border-[var(--color-primary-200)] dark:border-[var(--color-primary-700)]"
            >
              <CheckCircle className="w-6 h-6 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] shrink-0" />
              <span className="text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)] font-semibold">
                You&apos;re subscribed! Welcome to the green community. 🌿
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 rounded-full px-5 py-6 text-base border-border bg-background shadow-sm focus-visible:ring-[var(--color-primary-500)]"
              />
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="rounded-full px-8 py-6 gap-2 shadow-lg btn-glow whitespace-nowrap"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <> Subscribe <ArrowRight size={16} /> </>
                )}
              </Button>
            </form>
          )}

          <p className="text-muted-foreground text-xs mt-5">
            No spam, ever. Unsubscribe anytime. We respect your privacy. 🔒
          </p>
        </MotionWrapper>
      </div>
    </section>
  );
}
