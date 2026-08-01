"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";

const skillNodes = [
  { id: 1, name: "APIs & Fetching", status: "completed" },
  { id: 2, name: "Displaying Data", status: "active" },
  { id: 3, name: "Styling with CSS", status: "locked" },
  { id: 4, name: "User Input & Forms", status: "locked" },
  { id: 5, name: "Deploy to Internet", status: "locked" },
];

export default function SkillMapPage() {
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
            <span className="font-heading text-xl font-bold text-[#312E81]">Skill Map</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Project Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div
              className="rounded-2xl border border-white/40 p-6"
              style={{
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
              }}
            >
              <span className="text-4xl">🌤️</span>
              <h2 className="font-heading text-xl font-bold text-[#312E81] mt-3">Weather App</h2>
              <p className="text-sm text-[#6B7280] mt-1">Your Project Goal</p>

              <div className="mt-6">
                <p className="text-3xl font-bold text-[#312E81]">60%</p>
                <p className="text-xs text-[#6B7280]">Overall Progress</p>
                <div className="mt-2 h-2.5 bg-[#C4B5FD]/30 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" />
                </div>
              </div>

              <p className="text-sm text-[#6B7280] mt-4">
                <span className="font-semibold text-[#312E81]">Estimated days left:</span> 5 days
              </p>

              <button className="mt-6 w-full rounded-full border border-[#C4B5FD]/40 bg-white/40 backdrop-blur px-4 py-2.5 text-sm font-medium text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition">
                Change Goal
              </button>
            </div>
          </motion.div>

          {/* Right — Skill Path */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div
              className="rounded-2xl border border-white/40 p-8"
              style={{
                background: "rgba(255,255,255,0.20)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
              }}
            >
              <div className="relative">
                {skillNodes.map((node, index) => (
                  <div key={node.id} className="relative">
                    {/* Node */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="flex items-center gap-5 mb-2"
                    >
                      {/* Circle */}
                      <div
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all ${
                          node.status === "completed"
                            ? "bg-emerald-400 border-emerald-500 text-white"
                            : node.status === "active"
                            ? "bg-[#8B5CF6] border-[#A78BFA] text-white ring-4 ring-[#C4B5FD]/40"
                            : "bg-gray-200 border-gray-300 text-gray-400"
                        }`}
                      >
                        {node.status === "completed" ? "✓" : node.status === "active" ? "●" : "🔒"}
                      </div>

                      {/* Label */}
                      <div className="flex-1">
                        <p className={`font-heading font-semibold ${
                          node.status === "locked" ? "text-[#6B7280]/50" : "text-[#312E81]"
                        }`}>
                          {node.name}
                        </p>
                        {node.status === "active" && (
                          <span className="inline-block mt-1 rounded-full bg-[#8B5CF6]/10 px-3 py-0.5 text-xs font-semibold text-[#8B5CF6]">
                            Today
                          </span>
                        )}
                        {node.status === "completed" && (
                          <span className="inline-block mt-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                            Completed
                          </span>
                        )}
                      </div>
                    </motion.div>

                    {/* Connector line */}
                    {index < skillNodes.length - 1 && (
                      <div className="ml-6 h-8 w-0.5 bg-gradient-to-b from-[#C4B5FD] to-[#C4B5FD]/30" />
                    )}
                  </div>
                ))}

                {/* Final Goal */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 ml-16"
                >
                  <div
                    className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#F472B6]/40 px-4 py-2.5"
                    style={{ background: "rgba(244,114,182,0.08)" }}
                  >
                    <span className="text-lg">🏁</span>
                    <span className="text-sm font-semibold text-[#EC4899]">Build Your Weather App!</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="mt-6 text-center">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:scale-105 transition"
              >
                Start Today's Lesson →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}