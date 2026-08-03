"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Trash2, ExternalLink } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getArchiveData, deleteNote, deleteBookmark } from "@/lib/store";

type Tab = "lessons" | "projects" | "badges" | "certificates" | "notes" | "resources";

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState<Tab>("lessons");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) { setUserId(user.id); setData(await getArchiveData(user.id)); }
      setLoading(false);
    };
    getUser();
  }, []);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "lessons", label: "Lessons", icon: "📖" }, { key: "projects", label: "Projects", icon: "📁" }, { key: "badges", label: "Badges", icon: "🏆" },
    { key: "certificates", label: "Certificates", icon: "📜" }, { key: "notes", label: "Notes", icon: "📝" }, { key: "resources", label: "Resources", icon: "📚" },
  ];

  const handleDeleteNote = async (noteId: string) => { if (!userId) return; await deleteNote(noteId); setData(await getArchiveData(userId)); };
  const handleDeleteBookmark = async (bookmarkId: string) => { if (!userId) return; await deleteBookmark(bookmarkId); setData(await getArchiveData(userId)); };

  if (loading) {
    return (
      <div className="px-2 lg:px-8 py-4 lg:py-6 w-full overflow-x-hidden">
        <div className="h-7 bg-white/20 rounded w-40 mb-4 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 lg:gap-4 mb-4">{[...Array(4)].map((_,i)=><div key={i} className="h-16 lg:h-20 bg-white/15 rounded-2xl animate-pulse"/>)}</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 px-4">
        <img src="/assignments.png" alt="Archive" className="w-32 lg:w-44 h-auto object-contain" />
        <h2 className="font-heading text-lg lg:text-xl font-bold text-[#312E81] text-center">Please log in</h2>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-5 py-2 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="px-2 lg:px-8 py-4 lg:py-6 w-full overflow-x-hidden">
      <div className="mb-4 lg:mb-6">
        <h1 className="font-heading text-lg lg:text-2xl font-bold text-[#312E81]">Archive</h1>
        <p className="text-[11px] lg:text-xs text-[#6B7280]">Review everything you've completed.</p>
      </div>

      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 lg:gap-4 mb-4 lg:mb-6">
          {[
            { icon: "📖", value: data.stats.completedLessons, label: "Lessons" },
            { icon: "📁", value: data.stats.completedProjects, label: "Projects" },
            { icon: "📜", value: data.stats.certificates, label: "Certificates" },
            { icon: "⏱️", value: data.stats.hoursLearned, label: "Hours" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/40 p-2 lg:p-4 text-center"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
              <span className="text-lg lg:text-2xl">{stat.icon}</span>
              <p className="font-heading text-base lg:text-2xl font-bold text-[#312E81] mt-0.5">{stat.value}</p>
              <p className="text-[9px] lg:text-xs text-[#6B7280]">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4 lg:mb-6">
        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/30 backdrop-blur-md px-3 lg:px-4 py-2 lg:py-2.5">
          <Search size={16} className="text-[#6B7280] shrink-0" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 min-w-0 bg-transparent text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60" />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2 mb-4 lg:mb-6 -mx-2 px-2 lg:mx-0 lg:px-0">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1 rounded-full px-2.5 lg:px-4 py-1.5 lg:py-2 text-[10px] lg:text-sm font-medium whitespace-nowrap transition shrink-0 ${activeTab === tab.key ? "bg-[#8B5CF6] text-white shadow-md" : "bg-white/40 text-[#6B7280] hover:bg-white/60"}`}>
            <span className="text-xs lg:text-base">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-2 lg:space-y-4">
        {activeTab === "lessons" && (
          data?.lessons?.filter((l: any) => !search || l.title?.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
            <EmptyState icon="📖" message="No completed lessons yet." cta="Start Learning" href="/learn" img="/assignments.png" />
          ) : data?.lessons?.filter((l: any) => !search || l.title?.toLowerCase().includes(search.toLowerCase())).map((lesson: any) => (
            <motion.div key={lesson.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/40 p-2.5 lg:p-4 flex items-center gap-2 lg:gap-3"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
              <div className="w-8 h-8 lg:w-11 lg:h-11 rounded-xl bg-[#C4B5FD]/20 flex items-center justify-center text-base lg:text-xl shrink-0">📖</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-[#312E81] text-[11px] lg:text-sm truncate">{lesson.title || "Untitled"}</h3>
                <p className="text-[9px] lg:text-xs text-[#6B7280]">{lesson.completed_at ? new Date(lesson.completed_at).toLocaleDateString() : ""} — {lesson.score || 0}%</p>
              </div>
              <button className="rounded-full bg-[#8B5CF6]/10 px-2.5 py-1.5 text-[10px] lg:text-xs font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition shrink-0">Review</button>
            </motion.div>
          ))
        )}

        {activeTab === "projects" && (
          data?.projects?.filter((p: any) => !search || p.title?.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
            <EmptyState icon="📁" message="No completed projects yet." cta="Start a Project" href="/garden" img="/pose1.png" />
          ) : (
            <div className="grid grid-cols-1 gap-2.5 lg:gap-4">
              {data?.projects?.filter((p: any) => !search || p.title?.toLowerCase().includes(search.toLowerCase())).map((project: any) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/40 p-2.5 lg:p-4"
                  style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                  <div className="flex items-center gap-2 mb-2"><span className="text-lg">📁</span><div className="min-w-0"><h3 className="font-heading font-semibold text-[#312E81] text-[11px] lg:text-sm truncate">{project.title}</h3><p className="text-[9px] lg:text-xs text-[#6B7280]">{new Date(project.created_at).toLocaleDateString()}</p></div></div>
                  <p className="text-[10px] lg:text-xs text-[#6B7280] mb-2 line-clamp-2">{project.goal}</p>
                  <div className="flex items-center justify-between"><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] lg:text-xs font-semibold text-emerald-700">✅ Done</span><Link href={`/projects/${project.id}`} className="text-[10px] lg:text-xs font-semibold text-[#8B5CF6] hover:underline">Open →</Link></div>
                </motion.div>
              ))}
            </div>
          )
        )}

        {activeTab === "badges" && (
          data?.badges?.length === 0 ? <EmptyState icon="🏆" message="No badges earned yet." cta="Start Learning" href="/learn" img="/pose2.png" /> : (
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-1.5 lg:gap-3">
              {data?.badges?.map((badge: any) => (
                <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-white/40 p-1.5 lg:p-3 text-center hover:scale-105 transition"
                  style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                  <span className="text-xl lg:text-3xl">{badge.badge_icon}</span>
                  <h4 className="font-heading font-semibold text-[9px] lg:text-xs text-[#312E81] mt-0.5">{badge.badge_name}</h4>
                  <p className="text-[9px] text-[#6B7280]">+{badge.xp_reward} XP</p>
                </motion.div>
              ))}
            </div>
          )
        )}

        {activeTab === "certificates" && <EmptyState icon="📜" message="Certificates coming soon!" cta="Complete a Course" href="/learn" img="/mission_complete.png" />}

        {activeTab === "notes" && (
          data?.notes?.filter((n: any) => !search || n.title?.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
            <EmptyState icon="📝" message="No notes yet." cta="Create Note" href="/notes" img="/pose3.png" />
          ) : (
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-3">
              {data?.notes?.filter((n: any) => !search || n.title?.toLowerCase().includes(search.toLowerCase())).map((note: any) => (
                <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/40 p-2.5 lg:p-4"
                  style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                  <div className="flex items-start justify-between mb-1"><h3 className="font-heading font-semibold text-[#312E81] text-[11px] lg:text-sm truncate">{note.title}</h3><button onClick={() => handleDeleteNote(note.id)} className="text-[#6B7280] hover:text-red-500 shrink-0"><Trash2 size={14} /></button></div>
                  <p className="text-[10px] lg:text-xs text-[#6B7280] line-clamp-3">{note.content || "No content"}</p>
                  <p className="text-[9px] text-[#6B7280]/60 mt-1">{new Date(note.updated_at).toLocaleDateString()}</p>
                </motion.div>
              ))}
            </div>
          )
        )}

        {activeTab === "resources" && (
          data?.bookmarks?.filter((b: any) => !search || b.title?.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
            <EmptyState icon="📚" message="No saved resources yet." cta="Browse Resources" href="#" img="/pose3.png" />
          ) : (
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-3">
              {data?.bookmarks?.filter((b: any) => !search || b.title?.toLowerCase().includes(search.toLowerCase())).map((bookmark: any) => (
                <motion.div key={bookmark.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/40 p-2.5 lg:p-4"
                  style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                  <div className="flex items-start justify-between mb-1"><div className="flex items-center gap-1.5 min-w-0"><span className="text-xs">{bookmark.type==="video"?"🎬":bookmark.type==="article"?"📄":"🔗"}</span><h3 className="font-heading font-semibold text-[#312E81] text-[11px] lg:text-sm truncate">{bookmark.title}</h3></div><button onClick={() => handleDeleteBookmark(bookmark.id)} className="text-[#6B7280] hover:text-red-500 shrink-0"><Trash2 size={14} /></button></div>
                  <p className="text-[10px] lg:text-xs text-[#6B7280] line-clamp-2 mb-1.5">{bookmark.description}</p>
                  {bookmark.url && <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] lg:text-xs font-semibold text-[#8B5CF6] hover:underline"><ExternalLink size={12} /> Open</a>}
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, message, cta, href, img }: { icon: string; message: string; cta: string; href: string; img: string }) {
  return (
    <div className="text-center py-8 lg:py-14">
      <img src={img} alt="" className="object-contain w-16 lg:w-28 h-auto mx-auto mb-2" />
      <p className="font-heading font-semibold text-[#312E81] text-xs lg:text-base">{message}</p>
      <Link href={href} className="inline-block mt-2 lg:mt-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-3 py-1.5 text-[10px] lg:text-sm font-semibold text-white hover:scale-105 transition">{cta}</Link>
    </div>
  );
}