"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell, Search, Plus, MoreHorizontal } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getUserProjects, createProject } from "@/lib/store";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");

  const supabase = createClient();

  const loadProjects = async (uid: string) => {
    const data = await getUserProjects(uid);
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        loadProjects(user.id);
      } else {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleCreate = async () => {
    if (!newGoal.trim() || !userId) return;
    await createProject(userId, newGoal.trim());
    setNewGoal("");
    setShowCreate(false);
    loadProjects(userId);
  };

  const filtered = projects
    .filter((p) => filter === "all" || p.status === filter)
    .filter((p) => !search || p.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
        <div className="animate-pulse text-2xl text-[#8B5CF6]">Loading projects...</div>
      </div>
    );
  }

  if (!userId) {
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
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/garden" className="text-[#6B7280] hover:text-[#312E81] transition"><ArrowLeft size={22} /></Link>
            <div>
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#312E81]">My Projects</h1>
              <p className="text-xs lg:text-sm text-[#6B7280]">Build real-world applications.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreate(true)} className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 transition flex items-center gap-2">
              <Plus size={18} /> New Project
            </button>
            <Bell size={20} className="text-[#6B7280]" />
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/60">
              <Image src="/face.png" alt="Profile" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-white/40 p-6 w-full max-w-md"
              style={{ background: "rgba(255,255,255,0.80)", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(139,92,246,0.15)" }}>
              <h2 className="font-heading text-xl font-bold text-[#312E81] mb-1">Create New Project</h2>
              <p className="text-sm text-[#6B7280] mb-4">What do you want to build?</p>
              <input type="text" value={newGoal} onChange={(e) => setNewGoal(e.target.value)}
                placeholder="e.g., A weather app, a portfolio website..."
                className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-5 py-3 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 mb-4 focus:border-[#8B5CF6]" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCreate(false)} className="rounded-full border border-[#C4B5FD]/40 bg-white/50 px-5 py-2.5 text-sm text-[#6B7280] hover:bg-white transition">Cancel</button>
                <button onClick={handleCreate} disabled={!newGoal.trim()}
                  className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 transition disabled:opacity-50">
                  Create Project →
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Search + Filter */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 rounded-full border border-white/40 bg-white/30 backdrop-blur-md px-4 py-2.5">
            <Search size={18} className="text-[#6B7280]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="flex-1 bg-transparent text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60" />
          </div>
          <div className="flex gap-1 bg-white/20 backdrop-blur rounded-full p-1">
            {(["all", "active", "completed"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  filter === f ? "bg-white text-[#8B5CF6] shadow-sm" : "text-[#6B7280] hover:text-[#312E81]"}`}>
                {f === "all" ? "All" : f === "active" ? "In Progress" : "Completed"}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">📁</span>
            <p className="font-heading font-semibold text-[#312E81] mt-4">
              {search ? "No projects match your search." : "No projects yet."}
            </p>
            <p className="text-sm text-[#6B7280] mt-1">Create your first project and start building!</p>
            <button onClick={() => setShowCreate(true)} className="inline-block mt-4 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white hover:scale-105 transition">
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((project) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/40 p-5 hover:scale-[1.01] transition"
                style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#C4B5FD]/20 flex items-center justify-center text-2xl">
                      {project.status === "completed" ? "✅" : "🚀"}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-[#312E81]">{project.title}</h3>
                      <p className="text-xs text-[#6B7280]">Created {new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="text-[#6B7280] hover:text-[#312E81]"><MoreHorizontal size={18} /></button>
                </div>
                <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{project.goal}</p>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    project.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-[#C4B5FD]/20 text-[#8B5CF6]"}`}>
                    {project.status === "completed" ? "Completed" : "In Progress"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 bg-[#C4B5FD]/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" style={{ width: `${project.progress || 0}%` }} />
                  </div>
                  <span className="text-xs text-[#6B7280]">{project.progress || 0}%</span>
                </div>
                <Link href={`/projects/${project.id}`}
                  className="inline-flex items-center gap-1 rounded-full bg-[#8B5CF6]/10 px-4 py-2 text-xs font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition">
                  Open Project →
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}