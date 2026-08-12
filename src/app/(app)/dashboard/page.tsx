"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { getUserStats, getUserBadges, getUserProjects } from "@/lib/store";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
 const [stats, setStats] = useState({ streak: 0, lessons: 0, projects: 0, xp: 0, completedLessons: 0 });
  const [badges, setBadges] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activityDays, setActivityDays] = useState<{ day: string; active: boolean; date: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const overallProgress = projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0;

  const getElsaNote = () => {
    if (overallProgress === 0) return "Your garden is ready! Start your first project and watch your skills bloom. 🌱";
    if (overallProgress < 30) return "You're getting started! Keep the momentum going — every lesson counts. 🌿";
    if (overallProgress < 60) return "You're making great progress! Stay consistent. 🌸";
    if (overallProgress < 100) return "Almost at your goal — just a few more lessons! 🎉";
    return "Incredible! You've completed your project! 🏆";
  };

  const generateActivityDays = (lessonDates: string[]) => {
    const days = []; const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today); date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      days.push({ day: ["S","M","T","W","T","F","S"][date.getDay()], active: lessonDates.includes(dateStr), date: dateStr });
    }
    return days;
  };

  const loadData = useCallback(async (userId: string) => {
    const [s, b, p] = await Promise.all([getUserStats(userId), getUserBadges(userId), getUserProjects(userId)]);
    setStats(s); setBadges(b); setProjects(p);
    const { data: lessons } = await supabase.from("lessons").select("completed_at").eq("user_id", userId).eq("completed", true).order("completed_at", { ascending: false }).limit(7);
    setActivityDays(generateActivityDays((lessons || []).map((l: any) => l.completed_at ? new Date(l.completed_at).toISOString().split("T")[0] : "").filter(Boolean)));
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("email", authUser.email).single();
      setUser(profile || { name: authUser.email?.split("@")[0] || "Bloomer" });
      if (profile) await loadData(profile.id);
      setLoading(false);
    };
    init();
  }, [loadData]);

  const xpEarned = stats.xp || 0;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        <div className="h-8 bg-white/20 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{[...Array(4)].map((_,i)=><div key={i} className="h-24 bg-white/15 rounded-2xl animate-pulse"/>)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"><div className="h-64 bg-white/15 rounded-2xl animate-pulse"/><div className="h-64 bg-white/15 rounded-2xl animate-pulse"/></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
        <Image src="/pose2.png" alt="Achievements" width={160} height={200} className="object-contain w-36 lg:w-44 h-auto" />
        <h2 className="font-heading text-xl font-bold text-[#312E81] text-center">Please log in</h2>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="font-heading text-xl lg:text-2xl font-bold text-[#312E81]">Dashboard</h1>
        <p className="text-xs text-[#6B7280]">Track your growth and celebrate wins ✨</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {[
          { icon: "🔥", value: stats.streak, label: "Day Streak" },
          { icon: "📚", value: stats.lessons, label: "Lessons" },
          { icon: "🌱", value: stats.projects, label: "Projects" },
          { icon: "⭐", value: badges.length, label: "Badges" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/40 p-4 text-center"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
            <span className="text-2xl">{stat.icon}</span>
            <p className="font-heading text-xl lg:text-2xl font-bold text-[#312E81] mt-1">{stat.value}</p>
            <p className="text-xs text-[#6B7280]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <div className="rounded-2xl border border-white/40 p-5 lg:p-6 flex flex-col items-center"
          style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
          <h3 className="font-heading font-semibold text-[#312E81] mb-4 text-sm lg:text-base">Overall Progress</h3>
          <div className="relative w-36 h-36 lg:w-40 lg:h-40">
            <svg viewBox="0 0 160 160" className="transform -rotate-90">
              <circle cx="80" cy="80" r="68" fill="none" stroke="#E8E0F0" strokeWidth="12" />
              <motion.circle cx="80" cy="80" r="68" fill="none" stroke="url(#dashGrad)" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${(overallProgress / 100) * 427} 427`}
                initial={{ strokeDasharray: "0 427" }} animate={{ strokeDasharray: `${(overallProgress / 100) * 427} 427` }} transition={{ duration: 1.5, ease: "easeOut" }} />
              <defs><linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#EC4899" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-2xl lg:text-3xl font-bold text-[#312E81]">{overallProgress}%</span>
              <span className="text-xs text-[#6B7280]">Complete</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4 mt-4 text-xs lg:text-sm">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Done</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD]" /> Active</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#E8E0F0]" /> Upcoming</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/40 p-5 lg:p-6"
          style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-[#312E81] text-sm lg:text-base">Recent Badges</h3>
            <span className="text-xs text-[#8B5CF6] cursor-pointer hover:underline">View all</span>
          </div>
          {badges.length === 0 ? (
            <div className="text-center py-6">
              <span className="text-3xl">🏆</span>
              <p className="text-xs text-[#6B7280] mt-2">Complete lessons to earn badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              {badges.slice(0, 4).map((badge) => (
  <div key={badge.id} className="rounded-xl bg-white/40 border border-white/40 p-3 text-center hover:scale-105 transition">
    <img 
      src={getBadgeImage(badge.badge_name)} 
      alt={badge.badge_name} 
      className="w-10 h-10 lg:w-12 lg:h-12 object-contain mx-auto"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
    <p className="text-xs font-semibold text-[#312E81] mt-1">{badge.badge_name}</p>
  </div>
))}
            </div>
          )}
          {badges.length > 4 && <p className="text-center text-xs text-[#6B7280] mt-3">+{badges.length - 4} more</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-white/40 p-5 lg:p-6 mb-6"
        style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-heading font-semibold text-[#312E81] text-sm lg:text-base">This Week</h3>
          <div className="flex items-center gap-4 text-xs lg:text-sm text-[#6B7280]"><span>📚 {stats.lessons} Lessons</span><span>⚡ {xpEarned} XP</span></div>
        </div>
        <div className="flex gap-2 lg:gap-3 justify-center flex-wrap">
          {activityDays.map((d) => (
            <div key={d.date} className="text-center">
              <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold ${d.active ? "bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] text-white shadow-md" : "bg-gray-100 text-[#6B7280]"}`}>{d.day}</div>
              <p className="text-[10px] text-[#6B7280] mt-1">{d.date.split("-")[2]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/40 p-4 lg:p-5 flex items-center gap-3 lg:gap-4"
        style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
        <Image src="/pose3.png" alt="Elsa" width={50} height={60} className="object-contain w-12 lg:w-14 h-auto shrink-0" />
        <div>
          <p className="font-heading font-semibold text-[#312E81] text-sm">Elsa's Note</p>
          <p className="text-xs lg:text-sm text-[#6B7280]">{getElsaNote()}</p>
        </div>
      </div>
    </div>
  );
}
function getBadgeImage(badgeName: string): string {
  const map: Record<string, string> = {
    "First Step 🌱": "/first_step.png",
    "Code Gardener 🌿": "/code_gardener.png",
    "Knowledge Seeker 📚": "/knowledge_seeker.png",
    "Scholar Owl 🦉": "/scholar_owl.png",
    "Perfect Score ⭐": "/perfect_score.png",
    "Precision Master 🎯": "/precision_master.png",
    "Project Starter 🚀": "/project_starter.png",
    "Builder 🏗️": "/builder.png",
    "Project Master 🏆": "/project_master.png",
    "Ship It! 🚢": "/ship_it.png",
    "Triple Threat 🔥": "/triple_threat.png",
    "Consistent 🌟": "/consistent.png",
    "Weekly Warrior 🔥": "/weekly_warrior.png",
    "Monthly Master 👑": "/monthly_master.png",
  };
  return map[badgeName] || "";
}