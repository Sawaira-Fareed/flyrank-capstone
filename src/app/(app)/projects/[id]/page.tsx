"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Play, Bookmark, ExternalLink } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getProjectSkills, getUserBookmarks } from "@/lib/store";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const supabase = createClient();

  const [project, setProject] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: proj } = await supabase.from("projects").select("*").eq("id", projectId).single();
      setProject(proj);
      const skillsData = await getProjectSkills(projectId);
      setSkills(skillsData);
      // Load bookmarks filtered by project_id
      const allBookmarks = await getUserBookmarks(user.id);
setBookmarks(allBookmarks.filter((b: any) => b.project_id === projectId));
      setLoading(false);
    };
    load();
  }, [projectId]);

  const handleDelete = async () => { 
    await supabase.from("projects").delete().eq("id", projectId); 
    router.push("/projects"); 
  };

  const handleArchive = async () => {
    setArchiving(true);
    const isComplete = (project.progress || 0) >= 100;
    await supabase.from("projects").update({ 
      status: isComplete ? "completed" : "saved_for_later" 
    }).eq("id", projectId);
    setProject({ ...project, status: isComplete ? "completed" : "saved_for_later" });
    setArchiving(false);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
        <div className="h-8 bg-white/20 rounded w-48 mb-2 animate-pulse" />
        <div className="h-4 bg-white/20 rounded w-96 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-white/20 rounded-2xl animate-pulse" />
          <div className="h-40 bg-white/20 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
        <Image src="/pose4.png" alt="Not found" width={140} height={170} className="object-contain w-32 h-auto" />
        <h2 className="font-heading text-xl font-bold text-[#312E81]">Project not found</h2>
        <Link href="/projects" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Back to Projects</Link>
      </div>
    );
  }

  const isComplete = (project.progress || 0) >= 100;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="text-[#6B7280] hover:text-[#312E81]"><ArrowLeft size={22} /></Link>
          <div>
            <h1 className="font-heading text-xl lg:text-3xl font-bold text-[#312E81]">{project.title}</h1>
            <p className="text-xs lg:text-sm text-[#6B7280]">{project.goal}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleArchive} disabled={archiving || project.status === "completed" || project.status === "saved_for_later"}
            className="rounded-full border border-[#C4B5FD]/40 bg-white/40 px-4 py-2 text-xs font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition disabled:opacity-50">
            {project.status === "completed" ? "✅ Completed" : project.status === "saved_for_later" ? "📌 Saved for Later" : archiving ? "Archiving..." : "📦 Archive"}
          </button>
          <button onClick={() => setShowDelete(true)} className="rounded-full border border-red-200 bg-white/40 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition"><Trash2 size={16} /></button>
        </div>
      </div>

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/40 p-6 w-full max-w-sm text-center"
            style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(139,92,246,0.15)" }}>
            <span className="text-4xl">🗑️</span>
            <h3 className="font-heading font-bold text-[#312E81] mt-3">Delete Project?</h3>
            <p className="text-sm text-[#6B7280] mt-1">This cannot be undone.</p>
            <div className="flex gap-3 justify-center mt-5">
              <button onClick={() => setShowDelete(false)} className="rounded-full border border-[#C4B5FD]/40 bg-white/50 px-5 py-2.5 text-sm text-[#6B7280]">Cancel</button>
              <button onClick={handleDelete} className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition">Delete</button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <div className="rounded-2xl border border-white/40 p-5 lg:p-6"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
            <h2 className="font-heading font-semibold text-[#312E81] mb-4">Progress</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 lg:w-24 lg:h-24">
                <svg viewBox="0 0 120 120" className="transform -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#E8E0F0" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="url(#projGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(project.progress / 100) * 327} 327`} />
                  <defs><linearGradient id="projGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#EC4899" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><span className="font-heading text-lg lg:text-xl font-bold text-[#312E81]">{project.progress}%</span></div>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Day {project.current_day} of {project.total_days}</p>
                <p className="text-xs text-[#6B7280] mt-1">Created {new Date(project.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <Link href="/learn" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#87CEEB] via-[#C4B5FD] to-[#F472B6] px-5 lg:px-6 py-2.5 lg:py-3 text-sm font-semibold text-white hover:scale-105 transition shadow-md"
              style={{ boxShadow: "0 4px 16px rgba(139,92,246,0.25)" }}><Play size={16} /> Continue Learning</Link>
          </div>

          {/* Skills Card */}
          <div className="rounded-2xl border border-white/40 p-5 lg:p-6"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
            <h2 className="font-heading font-semibold text-[#312E81] mb-4">Skills to Learn</h2>
            {skills.length === 0 ? (
              <div className="text-center py-6">
                <Image src="/pose4.png" alt="Skills coming" width={80} height={100} className="object-contain w-20 h-auto mx-auto mb-2" />
                <p className="text-sm text-[#6B7280]">Skills appear once AI generates them. Start your first lesson!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {skills.map((skill) => (
                  <Link 
                    key={skill.id} 
                    href={`/learn?skill_id=${skill.id}&project_id=${projectId}`}
                    className={`flex items-center gap-3 hover:bg-white/20 rounded-xl p-2 transition cursor-pointer ${skill.status === "locked" ? "opacity-50 pointer-events-none" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${skill.status === "completed" ? "bg-emerald-400 text-white" : skill.status === "active" ? "bg-[#8B5CF6] text-white ring-2 ring-[#C4B5FD]/40" : "bg-gray-200 text-gray-400"}`}>
                      {skill.status === "completed" ? "✓" : skill.status === "active" ? "●" : "🔒"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${skill.status === "locked" ? "text-[#6B7280]/50" : "text-[#312E81]"}`}>{skill.name}</p>
                      <p className="text-xs text-[#6B7280] truncate">{skill.description}</p>
                    </div>
                    {skill.status === "active" && <span className="text-xs bg-[#8B5CF6]/10 text-[#8B5CF6] px-2 py-0.5 rounded-full shrink-0">Today</span>}
                    {skill.status === "completed" && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full shrink-0">Done</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* About Card */}
          <div className="rounded-2xl border border-white/40 p-5" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
            <h3 className="font-heading font-semibold text-[#312E81] mb-3 text-sm">About</h3>
            <p className="text-sm text-[#6B7280]">{project.goal}</p>
          </div>
          
          {/* Status Card */}
          <div className="rounded-2xl border border-white/40 p-5" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
            <h3 className="font-heading font-semibold text-[#312E81] mb-3 text-sm">Status</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              project.status === "completed" ? "bg-emerald-100 text-emerald-700" : 
              project.status === "saved_for_later" ? "bg-amber-100 text-amber-700" : 
              "bg-[#C4B5FD]/20 text-[#8B5CF6]"
            }`}>
              {project.status === "completed" ? "✅ Completed" : project.status === "saved_for_later" ? "📌 Saved for Later" : "🚀 In Progress"}
            </span>
          </div>

          {/* Resources Card */}
          <div className="rounded-2xl border border-white/40 p-5" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
            <h3 className="font-heading font-semibold text-[#312E81] mb-3 text-sm flex items-center gap-2">
              <Bookmark size={16} className="text-[#8B5CF6]" /> Resources
            </h3>
            {bookmarks.length === 0 ? (
              <p className="text-xs text-[#6B7280]">No resources saved for this project yet. Save them while learning!</p>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((bookmark: any) => (
                  <a 
                    key={bookmark.id}
                    href={bookmark.url || "#"} 
                    target={bookmark.url ? "_blank" : undefined} 
                    rel="noopener noreferrer"
                    className="block rounded-xl bg-white/40 border border-white/40 p-2.5 hover:bg-white/60 transition">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{bookmark.type === "video" ? "🎬" : bookmark.type === "article" ? "📄" : bookmark.type === "tool" ? "🔧" : "🔗"}</span>
                      <p className="text-xs font-semibold text-[#312E81] truncate">{bookmark.title}</p>
                    </div>
                    <p className="text-[10px] text-[#6B7280] truncate mt-0.5">{bookmark.description || bookmark.url || "No description"}</p>
                    {bookmark.url && (
                      <span className="text-[10px] text-[#8B5CF6] flex items-center gap-0.5 mt-1"><ExternalLink size={10} /> Open</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}