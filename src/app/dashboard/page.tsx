"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getUserStats, getUserBadges, getUserProjects } from "@/lib/store";

export default function DashboardPage() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ streak: 0, lessons: 0, projects: 0 });
  const [badges, setBadges] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activityDays, setActivityDays] = useState<{ day: string; active: boolean; date: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const overallProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0;

  const getElsaNote = () => {
    if (overallProgress === 0) return "Your garden is ready! Start your first project and watch your skills bloom. 🌱";
    if (overallProgress < 30) return "You're getting started! Keep the momentum going — every lesson counts. 🌿";
    if (overallProgress < 60) return "You're making great progress! Stay consistent and you'll reach your goal soon. 🌸";
    if (overallProgress < 100) return "You're blooming! Almost at your goal — just a few more lessons to go! 🎉";
    return "Incredible! You've completed your project! Time to start a new adventure. 🏆";
  };

  const generateActivityDays = (lessonDates: string[]) => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
      days.push({
        day: dayNames[date.getDay()],
        active: lessonDates.includes(dateStr),
        date: dateStr,
      });
    }
    return days;
  };

  const loadData = useCallback(async (userId: string) => {
    const [userStats, userBadges, userProjects] = await Promise.all([
      getUserStats(userId),
      getUserBadges(userId),
      getUserProjects(userId),
    ]);
    setStats(userStats);
    setBadges(userBadges);
    setProjects(userProjects);

    // Fetch lesson dates for activity
    const { data: lessons } = await supabase
      .from("lessons")
      .select("completed_at")
      .eq("user_id", userId)
      .eq("completed", true)
      .order("completed_at", { ascending: false })
      .limit(7);

    const lessonDates = (lessons || []).map((l: any) =>
      l.completed_at ? new Date(l.completed_at).toISOString().split("T")[0] : ""
    ).filter(Boolean);
    setActivityDays(generateActivityDays(lessonDates));
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("email", authUser.email)
        .single();
      setUser(profile || { name: authUser.email?.split("@")[0] || "Bloomer", email: authUser.email });
      if (profile) await loadData(profile.id);
      setLoading(false);
    };
    init();
  }, [loadData]);

  const xpEarned = stats.lessons * 50;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3 }} className="text-5xl">🌸</motion.div>
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
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/garden" className="text-[#6B7280] hover:text-[#312E81] transition"><ArrowLeft size={22} /></Link>
            <div>
              <h1 className="font-heading text-xl lg:text-2xl font-bold text-[#312E81]">Dashboard</h1>
              <p className="text-xs text-[#6B7280]">Track your growth and celebrate wins ✨</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1.5 text-xs font-bold text-amber-700">
              🔥 {stats.streak} Day Streak
            </span>
            <Bell size={20} className="text-[#6B7280]" />
            <Link href="/profile" className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/60">
              <Image src="/idle.png" alt="Profile" fill className="object-cover" />
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: "🔥", value: stats.streak, label: "Day Streak" },
            { icon: "📚", value: stats.lessons, label: "Lessons Done" },
            { icon: "🌱", value: stats.projects, label: "Projects" },
            { icon: "⭐", value: badges.length, label: "Badges" },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/40 p-4 text-center"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
              <span className="text-2xl">{stat.icon}</span>
              <p className="font-heading text-2xl font-bold text-[#312E81] mt-1">{stat.value}</p>
              <p className="text-xs text-[#6B7280]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Progress + Badges Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Progress Ring */}
          <div className="rounded-2xl border border-white/40 p-6 flex flex-col items-center"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
            <h3 className="font-heading font-semibold text-[#312E81] mb-4">Overall Progress</h3>
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 160 160" className="transform -rotate-90">
                <circle cx="80" cy="80" r="68" fill="none" stroke="#E8E0F0" strokeWidth="12" />
                <motion.circle cx="80" cy="80" r="68" fill="none" stroke="url(#dashGrad)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(overallProgress / 100) * 427} 427`}
                  initial={{ strokeDasharray: "0 427" }}
                  animate={{ strokeDasharray: `${(overallProgress / 100) * 427} 427` }}
                  transition={{ duration: 1.5, ease: "easeOut" }} />
                <defs>
                  <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-3xl font-bold text-[#312E81]">{overallProgress}%</span>
                <span className="text-xs text-[#6B7280]">Complete</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#8B5CF6]" /> Completed</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#C4B5FD]" /> In Progress</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#E8E0F0]" /> Upcoming</div>
            </div>
          </div>

          {/* Badges */}
          <div className="rounded-2xl border border-white/40 p-6"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-[#312E81]">Recent Badges</h3>
              <span className="text-xs text-[#8B5CF6] cursor-pointer hover:underline">View all</span>
            </div>
            {badges.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl">🏆</span>
                <p className="text-sm text-[#6B7280] mt-2">Complete lessons to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {badges.slice(0, 4).map((badge) => (
                  <div key={badge.id} className="rounded-xl bg-white/40 border border-white/40 p-3 text-center hover:scale-105 transition">
                    <span className="text-2xl">{badge.badge_icon}</span>
                    <p className="text-xs font-semibold text-[#312E81] mt-1">{badge.badge_name}</p>
                  </div>
                ))}
              </div>
            )}
            {badges.length > 4 && (
              <p className="text-center text-xs text-[#6B7280] mt-4">+{badges.length - 4} more badges</p>
            )}
          </div>
        </div>

        {/* Activity Calendar */}
        <div className="rounded-2xl border border-white/40 p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="font-heading font-semibold text-[#312E81]">This Week</h3>
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <span>📚 {stats.lessons} Lessons</span>
              <span>⚡ {xpEarned} XP Earned</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            {activityDays.map((d) => (
              <div key={d.date} className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                  d.active ? "bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] text-white shadow-md" : "bg-gray-100 text-[#6B7280]"
                }`}>
                  {d.day}
                </div>
                <p className="text-xs text-[#6B7280] mt-1">{d.date.split("-")[2]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Elsa's Note */}
        <div className="rounded-2xl border border-white/40 p-5 flex items-center gap-4"
          style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
          <Image src="/mission.png" alt="Elsa" width={60} height={70} className="object-contain" />
          <div>
            <p className="font-heading font-semibold text-[#312E81] text-sm">Elsa's Note</p>
            <p className="text-sm text-[#6B7280]">{getElsaNote()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}