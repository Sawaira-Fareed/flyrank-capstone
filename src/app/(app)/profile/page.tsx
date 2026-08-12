"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Calendar, Award, Clock, Target } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getUserStats, getUserBadges } from "@/lib/store";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ streak: 0, lessons: 0, projects: 0, xp: 0, completedLessons: 0 });
  const [badges, setBadges] = useState<any[]>([]);
  const [avatarUrl, setAvatarUrl] = useState("/idle.png");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("email", authUser.email).single();
      setUser(profile || { name: authUser.email?.split("@")[0] || "Bloomer", email: authUser.email || "" });
      if (profile) {
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
        setStats(await getUserStats(profile.id));
        setBadges(await getUserBadges(profile.id));
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col items-center mb-8"><div className="w-28 h-28 rounded-full bg-white/20 animate-pulse mb-3" /><div className="h-4 w-40 bg-white/20 rounded animate-pulse" /></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{[...Array(4)].map((_,i)=><div key={i} className="h-20 bg-white/15 rounded-2xl animate-pulse"/>)}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
        <img src="/idle.png" alt="Profile" className="w-36 lg:w-44 h-auto object-contain" />
        <h2 className="font-heading text-xl font-bold text-[#312E81] text-center">Please log in</h2>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex flex-col items-center mb-8 mt-4">
        <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 border-white/60 shadow-xl mb-3">
          <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#312E81]">{user.name}</h1>
        <p className="text-sm text-[#6B7280] flex items-center gap-1 mt-1"><Mail size={14} /> {user.email}</p>
        {user.created_at && (
          <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5"><Calendar size={12} /> Joined {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {[
          { icon: "🔥", value: stats.streak, label: "Day Streak" },
          { icon: "📚", value: stats.lessons, label: "Lessons" },
          { icon: "💻", value: stats.projects, label: "Projects" },
          { icon: "⭐", value: badges.length, label: "Badges" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/40 p-4 text-center"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
            <span className="text-2xl">{stat.icon}</span>
            <p className="font-heading text-xl lg:text-2xl font-bold text-[#312E81] mt-1">{stat.value}</p>
            <p className="text-xs text-[#6B7280]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <div className="rounded-2xl border border-white/40 p-5"
          style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
          <h2 className="font-heading font-semibold text-[#312E81] text-sm mb-4 flex items-center gap-2"><Target size={18} /> Learning Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm"><span className="text-[#6B7280] flex items-center gap-2"><Clock size={14} /> Total lessons</span><span className="font-semibold text-[#312E81]">{stats.lessons}</span></div>
            <div className="flex items-center justify-between text-sm"><span className="text-[#6B7280] flex items-center gap-2"><Target size={14} /> Projects built</span><span className="font-semibold text-[#312E81]">{stats.projects}</span></div>
            <div className="flex items-center justify-between text-sm"><span className="text-[#6B7280] flex items-center gap-2">🔥 Current streak</span><span className="font-semibold text-[#312E81]">{stats.streak} days</span></div>
            <div className="flex items-center justify-between text-sm"><span className="text-[#6B7280] flex items-center gap-2">⚡ XP earned</span><span className="font-semibold text-[#312E81]">{stats.xp || 0}</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/40 p-5"
          style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
          <h2 className="font-heading font-semibold text-[#312E81] text-sm mb-4 flex items-center gap-2"><Award size={18} /> Badges Earned</h2>
          {badges.length === 0 ? (
            <div className="text-center py-6">
              <img src="/pose2.png" alt="Badges" className="w-20 h-auto mx-auto mb-2 object-contain" />
              <p className="text-xs text-[#6B7280]">Complete lessons to earn badges!</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
  {badges.slice(0, 8).map((badge) => (
    <div key={badge.id} className="flex flex-col items-center hover:scale-110 transition">
      <img 
        src={getBadgeImage(badge.badge_name)} 
        alt={badge.badge_name} 
        className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    </div>
  ))}
</div>
          )}  
        </div>
          
      </div>

      <div className="rounded-2xl border border-white/40 p-4 flex items-center gap-3"
        style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
        <img src="/pose11.png" alt="Elsa" className="w-12 lg:w-14 h-auto object-contain shrink-0" />
        <div>
          <p className="font-heading font-semibold text-[#312E81] text-sm">Elsa's Note</p>
          <p className="text-xs text-[#6B7280]">
            {stats.projects === 0 ? "Start your first project and watch your skills bloom! 🌱" :
             stats.lessons < 5 ? "You're just getting started — keep the momentum! 🌿" :
             "You're making amazing progress. Keep blooming! 🌸"}
          </p>
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