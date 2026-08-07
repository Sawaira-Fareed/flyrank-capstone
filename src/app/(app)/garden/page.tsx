"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Plus, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getUserProjects, getUserStats, createProject } from "@/lib/store";

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/40 px-5 py-5 animate-pulse" style={{ background: "rgba(255,255,255,0.20)" }}>
      <div className="w-12 h-12 bg-white/40 rounded-full mx-auto" />
      <div className="h-5 bg-white/40 rounded mt-4 mx-auto w-3/4" />
      <div className="h-3 bg-white/30 rounded mt-2 mx-auto w-1/2" />
      <div className="h-2 bg-white/30 rounded-full mt-3" />
      <div className="h-3 bg-white/30 rounded mt-1 mx-auto w-1/4" />
      <div className="h-8 bg-white/40 rounded-full mt-3" />
    </div>
  );
}

export default function GardenPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ streak: 0, lessons: 0, projects: 0 });
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalGoal, setModalGoal] = useState("");
  const [modalCreating, setModalCreating] = useState(false);

  const loadData = useCallback(async (userId: string) => {
    const [userProjects, userStats] = await Promise.all([getUserProjects(userId), getUserStats(userId)]);
    setProjects(userProjects); setStats(userStats);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("email", authUser.email).single();
      setUser(profile || { name: authUser.email?.split("@")[0] || "Bloomer", email: authUser.email });
      if (profile) await loadData(profile.id);
      setLoading(false);
    };
    init();
  }, [loadData]);

  const handleCreate = async (goalOverride?: string) => {
    const goal = goalOverride || newGoal.trim();
    if (!goal || !user) return;
    if (goalOverride) setModalCreating(true);
    else setCreating(true);
    
    try {
      const project = await createProject(user.id, goal);
      if (project) {
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                {
                  role: "user",
                  content: `[SKILL_MAP_REQUEST] Generate a skill map for a project called "${goal}". The project goal is: "${goal}". Return ONLY a JSON array of skills.`,
                },
              ],
            }),
          });

          if (res.ok) {
            const fullText = await res.text();
            let skills = [];
            const jsonMatch = fullText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              try { skills = JSON.parse(jsonMatch[0]); } catch {}
            }

            if (skills.length > 0) {
              await supabase.from("skills").insert(
                skills.map((s: any, i: number) => ({
                  project_id: project.id,
                  name: s.name,
                  description: s.description || "",
                  days: s.days || 2,
                  status: i === 0 ? "active" : "locked",
                  sort_order: i,
                }))
              );
            }
          }
        } catch {}
        setNewGoal("");
        setModalGoal("");
        setShowCreateModal(false);
        await loadData(user.id);
      }
    } finally { 
      setCreating(false); 
      setModalCreating(false); 
    }
  };

  const activeProjects = projects.filter((p) => p.status === "active");

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        <div className="h-4 bg-white/20 rounded w-48 mb-2 animate-pulse" />
        <div className="h-8 bg-white/20 rounded w-96 mb-8 animate-pulse" />
        <div className="flex gap-3 mb-12"><div className="flex-1 h-14 bg-white/20 rounded-full animate-pulse" /><div className="w-40 h-14 bg-white/20 rounded-full animate-pulse" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5"><CardSkeleton /><CardSkeleton /></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
        <Image src="/flower.png" alt="Elsa" width={180} height={220} className="object-contain w-36 lg:w-44 h-auto" />
        <h2 className="font-heading text-xl lg:text-2xl font-bold text-[#312E81] text-center">Welcome to Your Garden</h2>
        <p className="text-sm text-[#6B7280] text-center">Log in to start growing your coding skills.</p>
        <div className="flex gap-3 mt-2">
          <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white hover:scale-105 transition">Log In</Link>
          <Link href="/signup" className="rounded-full border border-[#C4B5FD]/40 bg-white/40 px-6 py-2.5 text-sm font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition">Sign Up</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <p className="text-sm text-[#6B7280]">Good evening, {user.name} 👋</p>
        <h1 className="font-heading text-2xl lg:text-4xl font-bold text-[#312E81] mt-1">
          Let's grow something{" "}
          <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">amazing</span> today.
        </h1>
        <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 flex items-center gap-3 rounded-full border border-white/40 bg-white/30 backdrop-blur-md px-4 lg:px-5 py-3 lg:py-3.5 shadow-lg">
            <Search size={18} className="text-[#6B7280] shrink-0" />
            <input type="text" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreate()} placeholder="What do you want to build today?" className="flex-1 min-w-0 bg-transparent text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60" />
          </div>
          <button onClick={() => handleCreate()} disabled={!newGoal.trim() || creating} className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] px-5 lg:px-6 py-3 lg:py-3.5 text-sm font-semibold text-white shadow-lg hover:scale-105 transition disabled:opacity-50 flex items-center justify-center gap-2 shrink-0">
            {creating ? <Loader2 size={16} className="animate-spin" /> : null}{creating ? "Creating..." : "Explore Ideas ✨"}
          </button>
        </div>
      </motion.div>

      {/* Main Layout: Projects (Left) + Sidebar Cards (Right) */}
      <div className="mt-10 lg:mt-12 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* LEFT — Projects */}
        <div className="flex-1 min-w-0">
          <h2 className="font-heading text-lg lg:text-xl font-semibold text-[#312E81] mb-4">
            {activeProjects.length > 0 ? "Continue Learning" : "Your Garden"}
          </h2>
          {projects.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/40 p-6 lg:p-8 text-center"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
              <Image src="/flower.png" alt="Plant your first project" width={120} height={140} className="object-contain w-28 lg:w-36 h-auto mx-auto" />
              <h3 className="font-heading text-lg lg:text-xl font-bold text-[#312E81] mt-4">Your garden is empty</h3>
              <p className="text-sm text-[#6B7280] mt-1">Type a project goal above and Elsa will create your personalized learning path!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              {projects.map((project) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }}
                  className="rounded-2xl border border-white/40 px-4 lg:px-5 py-4 lg:py-5 text-center cursor-pointer transition"
                  style={{ background: "rgba(255,255,255,0.30)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.10)" }}
                  onClick={() => router.push(`/projects/${project.id}`)}>
                  <span className="text-2xl lg:text-3xl">{project.status === "completed" ? "✅" : project.status === "saved_for_later" ? "📌" : "🚀"}</span>
                  <h3 className="font-heading font-semibold text-[#312E81] mt-2 text-sm lg:text-base">{project.title}</h3>
                  <p className="text-xs text-[#6B7280]">{project.status === "completed" ? "Completed" : project.status === "saved_for_later" ? "Saved" : `Day ${project.current_day} of ${project.total_days}`}</p>
                  <div className="mt-2 h-2 bg-[#C4B5FD]/30 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" style={{ width: `${project.progress || 0}%` }} /></div>
                  <p className="text-xs text-[#6B7280] mt-1">{project.progress || 0}%</p>
                  <button className="mt-3 w-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] py-2 text-xs font-semibold text-white flex items-center justify-center gap-1 hover:scale-105 transition">
                    {project.status === "completed" ? "Review" : "Continue"} <ArrowRight size={14} />
                  </button>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }}
                onClick={() => setShowCreateModal(true)}
                className="rounded-2xl border-2 border-dashed border-[#C4B5FD]/40 px-4 lg:px-5 py-4 lg:py-5 flex flex-col items-center justify-center text-center cursor-pointer transition"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(14px)" }}>
                <Plus size={32} className="text-[#8B5CF6]/60" />
                <p className="font-heading font-semibold text-[#8B5CF6] mt-2 text-sm">Start New Project</p>
              </motion.div>
            </div>
          )}
        </div>

        {/* RIGHT — Sidebar Cards: Streak → Today's Goal → Mascot */}
        <div className="lg:w-56 shrink-0 flex flex-col gap-4">
          <div className="rounded-2xl border border-white/40 p-4 text-center"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
            <span className="text-3xl">🔥</span>
            <p className="font-heading text-2xl font-bold text-[#312E81] mt-1">{stats.streak}</p>
            <p className="text-xs text-[#6B7280]">Day Streak</p>
          </div>
          <div className="rounded-2xl border border-white/40 p-4"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
            <p className="text-xs font-semibold text-[#6B7280] uppercase">Today's Goal</p>
            <p className="font-heading font-bold text-[#312E81] mt-1 text-sm">{activeProjects.length > 0 ? `Work on ${activeProjects[0].title}` : "Start your first project"}</p>
            <p className="text-xs text-[#6B7280]">Every lesson brings you closer.</p>
            <div className="mt-3 h-2 bg-[#C4B5FD]/30 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" style={{ width: `${activeProjects[0]?.progress || 0}%` }} /></div>
          </div>
          <div className="rounded-2xl border border-white/40 p-4 text-center flex-1 flex flex-col items-center justify-center"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
            <Image src="/glimpse-character.png" alt="Mascot" width={80} height={80} className="object-contain w-20 h-auto mx-auto" />
            <p className="text-sm font-semibold text-[#312E81] mt-2">You're doing great!</p>
            <p className="text-xs text-[#6B7280]">Keep blooming 🌸</p>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/40 p-6 w-full max-w-md"
            style={{ background: "rgba(255,255,255,0.90)", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(139,92,246,0.15)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-bold text-[#312E81]">Create New Project</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-full hover:bg-white/40">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B7280]"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">What do you want to build?</p>
            <input type="text" value={modalGoal} onChange={(e) => setModalGoal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate(modalGoal)}
              placeholder="e.g., A weather app..."
              className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-5 py-3 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 mb-4 focus:border-[#8B5CF6]" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowCreateModal(false)} className="rounded-full border border-[#C4B5FD]/40 bg-white/50 px-5 py-2.5 text-sm text-[#6B7280]">Cancel</button>
              <button onClick={() => handleCreate(modalGoal)} disabled={!modalGoal.trim() || modalCreating}
                className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 transition disabled:opacity-50 flex items-center gap-2">
                {modalCreating ? "Creating..." : "Create →"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}