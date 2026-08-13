"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, MoreHorizontal, Edit3, Trash2, Archive, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getUserProjects, createProject, getUserBadges, getNewBadgeEarned } from "@/lib/store";
import BadgePopup from "@/components/badges/BadgePopup";

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/40 p-5 animate-pulse" style={{ background: "rgba(255,255,255,0.20)" }}>
      <div className="flex gap-3 mb-3">
        <div className="w-12 h-12 bg-white/40 rounded-xl" />
        <div className="flex-1"><div className="h-4 bg-white/40 rounded w-3/4" /><div className="h-3 bg-white/30 rounded w-1/2 mt-1" /></div>
      </div>
      <div className="h-3 bg-white/30 rounded w-full mb-2" />
      <div className="h-3 bg-white/30 rounded w-2/3 mb-3" />
      <div className="h-2 bg-white/30 rounded-full mb-3" />
      <div className="h-8 bg-white/40 rounded-xl w-32" />
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "saved">("all");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [showBadgePopup, setShowBadgePopup] = useState<any>(null);

  const supabase = createClient();

  const loadProjects = async (uid: string) => {
    const data = await getUserProjects(uid);
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) { setUserId(user.id); loadProjects(user.id); }
      else { setLoading(false); }
    };
    getUser();
  }, []);

  const handleCreate = async () => {
    if (!newGoal.trim() || !userId) return;
    setCreating(true);
    try {
      // Get badges BEFORE creating project
      const badgesBefore = await getUserBadges(userId);
      
      const project = await createProject(userId, newGoal.trim());
      if (project) {
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                {
                  role: "user",
                  content: `[SKILL_MAP_REQUEST] Generate a skill map for a project called "${newGoal.trim()}". The project goal is: "${newGoal.trim()}". Return ONLY a JSON array of skills.`,
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
        setNewGoal(""); setShowCreate(false);
        loadProjects(userId);
        
        // Check for new badge
        const newBadge = await getNewBadgeEarned(userId, badgesBefore);
        if (newBadge) setShowBadgePopup(newBadge);
      }
    } finally { setCreating(false); }
  };

  const handleDelete = async (projectId: string) => {
    await supabase.from("projects").delete().eq("id", projectId);
    setShowDelete(null);
    setOpenMenuId(null);
    if (userId) loadProjects(userId);
  };

  const handleArchive = async (projectId: string) => {
    await supabase.from("projects").update({ status: "saved_for_later" }).eq("id", projectId);
    setOpenMenuId(null);
    if (userId) loadProjects(userId);
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenuId]);

  const filterMap: Record<string, (p: any) => boolean> = {
    all: () => true,
    active: (p) => p.status === "active",
    completed: (p) => p.status === "completed",
    saved: (p) => p.status === "saved_for_later",
  };

  const filtered = projects
    .filter(filterMap[filter])
    .filter((p) => !search || p.title?.toLowerCase().includes(search.toLowerCase()));

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "saved", label: "Saved" },
    { key: "completed", label: "Done" },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="h-8 bg-white/20 rounded w-48 mb-2 animate-pulse" />
        <div className="flex gap-3 mb-6 mt-4">
          <div className="flex-1 h-10 bg-white/20 rounded-full animate-pulse" />
          <div className="w-32 h-10 bg-white/20 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><CardSkeleton /><CardSkeleton /></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
        <Image src="/pose1.png" alt="Elsa" width={160} height={200} className="object-contain w-36 lg:w-44 h-auto" />
        <h2 className="font-heading text-xl lg:text-2xl font-bold text-[#312E81] text-center">Please log in</h2>
        <p className="text-sm text-[#6B7280] text-center">Log in to view your projects.</p>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#312E81]">My Projects</h1>
          <p className="text-xs lg:text-sm text-[#6B7280]">Build real-world applications.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 transition flex items-center gap-2">
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/40 p-6 w-full max-w-md"
            style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(139,92,246,0.15)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-bold text-[#312E81]">Create New Project</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-full hover:bg-white/40"><X size={20} className="text-[#6B7280]" /></button>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">What do you want to build?</p>
            <input type="text" value={newGoal} onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g., A weather app..."
              className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-5 py-3 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 mb-4 focus:border-[#8B5CF6]" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowCreate(false)} className="rounded-full border border-[#C4B5FD]/40 bg-white/50 px-5 py-2.5 text-sm text-[#6B7280]">Cancel</button>
              <button onClick={handleCreate} disabled={!newGoal.trim() || creating}
                className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 transition disabled:opacity-50 flex items-center gap-2">
                {creating ? "Creating..." : "Create →"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/40 p-6 w-full max-w-sm text-center"
            style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(139,92,246,0.15)" }}>
            <span className="text-4xl">🗑️</span>
            <h3 className="font-heading font-bold text-[#312E81] mt-3">Delete Project?</h3>
            <p className="text-sm text-[#6B7280] mt-1">This cannot be undone.</p>
            <div className="flex gap-3 justify-center mt-5">
              <button onClick={() => setShowDelete(null)} className="rounded-full border border-[#C4B5FD]/40 bg-white/50 px-5 py-2.5 text-sm text-[#6B7280]">Cancel</button>
              <button onClick={() => handleDelete(showDelete)} className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition">Delete</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search + Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 rounded-full border border-white/40 bg-white/30 backdrop-blur-md px-4 py-2.5">
          <Search size={18} className="text-[#6B7280] shrink-0" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="flex-1 min-w-0 bg-transparent text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60" />
        </div>
        <div className="flex gap-1 bg-white/20 backdrop-blur rounded-full p-1 shrink-0">
          {filterTabs.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key as any)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${filter === f.key ? "bg-white text-[#8B5CF6] shadow-sm" : "text-[#6B7280] hover:text-[#312E81]"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Image src="/pose1.png" alt="No projects" width={120} height={150} className="object-contain w-28 h-auto mx-auto mb-4" />
          <p className="font-heading font-semibold text-[#312E81]">{search ? "No projects match." : "No projects yet."}</p>
          <p className="text-sm text-[#6B7280] mt-1">Create your first project!</p>
          <button onClick={() => setShowCreate(true)} className="mt-4 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white hover:scale-105 transition">Create Project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {filtered.map((project) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/40 p-4 lg:p-5 relative"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-[#C4B5FD]/20 flex items-center justify-center text-xl lg:text-2xl">
                    {project.status === "completed" ? "✅" : project.status === "saved_for_later" ? "📌" : "🚀"}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-[#312E81] text-sm lg:text-base">{project.title}</h3>
                    <p className="text-xs text-[#6B7280]">{new Date(project.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === project.id ? null : project.id); }}
                    className="p-1.5 rounded-full hover:bg-white/40 transition text-[#6B7280] hover:text-[#312E81]">
                    <MoreHorizontal size={18} />
                  </button>
                  
                  {openMenuId === project.id && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-8 w-40 rounded-xl border border-white/40 bg-white/90 backdrop-blur-xl shadow-lg z-20 overflow-hidden">
                      <button 
                        onClick={() => { setShowCreate(true); setNewGoal(project.title); setOpenMenuId(null); }}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#312E81] hover:bg-[#8B5CF6]/10 flex items-center gap-2 transition">
                        <Edit3 size={13} /> Edit
                      </button>
                      <button 
                        onClick={() => handleArchive(project.id)}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#312E81] hover:bg-[#8B5CF6]/10 flex items-center gap-2 transition">
                        <Archive size={13} /> Archive
                      </button>
                      <button 
                        onClick={() => { setShowDelete(project.id); setOpenMenuId(null); }}
                        className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 transition">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{project.goal}</p>
              
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-2 ${
                project.status === "completed" ? "bg-emerald-100 text-emerald-700" : 
                project.status === "saved_for_later" ? "bg-amber-100 text-amber-700" : 
                "bg-[#C4B5FD]/20 text-[#8B5CF6]"
              }`}>
                {project.status === "completed" ? "Completed" : project.status === "saved_for_later" ? "Saved" : "In Progress"}
              </span>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-2 bg-[#C4B5FD]/20 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full" style={{ width: `${project.progress || 0}%` }} /></div>
                <span className="text-xs text-[#6B7280]">{project.progress || 0}%</span>
              </div>
              
             <Link
  href={`/projects/${project.id}`}
  className="flex w-fit mx-auto items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#87CEEB] via-[#C4B5FD] to-[#F472B6] px-4 py-2 text-xs font-semibold text-white hover:scale-105 transition shadow-md"
>
  Open
  <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
</Link>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Badge Popup */}
      <BadgePopup badge={showBadgePopup} onClose={() => setShowBadgePopup(null)} />
    </div>
  );
}