"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LearningSummaryData {
  projects: { title: string; progress: number; status: string }[];
  totalSkills: number;
  completedSkills: number;
  activeSkill: string | null;
  streak: number;
  xp: number;
  badges: string[];
  recentLessons: string[];
}

export default function LearningSummaryCard({ data }: { data: LearningSummaryData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-white/40 p-4 bg-white/30 backdrop-blur-sm"
      style={{ boxShadow: "0 4px 16px rgba(139,92,246,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📊</span>
        <h4 className="font-heading font-semibold text-[#312E81] text-sm">Learning Summary</h4>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-xl bg-white/40 p-2 text-center">
          <p className="text-lg font-bold text-[#312E81]">{data.streak}</p>
          <p className="text-[9px] text-[#6B7280]">🔥 Streak</p>
        </div>
        <div className="rounded-xl bg-white/40 p-2 text-center">
          <p className="text-lg font-bold text-[#312E81]">{data.xp}</p>
          <p className="text-[9px] text-[#6B7280]">⚡ XP</p>
        </div>
        <div className="rounded-xl bg-white/40 p-2 text-center">
          <p className="text-lg font-bold text-[#312E81]">{data.completedSkills}/{data.totalSkills}</p>
          <p className="text-[9px] text-[#6B7280]">✅ Skills</p>
        </div>
      </div>

      {/* Active Skill */}
      {data.activeSkill && (
        <div className="rounded-xl bg-[#8B5CF6]/10 p-2 mb-2">
          <p className="text-[10px] text-[#8B5CF6] font-semibold">🎯 Currently Learning</p>
          <p className="text-xs text-[#312E81] mt-0.5">{data.activeSkill}</p>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-2">
          <p className="text-[10px] text-[#6B7280] font-semibold mb-1">🚀 Projects</p>
          {data.projects.slice(0, 3).map((project, i) => (
            <div key={i} className="flex items-center gap-2 mb-1">
              <span className="text-xs text-[#312E81] truncate flex-1">{project.title}</span>
              <div className="w-16 h-1.5 bg-[#C4B5FD]/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
              <span className="text-[9px] text-[#6B7280]">{project.progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Badges */}
      {data.badges.length > 0 && (
        <div className="mb-2">
          <p className="text-[10px] text-[#6B7280] font-semibold mb-1">🏆 Recent Badges</p>
          <div className="flex gap-1 flex-wrap">
            {data.badges.slice(0, 4).map((badge, i) => (
              <span key={i} className="text-[9px] bg-white/50 rounded-full px-2 py-0.5 text-[#312E81]">{badge}</span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Lessons */}
      {data.recentLessons.length > 0 && (
        <div>
          <p className="text-[10px] text-[#6B7280] font-semibold mb-1">📚 Recent Lessons</p>
          <div className="flex gap-1 flex-wrap">
            {data.recentLessons.slice(0, 3).map((lesson, i) => (
              <span key={i} className="text-[9px] bg-white/50 rounded-full px-2 py-0.5 text-[#312E81]">{lesson}</span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}