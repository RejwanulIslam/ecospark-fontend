"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import toast from "react-hot-toast";
import { User, Mail, FileText, Camera, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Must contain uppercase, lowercase, and number"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ?? "");

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", bio: user?.bio ?? "" },
  });

  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const profileMutation = useMutation({
    mutationFn: (data: ProfileData & { avatar?: string }) => authApi.updateProfile(data),
    onSuccess: (res) => {
      updateUser(res.data.user);
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const passwordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed!");
      passwordForm.reset();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error ?? "Failed to change password");
    },
  });

  const onProfileSubmit = (data: ProfileData) => {
    profileMutation.mutate({ ...data, avatar: avatarPreview });
  };

  const onPasswordSubmit = (data: PasswordData) => {
    passwordMutation.mutate({ currentPassword: data.currentPassword, newPassword: data.newPassword });
  };

  const generateAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const url = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
    setAvatarPreview(url);
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account details</p>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-6"
      >
        <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-5 flex items-center gap-2">
          <User size={18} className="text-primary-500" /> Profile Info
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary-100 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-700">
              {avatarPreview ? (
                <Image src={avatarPreview} alt={user.name} width={80} height={80} className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-600 font-bold text-2xl">
                  {user.name[0]}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <button
              type="button"
              onClick={generateAvatar}
              className="mt-2 flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              <Camera size={12} /> Generate new avatar
            </button>
          </div>
        </div>

        {/* Avatar URL input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Avatar URL</label>
          <input
            value={avatarPreview}
            onChange={(e) => setAvatarPreview(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <User size={14} className="inline mr-1.5" />Full Name
            </label>
            <input
              {...profileForm.register("name")}
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all",
                profileForm.formState.errors.name ? "border-red-400" : "border-gray-200 dark:border-gray-700"
              )}
            />
            {profileForm.formState.errors.name && (
              <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <FileText size={14} className="inline mr-1.5" />Bio
            </label>
            <textarea
              {...profileForm.register("bio")}
              rows={3}
              placeholder="Tell the community about yourself..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <Mail size={15} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email address (cannot be changed)</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={profileMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            {profileMutation.isPending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle size={15} />
            )}
            Save Changes
          </motion.button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-6"
      >
        <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-5 flex items-center gap-2">
          <Lock size={18} className="text-primary-500" /> Change Password
        </h2>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          {/* Current password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
            <div className="relative">
              <input
                {...passwordForm.register("currentPassword")}
                type={showCurrentPass ? "text" : "password"}
                className={cn(
                  "w-full px-4 py-3 pr-10 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500",
                  passwordForm.formState.errors.currentPassword ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                )}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
            )}
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
            <div className="relative">
              <input
                {...passwordForm.register("newPassword")}
                type={showNewPass ? "text" : "password"}
                placeholder="Min 8 chars with uppercase, lowercase, number"
                className={cn(
                  "w-full px-4 py-3 pr-10 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500",
                  passwordForm.formState.errors.newPassword ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                )}
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {passwordForm.formState.errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
            <input
              {...passwordForm.register("confirmPassword")}
              type="password"
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500",
                passwordForm.formState.errors.confirmPassword ? "border-red-400" : "border-gray-200 dark:border-gray-700"
              )}
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={passwordMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-gray-900 font-semibold text-sm rounded-xl transition-colors disabled:opacity-60"
          >
            {passwordMutation.isPending ? (
              <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : <Lock size={15} />}
            Update Password
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
