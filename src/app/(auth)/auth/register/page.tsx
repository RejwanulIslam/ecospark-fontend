"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, Leaf } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

const passwordChecks = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.register({ name: data.name, email: data.email, password: data.password });
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome to EcoSpark, ${res.data.user.name.split(" ")[0]}! 🌿`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error ?? "Registration failed");
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";
    window.location.href = `${apiUrl}/google`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-7">
        <div className="w-11 h-11 rounded-2xl bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/40 flex items-center justify-center mb-5 border border-[var(--color-primary-200)] dark:border-[var(--color-primary-800)]/50">
          <Leaf className="w-5 h-5 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1.5">
          Join EcoSpark Hub
        </h1>
        <p className="text-muted-foreground text-sm">
          Start sharing sustainability ideas today — it&apos;s free
        </p>
      </div>

      {/* Google Sign Up */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleGoogleLogin}
        className="w-full rounded-xl gap-3 border-border bg-background hover:bg-muted/50 text-foreground font-medium shadow-sm mb-6"
      >
        <GoogleIcon />
        Sign up with Google
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium px-1">or continue with email</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("name")}
              placeholder="Your full name"
              className={cn("pl-10 rounded-xl bg-background", errors.name && "border-destructive")}
            />
          </div>
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className={cn("pl-10 rounded-xl bg-background", errors.email && "border-destructive")}
            />
          </div>
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("password")}
              type={showPass ? "text" : "password"}
              placeholder="Create a strong password"
              className={cn("pl-10 pr-10 rounded-xl bg-background", errors.password && "border-destructive")}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {/* Password strength */}
          {password && (
            <div className="mt-2.5 grid grid-cols-2 gap-y-1.5 gap-x-3">
              {passwordChecks.map((check) => (
                <div
                  key={check.label}
                  className={cn(
                    "flex items-center gap-1.5 text-xs transition-colors",
                    check.test(password)
                      ? "text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]"
                      : "text-muted-foreground"
                  )}
                >
                  <CheckCircle size={11} className={check.test(password) ? "opacity-100" : "opacity-30"} />
                  {check.label}
                </div>
              ))}
            </div>
          )}
          {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="Repeat your password"
              className={cn("pl-10 rounded-xl bg-background", errors.confirmPassword && "border-destructive")}
            />
          </div>
          {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>}
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
            <> Create Account <ArrowRight size={16} /> </>
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
        By signing up you agree to our{" "}
        <span className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] cursor-pointer hover:underline">Terms</span>{" "}
        and{" "}
        <span className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] cursor-pointer hover:underline">Privacy Policy</span>.
      </p>

      <p className="text-center text-sm text-muted-foreground mt-5">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
