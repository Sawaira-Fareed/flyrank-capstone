"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, ArrowRight, Plus, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getUserProjects, getUserStats, createProject } from "@/lib/store";

export default function GardenPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ streak: 0, lessons: 0, projects: 0 });
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState("");
  const [creating, setCreating] = useState(false);

  const loadData = useCallback(async (userId: string) => {
    const [userProjects, userStats] = await Promise.all([
      getUserProjects(userId),
      getUserStats(userId),
    ]);
    setProjects(userProjects);
    setStats(userStats);
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

  const handleCreate = async () => {
    if (!newGoal.trim() || !user) return;
    setCreating(true);
    try {
      const project = await createProject(user.id, newGoal.trim());

      if (project) {
        // Silent skill map generation using [SKILL_MAP_REQUEST] tag
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                { role: "user", content: `[SKILL_MAP_REQUEST] ${newGoal.trim()}` },
              ],
            }),
          });

          const reader = res.body?.getReader();
          const decoder = new TextDecoder();
          let fullText = "";

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              fullText += decoder.decode(value, { stream: true });
            }
          }

          const jsonMatch = fullText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const skills = JSON.parse(jsonMatch[0]);
            const skillRows = skills.map((skill: any, index: number) => ({
              project_id: project.id,
              name: skill.name,
              description: skill.description,
              days: skill.days || 2,
              status: index === 0 ? "active" : "locked",
              sort_order: index,
            }));
            await supabase.from("skills").insert(skillRows);
          }
        } catch (aiError) {
          console.log("AI skill generation failed — project created without skills");
        }

        setNewGoal("");
        await loadData(user.id);
      }
    } finally {
      setCreating(false);
    }
  };

  const activeProjects = projects.filter((p) => p.status === "active");

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
        <Image src="/flower.png" alt="Elsa" width={180} height={220} className="object-contain" />
        <h2 className="font-heading text-2xl font-bold text-[#312E81]">Welcome to Your Garden</h2>
        <p className="text-sm text-[#6B7280]">Log in to start growing your coding skills.</p>
        <div className="flex gap-3 mt-2">
          <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white hover:scale-105 transition">Log In</Link>
          <Link href="/signup" className="rounded-full border border-[#C4B5FD]/40 bg-white/40 px-6 py-2.5 text-sm font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition">Sign Up</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌸</span>
            <span className="font-heading text-xl font-bold text-[#312E81]">BloomLab</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1.5 text-xs font-bold text-amber-700">🔥 {stats.streak} Day Streak</span>
            <Bell size={20} className="text-[#6B7280] cursor-pointer" />
            <Link href="/profile" className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/60">
              <Image src="/idle.png" alt="Profile" fill className="object-cover" />
            </Link>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-sm text-[#6B7280]">Good evening, {user.name} 👋</p>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[#312E81] mt-1">
            Let's grow something{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">amazing</span> today.
          </h1>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 rounded-full border border-white/40 bg-white/30 backdrop-blur-md px-5 py-3.5 shadow-lg">
              <Search size={20} className="text-[#6B7280]" />
              <input type="text" value={newGoal} onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="What do you want to build today?"
                className="flex-1 bg-transparent text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60" />
            </div>
            <button onClick={handleCreate} disabled={!newGoal.trim() || creating}
              className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:scale-105 transition disabled:opacity-50 flex items-center gap-2">
              {creating ? <Loader2 size={16} className="animate-spin" /> : null}
              {creating ? "Creating..." : "Explore Ideas ✨"}
            </button>
          </div>
        </motion.div>

        <div className="mt-12">
          <h2 className="font-heading text-xl font-semibold text-[#312E81] mb-4">
            {activeProjects.length > 0 ? "Continue Learning" : "Your Garden"}
          </h2>

          {projects.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/40 p-8 text-center"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
              <Image src="/flower.png" alt="Plant your first project" width={140} height={160} className="object-contain mx-auto" />
              <h3 className="font-heading text-xl font-bold text-[#312E81] mt-4">Your garden is empty</h3>
              <p className="text-sm text-[#6B7280] mt-1 max-w-md mx-auto">
                Type a project goal above and Elsa will create your personalized learning path!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl border border-white/40 px-5 py-5 text-center cursor-pointer transition"
                  style={{ background: "rgba(255,255,255,0.30)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.10)" }}
                  onClick={() => router.push(`/projects/${project.id}`)}>
                  <span className="text-3xl">{project.status === "completed" ? "✅" : "🚀"}</span>
                  <h3 className="font-heading font-semibold text-[#312E81] mt-2">{project.title}</h3>
                  <p className="text-xs text-[#6B7280]">
                    {project.status === "completed" ? "Completed" : `Day ${project.current_day} of ${project.total_days}`}
                  </p>
                  <div className="mt-2 h-2 bg-[#C4B5FD]/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" style={{ width: `${project.progress || 0}%` }} />
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">{project.progress || 0}%</p>
                  <button className="mt-3 w-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] py-2 text-xs font-semibold text-white flex items-center justify-center gap-1 hover:scale-105 transition">
                    {project.status === "completed" ? "Review" : "Continue"} <ArrowRight size={14} />
                  </button>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => document.querySelector("input")?.focus()}
                className="rounded-2xl border-2 border-dashed border-[#C4B5FD]/40 px-5 py-5 flex flex-col items-center justify-center text-center cursor-pointer transition"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(14px)" }}>
                <Plus size={36} className="text-[#8B5CF6]/60" />
                <p className="font-heading font-semibold text-[#8B5CF6] mt-3">Start New Project</p>
              </motion.div>
            </div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-white/40 p-5" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
            <p className="text-xs font-semibold text-[#6B7280] uppercase">Today's Goal</p>
            <p className="font-heading font-bold text-[#312E81] mt-1">
              {activeProjects.length > 0 ? `Work on ${activeProjects[0].title}` : "Start your first project"}
            </p>
            <p className="text-xs text-[#6B7280]">Every lesson brings you closer to your goal.</p>
            <div className="mt-3 h-2 bg-[#C4B5FD]/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" style={{ width: `${activeProjects[0]?.progress || 0}%` }} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/40 p-5 text-center flex flex-col items-center justify-center" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
            <span className="text-4xl">🔥</span>
            <p className="font-heading text-3xl font-bold text-[#312E81] mt-2">{stats.streak}</p>
            <p className="text-xs text-[#6B7280]">Day Streak</p>
          </div>

          <div className="rounded-2xl border border-white/40 p-5 text-center flex flex-col items-center justify-center" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
            <Image src="/flower.png" alt="Growth" width={80} height={90} className="object-contain" />
            <p className="text-sm font-semibold text-[#312E81] mt-2">Keep blooming!</p>
            <p className="text-xs text-[#6B7280]">Consistency grows your garden 🌸</p>
          </div>
        </div>
      </div>
    </div>
  );
}