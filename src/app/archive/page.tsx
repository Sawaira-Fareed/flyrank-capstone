"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell, Search, Download, Share2, Bookmark, FileText, Star, Trash2, ExternalLink } from "lucide-react";
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
      if (user) {
        setUserId(user.id);
        const archiveData = await getArchiveData(user.id);
        setData(archiveData);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "lessons", label: "Lessons", icon: "📖" },
    { key: "projects", label: "Projects", icon: "📁" },
    { key: "badges", label: "Badges", icon: "🏆" },
    { key: "certificates", label: "Certificates", icon: "📜" },
    { key: "notes", label: "Notes", icon: "📝" },
    { key: "resources", label: "Resources", icon: "📚" },
  ];

  const handleDeleteNote = async (noteId: string) => {
    if (!userId) return;
    await deleteNote(noteId);
    const updated = await getArchiveData(userId);
    setData(updated);
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    if (!userId) return;
    await deleteBookmark(bookmarkId);
    const updated = await getArchiveData(userId);
    setData(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
        <div className="animate-pulse text-2xl text-[#8B5CF6]">Loading your archive...</div>
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
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#312E81]">Archive</h1>
              <p className="text-xs lg:text-sm text-[#6B7280]">Review everything you've completed.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-[#6B7280]" />
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/60">
              <Image src="/face.png" alt="Profile" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        {data && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: "📖", value: data.stats.completedLessons, label: "Lessons" },
              { icon: "📁", value: data.stats.completedProjects, label: "Projects" },
              { icon: "📜", value: data.stats.certificates, label: "Certificates" },
              { icon: "⏱️", value: data.stats.hoursLearned, label: "Hours Learned" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/40 p-4 text-center"
                style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                <span className="text-2xl">{stat.icon}</span>
                <p className="font-heading text-2xl font-bold text-[#312E81] mt-1">{stat.value}</p>
                <p className="text-xs text-[#6B7280]">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search + Filter */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 rounded-full border border-white/40 bg-white/30 backdrop-blur-md px-4 py-2.5">
            <Search size={18} className="text-[#6B7280]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search archive..." className="flex-1 bg-transparent text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.key ? "bg-[#8B5CF6] text-white shadow-md" : "bg-white/40 text-[#6B7280] hover:bg-white/60"}`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "lessons" && (
            <>
              {data?.lessons?.filter((l: any) => !search || l.title?.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                <EmptyState icon="📖" message="No completed lessons yet." cta="Start Learning" href="/learn" />
              ) : (
                data?.lessons?.filter((l: any) => !search || l.title?.toLowerCase().includes(search.toLowerCase())).map((lesson: any) => (
                  <motion.div key={lesson.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-white/40 p-5 flex items-center gap-4 flex-wrap"
                    style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                    <div className="w-12 h-12 rounded-xl bg-[#C4B5FD]/20 flex items-center justify-center text-2xl">📖</div>
                    <div className="flex-1 min-w-[150px]">
                      <h3 className="font-heading font-semibold text-[#312E81]">{lesson.title || "Untitled Lesson"}</h3>
                      <p className="text-xs text-[#6B7280]">{lesson.completed_at ? new Date(lesson.completed_at).toLocaleDateString() : ""} — Score: {lesson.score || 0}%</p>
                    </div>
                    <button className="rounded-full bg-[#8B5CF6]/10 px-4 py-2 text-xs font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition">Review</button>
                  </motion.div>
                ))
              )}
            </>
          )}

          {activeTab === "projects" && (
            <>
              {data?.projects?.filter((p: any) => !search || p.title?.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                <EmptyState icon="📁" message="No completed projects yet." cta="Start a Project" href="/garden" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data?.projects?.filter((p: any) => !search || p.title?.toLowerCase().includes(search.toLowerCase())).map((project: any) => (
                    <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-white/40 p-5"
                      style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">📁</span>
                        <div>
                          <h3 className="font-heading font-semibold text-[#312E81]">{project.title}</h3>
                          <p className="text-xs text-[#6B7280]">Completed {new Date(project.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-sm text-[#6B7280] mb-3">{project.goal}</p>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">✅ Completed</span>
                        <Link href={`/projects/${project.id}`} className="text-xs font-semibold text-[#8B5CF6] hover:underline">Open Project →</Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "badges" && (
            <>
              {data?.badges?.length === 0 ? (
                <EmptyState icon="🏆" message="No badges earned yet." cta="Start Learning" href="/learn" />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {data?.badges?.map((badge: any) => (
                    <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border border-white/40 p-4 text-center hover:scale-105 transition"
                      style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                      <span className="text-4xl">{badge.badge_icon}</span>
                      <h4 className="font-heading font-semibold text-sm text-[#312E81] mt-2">{badge.badge_name}</h4>
                      <p className="text-xs text-[#6B7280] mt-1">+{badge.xp_reward} XP</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "certificates" && (
            <EmptyState icon="📜" message="Certificates coming soon!" cta="Complete a Course" href="/learn" />
          )}

          {activeTab === "notes" && (
            <>
              {data?.notes?.filter((n: any) => !search || n.title?.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                <EmptyState icon="📝" message="No notes yet." cta="Create Note" href="#" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data?.notes?.filter((n: any) => !search || n.title?.toLowerCase().includes(search.toLowerCase())).map((note: any) => (
                    <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-white/40 p-5 relative"
                      style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-heading font-semibold text-[#312E81]">{note.title}</h3>
                        <button onClick={() => handleDeleteNote(note.id)} className="text-[#6B7280] hover:text-red-500 transition"><Trash2 size={16} /></button>
                      </div>
                      <p className="text-xs text-[#6B7280] line-clamp-3">{note.content || "No content"}</p>
                      <p className="text-xs text-[#6B7280]/60 mt-2">Updated {new Date(note.updated_at).toLocaleDateString()}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "resources" && (
            <>
              {data?.bookmarks?.filter((b: any) => !search || b.title?.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                <EmptyState icon="📚" message="No saved resources yet." cta="Browse Resources" href="#" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data?.bookmarks?.filter((b: any) => !search || b.title?.toLowerCase().includes(search.toLowerCase())).map((bookmark: any) => (
                    <motion.div key={bookmark.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-white/40 p-5"
                      style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{bookmark.type === "video" ? "🎬" : bookmark.type === "article" ? "📄" : "🔗"}</span>
                          <h3 className="font-heading font-semibold text-[#312E81] text-sm">{bookmark.title}</h3>
                        </div>
                        <button onClick={() => handleDeleteBookmark(bookmark.id)} className="text-[#6B7280] hover:text-red-500 transition"><Trash2 size={16} /></button>
                      </div>
                      <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">{bookmark.description}</p>
                      {bookmark.url && (
                        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B5CF6] hover:underline">
                          <ExternalLink size={14} /> Open
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, message, cta, href }: { icon: string; message: string; cta: string; href: string }) {
  return (
    <div className="text-center py-16">
      <span className="text-5xl">{icon}</span>
      <p className="font-heading font-semibold text-[#312E81] mt-4">{message}</p>
      <Link href={href} className="inline-block mt-4 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white hover:scale-105 transition">
        {cta}
      </Link>
    </div>
  );
}