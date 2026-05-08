"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { Sun, Moon, Monitor, Bell, Shield, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuthStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState({ email: true, browser: false });

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your preferences</p>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5">
        <h2 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
          <Sun size={17} className="text-earth-500" /> Appearance
        </h2>
        <div className="flex gap-3">
          {themes.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 text-sm font-medium transition-all",
                theme === value
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
              )}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5">
        <h2 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
          <Bell size={17} className="text-blue-500" /> Notifications
        </h2>
        <div className="space-y-3">
          {[
            { key: "email", label: "Email notifications", desc: "Receive updates about your ideas via email" },
            { key: "browser", label: "Browser notifications", desc: "Get notified in your browser" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors shrink-0",
                  notifications[key as keyof typeof notifications] ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <span className={cn("absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform", notifications[key as keyof typeof notifications] && "translate-x-5")} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-5">
        <h2 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
          <Shield size={17} className="text-purple-500" /> Security
        </h2>
        <button
          onClick={() => router.push("/dashboard/profile")}
          className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <p className="font-medium text-gray-900 dark:text-white text-sm">Change Password</p>
          <p className="text-gray-400 text-xs mt-0.5">Update your account password</p>
        </button>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800/50 p-5">
        <h2 className="font-display font-bold text-red-700 dark:text-red-400 text-base mb-4 flex items-center gap-2">
          <LogOut size={17} /> Account Actions
        </h2>
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-700 bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={15} /> Sign Out of All Devices
        </button>
      </motion.div>
    </div>
  );
}
