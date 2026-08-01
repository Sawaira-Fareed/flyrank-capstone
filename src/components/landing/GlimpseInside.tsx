"use client";

import Image from "next/image";
import { Search, Bell, Plus, ArrowRight } from "lucide-react";

const sparkles = [
  { left: "5%", top: "8%", size: "2px", opacity: 0.4 },
  { left: "15%", top: "20%", size: "3px", opacity: 0.5 },
  { left: "25%", top: "5%", size: "2px", opacity: 0.3 },
  { left: "35%", top: "15%", size: "4px", opacity: 0.6 },
  { left: "45%", top: "25%", size: "2px", opacity: 0.35 },
  { left: "55%", top: "10%", size: "3px", opacity: 0.5 },
  { left: "65%", top: "18%", size: "2px", opacity: 0.4 },
  { left: "75%", top: "6%", size: "4px", opacity: 0.55 },
  { left: "85%", top: "22%", size: "2px", opacity: 0.3 },
  { left: "92%", top: "12%", size: "3px", opacity: 0.45 },
  { left: "8%", top: "90%", size: "2px", opacity: 0.4 },
  { left: "30%", top: "85%", size: "3px", opacity: 0.5 },
  { left: "50%", top: "92%", size: "2px", opacity: 0.35 },
  { left: "70%", top: "88%", size: "4px", opacity: 0.5 },
  { left: "88%", top: "95%", size: "2px", opacity: 0.4 },
];

export default function GlimpseInside() {
  return (
    <section id="glimpse-inside" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDF2F8] via-[#FFF5F5] to-[#EDE9FE]" />
      <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#C4B5FD]/20 blur-[140px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#F9A8D4]/15 blur-[140px]" />

      {/* Decorative leaves */}
      <div className="absolute bottom-4 left-4 text-6xl lg:text-8xl opacity-50 pointer-events-none select-none">🍃</div>
      <div className="absolute bottom-4 right-4 text-6xl lg:text-8xl opacity-50 pointer-events-none select-none">🍃</div>

      {/* Sparkles */}
      {sparkles.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            left: star.left,
            top: star.top,
            opacity: star.opacity,
            boxShadow: "0 0 5px rgba(255,255,255,0.7)",
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="text-center font-heading text-4xl lg:text-5xl font-bold text-[#312E81] mb-4">
  <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
    A Glimpse Inside
  </span>
</h2>

        <h2 className="text-center font-heading text-4xl lg:text-5xl font-bold text-[#312E81] mb-2">
          See BloomLab in action
        </h2>
        <p className="text-center text-[#6B7280] mb-12">
          Your personalized learning journey, beautifully designed.
        </p>

        {/* Dashboard Window */}
        <div
          className="rounded-[32px] border border-white/50 bg-white/25 backdrop-blur-xl shadow-2xl overflow-hidden"
          style={{ boxShadow: "0 30px 80px rgba(167,139,250,0.2)" }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/30 bg-white/20">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌸</span>
              <span className="font-heading font-bold text-[#312E81]">BloomLab</span>
            </div>
            <div className="flex items-center gap-4">
              <Bell size={20} className="text-[#6B7280]" />
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/60 bg-[#C4B5FD]/20">
  <Image src="/face.png" alt="Profile" fill className="object-cover scale-150" />
</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex">
            {/* Left Sidebar */}
            <div className="hidden lg:flex flex-col w-52 p-4 border-r border-white/20 bg-white/10 gap-1">
              
              {[
                { label: "My Garden", icon: "✦", active: true },
                { label: "Projects", icon: "📁" },
                { label: "Skill Map", icon: "🗺️" },
                { label: "Learn", icon: "📖" },
                { label: "Progress", icon: "📊" },
                { label: "Settings", icon: "⚙️" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm cursor-pointer transition ${
                    item.active
                      ? "bg-[#8B5CF6]/15 text-[#7C3AED] font-semibold"
                      : "text-[#6B7280] hover:bg-white/20"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
              <div className="mt-auto pt-4 border-t border-white/20">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/20">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#C4B5FD]/20">
  <Image src="/face.png" alt="Elsa" fill className="object-cover scale-150" />
</div>
                  <div>
                    <p className="text-xs font-semibold text-[#312E81]">Elsa</p>
                    <p className="text-xs text-[#6B7280]">AI Mentor</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ml-auto" />
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div className="flex-1 p-6">
              <p className="text-sm text-[#6B7280]">Good evening, Blooming Coder! 👋</p>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#312E81] mt-1">
                Let's grow something{" "}
                <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                  amazing
                </span>{" "}
                today.
              </h2>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3 rounded-full border border-white/40 bg-white/40 backdrop-blur px-5 py-3">
                  <Search size={18} className="text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="What do you want to build today?"
                    className="flex-1 bg-transparent text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60"
                    readOnly
                  />
                </div>
                <button className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] px-5 py-3 text-sm font-semibold text-white shadow-lg flex items-center gap-2 hover:scale-105 transition">
                  Explore Ideas ✨
                </button>
              </div>

              <p className="font-heading font-semibold text-[#312E81] mt-8 mb-4">Continue Learning</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className="rounded-2xl border border-white/40 px-4 py-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.30)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "0 8px 24px rgba(139,92,246,0.10)",
                  }}
                >
                  <span className="text-3xl">🌤️</span>
                  <h4 className="font-heading font-semibold text-[#312E81] mt-2">Weather App</h4>
                  <p className="text-xs text-[#6B7280]">Day 7 of 12</p>
                  <div className="mt-2 h-2 bg-[#C4B5FD]/30 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" />
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">60%</p>
                  <button className="mt-3 w-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] py-2 text-xs font-semibold text-white flex items-center justify-center gap-1 hover:scale-105 transition">
                    Continue Lesson <ArrowRight size={14} />
                  </button>
                </div>

                <div
                  className="rounded-2xl border border-white/40 px-4 py-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.30)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "0 8px 24px rgba(236,72,153,0.10)",
                  }}
                >
                  <span className="text-3xl">🎮</span>
                  <h4 className="font-heading font-semibold text-[#312E81] mt-2">Snake Game</h4>
                  <p className="text-xs text-[#6B7280]">Day 2 of 10</p>
                  <div className="mt-2 h-2 bg-[#F9A8D4]/30 rounded-full overflow-hidden">
                    <div className="h-full w-[20%] bg-gradient-to-r from-[#EC4899] to-[#F472B6] rounded-full" />
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">20%</p>
                  <button className="mt-3 w-full rounded-full bg-gradient-to-r from-[#EC4899] to-[#F472B6] py-2 text-xs font-semibold text-white flex items-center justify-center gap-1 hover:scale-105 transition">
                    Continue Lesson <ArrowRight size={14} />
                  </button>
                </div>

                <div
                  className="rounded-2xl border-2 border-dashed border-[#C4B5FD]/40 px-4 py-4 flex flex-col items-center justify-center text-center"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <Plus size={32} className="text-[#8B5CF6]/60" />
                  <p className="font-heading font-semibold text-[#8B5CF6] mt-2">Start New Project</p>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:flex flex-col w-56 p-4 border-l border-white/20 bg-white/10 gap-4">
              <div
                className="rounded-2xl border border-white/40 bg-white/25 backdrop-blur-md p-4 text-center"
                style={{ boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-bold text-amber-700">
                  🔥 7 Day Streak
                </span>
              </div>

              <div
                className="rounded-2xl border border-white/40 bg-white/25 backdrop-blur-md p-4"
                style={{ boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}
              >
                <p className="text-xs font-semibold text-[#6B7280] uppercase">Today's Goal</p>
                <p className="font-heading font-bold text-[#312E81] mt-1">Complete Lesson 2</p>
                <p className="text-xs text-[#6B7280]">in JavaScript Basics</p>
                <div className="mt-3 h-2 bg-[#C4B5FD]/30 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" />
                </div>
                <p className="text-xs text-[#6B7280] mt-1">60%</p>
              </div>

              <div
                className="rounded-2xl border border-white/40 bg-white/25 backdrop-blur-md p-4 text-center flex-1 flex flex-col items-center justify-center"
                style={{ boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}
              >
                <Image
                  src="/glimpse-character.png"
                  alt="Mascot"
                  width={140}
                  height={140}
                  className="object-contain w-28 lg:w-36 h-auto mx-auto"
                />
                <p className="text-sm font-semibold text-[#312E81] mt-3">You're doing great!</p>
                <p className="text-xs text-[#6B7280]">Keep blooming 🌸</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}