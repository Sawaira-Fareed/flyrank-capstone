"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell, Edit, Mail, Calendar, Award, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getUserStats, getUserBadges } from "@/lib/store";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ streak: 0, lessons: 0, projects: 0 });
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }

      const { data: profile } = await supabase.from("users").select("*").eq("email", authUser.email).single();
     setUser(profile || { name: authUser.email?.split("@")[0] || "Bloomer", email: authUser.email || "" });

      if (profile) {
        const userStats = await getUserStats(profile.id);
        setStats(userStats);
        const userBadges = await getUserBadges(profile.id);
        setBadges(userBadges);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
        <div className="animate-pulse text-2xl text-[#8B5CF6]">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
        <span className="text-6xl">🔒</span>
        <h2 className="font-heading text-2xl font-bold text-[#312E81]">Please log in</h2>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/garden" className="text-[#6B7280] hover:text-[#312E81] transition"><ArrowLeft size={22} /></Link>
          <Bell size={20} className="text-[#6B7280]" />
        </div>

        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/40 p-6 lg:p-8 mb-6"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.06))", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(139,92,246,0.10)" }}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-white/60 shadow-lg">
              <Image src="/face.png" alt="Profile" fill className="object-cover" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#312E81]">{user.name}</h1>
              <p className="text-sm text-[#6B7280] flex items-center gap-2 justify-center sm:justify-start mt-1">
                <Mail size={14} /> {user.email}
              </p>
              <p className="text-sm text-[#6B7280] flex items-center gap-2 justify-center sm:justify-start mt-1">
                <Calendar size={14} /> Joined {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
              <button className="mt-3 rounded-full border border-[#C4B5FD]/40 bg-white/40 px-4 py-2 text-xs font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition flex items-center gap-2">
                <Edit size={14} /> Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: "🔥", value: stats.streak, label: "Day Streak" },
            { icon: "📚", value: stats.lessons, label: "Lessons Done" },
            { icon: "💻", value: stats.projects, label: "Projects" },
            { icon: "⭐", value: badges.length, label: "Badges" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/40 p-4 text-center"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
              <span className="text-2xl">{stat.icon}</span>
              <p className="font-heading text-2xl font-bold text-[#312E81] mt-1">{stat.value}</p>
              <p className="text-xs text-[#6B7280]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="rounded-2xl border border-white/40 p-6"
          style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-[#312E81] flex items-center gap-2"><Award size={20} /> Badges Earned</h2>
            <Link href="/archive" className="text-xs text-[#8B5CF6] hover:underline">View All</Link>
          </div>
          {badges.length === 0 ? (
            <p className="text-sm text-[#6B7280] text-center py-6">Complete lessons and projects to earn badges!</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {badges.slice(0, 6).map((badge) => (
                <div key={badge.id} className="text-center p-3 rounded-xl bg-white/40 hover:scale-105 transition">
                  <span className="text-3xl">{badge.badge_icon}</span>
                  <p className="text-xs font-semibold text-[#312E81] mt-1">{badge.badge_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {[
            { icon: "📁", label: "My Projects", href: "/projects" },
            { icon: "📖", label: "Continue Learning", href: "/learn" },
            { icon: "🗺️", label: "Skill Map", href: "/path" },
            { icon: "📚", label: "Archive", href: "/archive" },
          ].map((link) => (
            <Link key={link.label} href={link.href}
              className="rounded-2xl border border-white/40 p-4 flex items-center gap-3 hover:scale-[1.02] transition"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
              <span className="text-2xl">{link.icon}</span>
              <span className="font-heading font-semibold text-[#312E81] text-sm">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}