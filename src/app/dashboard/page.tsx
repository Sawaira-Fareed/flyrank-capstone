"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/garden" className="text-[#6B7280] hover:text-[#312E81] transition">
              <ArrowLeft size={22} />
            </Link>
            <span className="font-heading text-xl font-bold text-[#312E81]">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1.5 text-xs font-bold text-amber-700">
              🔥 7 Day Streak
            </span>
            <Bell size={20} className="text-[#6B7280]" />
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/60">
              <Image src="/face.png" alt="Profile" fill className="object-cover" />
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl font-bold text-[#312E81]">Track your growth</h1>
          <p className="text-sm text-[#6B7280] mt-1">and celebrate wins ✨</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { icon: "🔥", value: "18", label: "Day Streak", color: "bg-amber-50", textColor: "text-amber-700" },
            { icon: "🧠", value: "42", label: "Lessons Done", color: "bg-violet-50", textColor: "text-violet-700" },
            { icon: "🌱", value: "3", label: "Projects", color: "bg-emerald-50", textColor: "text-emerald-700" },
            { icon: "⭐", value: "15", label: "Badges", color: "bg-pink-50", textColor: "text-pink-700" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/40 p-5 text-center"
              style={{
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
              }}
            >
              <span className="text-3xl">{stat.icon}</span>
              <p className="font-heading text-3xl font-bold text-[#312E81] mt-2">{stat.value}</p>
              <p className="text-xs text-[#6B7280]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Progress Ring */}
          <div
            className="rounded-2xl border border-white/40 p-6 flex flex-col items-center"
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
            }}
          >
            <h3 className="font-heading font-semibold text-[#312E81] mb-4">Overall Progress</h3>
            {/* Circular Progress */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 160 160" className="transform -rotate-90">
                <circle cx="80" cy="80" r="68" fill="none" stroke="#E8E0F0" strokeWidth="12" />
                <circle
                  cx="80" cy="80" r="68" fill="none" stroke="url(#grad)"
                  strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(67 / 100) * 427} 427`}
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-3xl font-bold text-[#312E81]">67%</span>
                <span className="text-xs text-[#6B7280]">Complete</span>
              </div>
            </div>
            <div className="flex gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#8B5CF6]" /> Completed 42%</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#C4B5FD]" /> In Progress 25%</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#E8E0F0]" /> Upcoming 33%</div>
            </div>
          </div>

          {/* Badges */}
          <div
            className="rounded-2xl border border-white/40 p-6"
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-[#312E81]">Recent Badges</h3>
              <span className="text-xs text-[#8B5CF6] cursor-pointer hover:underline">View all</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🔌", name: "API Explorer", color: "bg-blue-50" },
                { icon: "🌿", name: "Code Gardener", color: "bg-emerald-50" },
                { icon: "🐛", name: "Bug Squasher", color: "bg-amber-50" },
                { icon: "🔥", name: "Streak Master", color: "bg-pink-50" },
              ].map((badge) => (
                <div
                  key={badge.name}
                  className={`rounded-xl ${badge.color} border border-white/40 p-3 text-center`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-xs font-semibold text-[#312E81] mt-1">{badge.name}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-[#6B7280] mt-4">+11 more badges</p>
          </div>
        </div>

        {/* Activity Calendar */}
        <div
          className="mt-6 rounded-2xl border border-white/40 p-6"
          style={{
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-[#312E81]">This Week</h3>
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <span>📚 6 Lessons</span>
              <span>⚡ 240 XP Earned</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            {[
              { day: "M", active: true },
              { day: "T", active: true },
              { day: "W", active: true },
              { day: "T", active: false },
              { day: "F", active: false },
              { day: "S", active: false },
              { day: "S", active: false },
            ].map((d) => (
              <div key={d.day} className="text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    d.active
                      ? "bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] text-white"
                      : "bg-gray-100 text-[#6B7280]"
                  }`}
                >
                  {d.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elsa Note */}
        <div
          className="mt-6 rounded-2xl border border-white/40 p-5 flex items-center gap-4"
          style={{
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
          }}
        >
          <span className="text-3xl">👩‍🏫</span>
          <div>
            <p className="font-heading font-semibold text-[#312E81] text-sm">Elsa's Note</p>
            <p className="text-sm text-[#6B7280]">
              "You're doing amazing! Your API skills are getting strong. This week let's focus on making things beautiful with CSS!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}