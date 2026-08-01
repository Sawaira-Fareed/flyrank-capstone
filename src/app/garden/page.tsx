"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search, Bell, ArrowRight, Plus } from "lucide-react";

export default function GardenPage() {
  const [projectGoal, setProjectGoal] = useState("");

  return (
    <div className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌸</span>
            <span className="font-heading text-xl font-bold text-[#312E81]">BloomLab</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1.5 text-xs font-bold text-amber-700">
              🔥 7 Day Streak
            </span>
            <Bell size={20} className="text-[#6B7280] cursor-pointer" />
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/60">
              <Image src="/face.png" alt="Profile" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm text-[#6B7280]">Good evening, Blooming Coder! 👋</p>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[#312E81] mt-1">
            Let's grow something{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              amazing
            </span>{" "}
            today.
          </h1>

          {/* Project Input */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 rounded-full border border-white/40 bg-white/30 backdrop-blur-md px-5 py-3.5 shadow-lg">
              <Search size={20} className="text-[#6B7280]" />
              <input
                type="text"
                value={projectGoal}
                onChange={(e) => setProjectGoal(e.target.value)}
                placeholder="What do you want to build today?"
                className="flex-1 bg-transparent text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60"
              />
            </div>
            <button className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:scale-105 transition flex items-center gap-2">
              Explore Ideas ✨
            </button>
          </div>
        </motion.div>

        {/* Continue Learning */}
        <div className="mt-12">
          <h2 className="font-heading text-xl font-semibold text-[#312E81] mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Weather App */}
            <div
              className="rounded-2xl border border-white/40 px-5 py-5 text-center hover:scale-[1.02] transition"
              style={{
                background: "rgba(255,255,255,0.30)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 8px 24px rgba(139,92,246,0.10)",
              }}
            >
              <span className="text-3xl">🌤️</span>
              <h3 className="font-heading font-semibold text-[#312E81] mt-2">Weather App</h3>
              <p className="text-xs text-[#6B7280]">Day 7 of 12</p>
              <div className="mt-2 h-2 bg-[#C4B5FD]/30 rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" />
              </div>
              <p className="text-xs text-[#6B7280] mt-1">60%</p>
              <button className="mt-3 w-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] py-2 text-xs font-semibold text-white flex items-center justify-center gap-1 hover:scale-105 transition">
                Continue Lesson <ArrowRight size={14} />
              </button>
            </div>

            {/* Snake Game */}
            <div
              className="rounded-2xl border border-white/40 px-5 py-5 text-center hover:scale-[1.02] transition"
              style={{
                background: "rgba(255,255,255,0.30)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 8px 24px rgba(236,72,153,0.10)",
              }}
            >
              <span className="text-3xl">🎮</span>
              <h3 className="font-heading font-semibold text-[#312E81] mt-2">Snake Game</h3>
              <p className="text-xs text-[#6B7280]">Day 2 of 10</p>
              <div className="mt-2 h-2 bg-[#F9A8D4]/30 rounded-full overflow-hidden">
                <div className="h-full w-[20%] bg-gradient-to-r from-[#EC4899] to-[#F472B6] rounded-full" />
              </div>
              <p className="text-xs text-[#6B7280] mt-1">20%</p>
              <button className="mt-3 w-full rounded-full bg-gradient-to-r from-[#EC4899] to-[#F472B6] py-2 text-xs font-semibold text-white flex items-center justify-center gap-1 hover:scale-105 transition">
                Continue Lesson <ArrowRight size={14} />
              </button>
            </div>

            {/* New Project */}
            <div
              className="rounded-2xl border-2 border-dashed border-[#C4B5FD]/40 px-5 py-5 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
            >
              <Plus size={36} className="text-[#8B5CF6]/60" />
              <p className="font-heading font-semibold text-[#8B5CF6] mt-3">Start New Project</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar Info Cards */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Today's Goal */}
          <div
            className="rounded-2xl border border-white/40 p-5"
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
            }}
          >
            <p className="text-xs font-semibold text-[#6B7280] uppercase">Today's Goal</p>
            <p className="font-heading font-bold text-[#312E81] mt-1">Complete Lesson 2</p>
            <p className="text-xs text-[#6B7280]">in JavaScript Basics</p>
            <div className="mt-3 h-2 bg-[#C4B5FD]/30 rounded-full overflow-hidden">
              <div className="h-full w-[60%] bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" />
            </div>
            <p className="text-xs text-[#6B7280] mt-1">60%</p>
          </div>

          {/* Streak */}
          <div
            className="rounded-2xl border border-white/40 p-5 text-center flex flex-col items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
            }}
          >
            <span className="text-4xl">🔥</span>
            <p className="font-heading text-3xl font-bold text-[#312E81] mt-2">7</p>
            <p className="text-xs text-[#6B7280]">Day Streak</p>
          </div>

          {/* Elsa Character */}
          <div
            className="rounded-2xl border border-white/40 p-5 text-center flex flex-col items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
            }}
          >
            <Image
              src="/glimpse-character.png"
              alt="Mascot"
              width={100}
              height={100}
              className="object-contain w-20 h-auto mx-auto"
            />
            <p className="text-sm font-semibold text-[#312E81] mt-2">You're doing great!</p>
            <p className="text-xs text-[#6B7280]">Keep blooming 🌸</p>
          </div>
        </div>
      </div>
    </div>
  );
}