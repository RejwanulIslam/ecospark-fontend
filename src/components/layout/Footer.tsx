"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Leaf, Mail, Phone, Twitter, Github, Linkedin,
  Instagram, ArrowRight, MapPin
} from "lucide-react";
import { useState } from "react";
import { newsletterApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await newsletterApi.subscribe(email);
      toast.success("🌱 Successfully subscribed!");
      setEmail("");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Stay in the Loop 🌿
              </h3>
              <p className="text-gray-400 text-sm">
                Get weekly updates on top-voted ideas and platform announcements.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto min-w-[340px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm transition-colors"
                required
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="px-5 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-xl text-white font-medium text-sm flex items-center gap-2 transition-colors btn-glow whitespace-nowrap"
              >
                {loading ? "..." : <><span>Subscribe</span><ArrowRight size={14} /></>}
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Eco<span className="text-primary-400">Spark</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              A community portal where sustainability ideas spark real change. Join thousands of eco-innovators worldwide.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  whileHover={{ y: -2 }}
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-primary-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Browse Ideas", href: "/ideas" },
                { label: "Submit Idea", href: "/dashboard/ideas/new" },
                { label: "Top Voted", href: "/ideas?sortBy=votes" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Pricing", href: "/#pricing" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Use", href: "/terms" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-primary-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">hello@ecosparkhub.com</p>
                  <p className="text-gray-400 text-sm">support@ecosparkhub.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-primary-400 shrink-0" />
                <p className="text-gray-400 text-sm">+1 (555) 000-0000</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-primary-400 mt-0.5 shrink-0" />
                <p className="text-gray-400 text-sm">San Francisco, CA 94102, USA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} EcoSpark Hub. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1.5">
            <Leaf size={12} className="text-primary-600" />
            Built for a greener planet
          </p>
        </div>
      </div>
    </footer>
  );
}
