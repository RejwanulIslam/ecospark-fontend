"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Leaf } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;



export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fillDemo = (role: "admin" | "member") => {
    const creds = role === "admin"
      ? { email: "admin@ecospark.com", password: "Admin@123456" }
      : { email: "member@ecospark.com", password: "Member@123456" };
    setValue("email", creds.email);
    setValue("password", creds.password);
    toast("Demo credentials filled!", { icon: "✨" });
  };

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.login(data);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name.split(" ")[0]}! 🌿`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error ?? "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received");
      }
      const res = await authApi.googleLogin(credentialResponse.credential);

      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back! 🌿`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error ?? "Google login failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-11 h-11 rounded-2xl bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/40 flex items-center justify-center mb-5 border border-[var(--color-primary-200)] dark:border-[var(--color-primary-800)]/50">
          <Leaf className="w-5 h-5 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1.5">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in to continue your eco journey
        </p>
      </div>

      {/* Google Login Section */}
      <div className="mb-6">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google login failed")}
          useOneTap
          width="100%"
          theme="outline"
          shape="circle"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium px-1">or sign in with email</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Demo buttons */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => fillDemo("admin")}
          className="flex-1 py-2 px-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-semibold border border-purple-200 dark:border-purple-700/50 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
        >
          👑 Demo Admin
        </button>
        <button
          type="button"
          onClick={() => fillDemo("member")}
          className="flex-1 py-2 px-3 rounded-lg bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20 text-[var(--color-primary-700)] dark:text-[var(--color-primary-400)] text-xs font-semibold border border-[var(--color-primary-200)] dark:border-[var(--color-primary-700)]/50 hover:bg-[var(--color-primary-100)] dark:hover:bg-[var(--color-primary-900)]/30 transition-colors"
        >
          🌱 Demo Member
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className={cn(
                "pl-10 rounded-xl bg-background",
                errors.email ? "border-destructive focus-visible:ring-destructive" : ""
              )}
            />
          </div>
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-foreground">Password</label>
            <Link href="/auth/forgot-password" className="text-xs text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("password")}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "pl-10 pr-10 rounded-xl bg-background",
                errors.password ? "border-destructive focus-visible:ring-destructive" : ""
              )}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full rounded-xl gap-2 mt-2 shadow-md btn-glow"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <> Sign In <ArrowRight size={16} /> </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-7">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] font-semibold hover:underline">
          Create one free
        </Link>
      </p>
    </motion.div>
  );
}