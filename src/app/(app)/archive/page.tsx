"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Trash2, ExternalLink, Edit3, Download } from "lucide-react";
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

  const [projectFilter, setProjectFilter] = useState<"completed" | "saved">("completed");
  const [savedCertificates, setSavedCertificates] = useState<any[]>([]);
  const [deleteCertConfirm, setDeleteCertConfirm] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) { 
        setUserId(user.id); 
        setData(await getArchiveData(user.id));
        const { data: certs } = await supabase.from("certificates").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        setSavedCertificates(certs || []);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const refreshData = async () => {
    if (!userId) return;
    setData(await getArchiveData(userId));
  };

  const refreshCertificates = async () => {
    if (!userId) return;
    const { data: certs } = await supabase.from("certificates").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setSavedCertificates(certs || []);
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "lessons", label: "Lessons", icon: "📖" }, { key: "projects", label: "Projects", icon: "📁" }, { key: "badges", label: "Badges", icon: "🏆" },
    { key: "certificates", label: "Certificates", icon: "📜" }, { key: "notes", label: "Notes", icon: "📝" }, { key: "resources", label: "Resources", icon: "📚" },
  ];

  const handleDeleteNote = async (noteId: string) => { if (!userId) return; await deleteNote(noteId); refreshData(); };
  const handleDeleteBookmark = async (bookmarkId: string) => { if (!userId) return; await deleteBookmark(bookmarkId); refreshData(); };

  const handleCertificateDownload = (certData: any) => {
    if (!certData) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = 2, W = 900, H = 580;
    canvas.width = W * scale; canvas.height = H * scale;
    ctx.scale(scale, scale);
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, "#87CEEB"); bgGrad.addColorStop(0.3, "#C4B5FD"); bgGrad.addColorStop(0.6, "#F472B6"); bgGrad.addColorStop(1, "#8B5CF6");
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
    const cardX = 40, cardY = 30, cardW = W - 80, cardH = H - 60, cardR = 28;
    ctx.beginPath();
    ctx.moveTo(cardX + cardR, cardY); ctx.lineTo(cardX + cardW - cardR, cardY);
    ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + cardR);
    ctx.lineTo(cardX + cardW, cardY + cardH - cardR);
    ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - cardR, cardY + cardH);
    ctx.lineTo(cardX + cardR, cardY + cardH);
    ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - cardR);
    ctx.lineTo(cardX, cardY + cardR);
    ctx.quadraticCurveTo(cardX, cardY, cardX + cardR, cardY);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "#1E1B4B"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "right";
    ctx.fillText("🌸 BloomLab", cardX + cardW - 30, cardY + 40);
    const contentX = cardX + 60;
    ctx.fillStyle = "#1E1B4B"; ctx.font = "bold 32px sans-serif"; ctx.textAlign = "left";
    ctx.fillText(certData.projectName || "Project", contentX, cardY + 100);
    const badgeX = contentX, badgeY = cardY + 125, badgeW = 200, badgeH = 32;
    ctx.beginPath();
    ctx.moveTo(badgeX + 16, badgeY); ctx.lineTo(badgeX + badgeW - 16, badgeY);
    ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + 16);
    ctx.lineTo(badgeX + badgeW, badgeY + badgeH - 16);
    ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - 16, badgeY + badgeH);
    ctx.lineTo(badgeX + 16, badgeY + badgeH);
    ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - 16);
    ctx.lineTo(badgeX, badgeY + 16);
    ctx.quadraticCurveTo(badgeX, badgeY, badgeX + 16, badgeY);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = "#22C55E"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("✓ Project Completed", badgeX + badgeW / 2, badgeY + 22);
    if (certData.description) {
      ctx.fillStyle = "#6B7280"; ctx.font = "13px sans-serif"; ctx.textAlign = "left";
      ctx.fillText(certData.description.substring(0, 100), contentX, badgeY + badgeH + 35);
    }
    const featStartY = certData.description ? badgeY + badgeH + 65 : badgeY + badgeH + 40;
    (certData.features || []).forEach((f: string, i: number) => {
      ctx.fillStyle = "#312E81"; ctx.font = "14px sans-serif";
      ctx.fillText("🌸 " + f, contentX, featStartY + i * 28);
    });
    const linksY = featStartY + (certData.features || []).length * 28 + 20;
    if (certData.githubUrl) { ctx.fillStyle = "#6B21A8"; ctx.font = "12px sans-serif"; ctx.fillText("🔗 " + certData.githubUrl, contentX, linksY); }
    if (certData.liveUrl) { ctx.fillText("🌐 " + certData.liveUrl, contentX, linksY + (certData.githubUrl ? 22 : 0)); }
    const footerY = cardY + cardH - 45;
    ctx.fillStyle = "#6B7280"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`Awarded to ${certData.userName} on ${certData.date}`, W / 2, footerY);
    ctx.fillStyle = "#9CA3AF"; ctx.font = "11px sans-serif";
    ctx.fillText("🌸 BloomLab — Learning grows naturally.", W / 2, footerY + 20);
    const link = document.createElement("a");
    link.download = `${(certData.projectName || "certificate").replace(/\s+/g, "-")}-certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleDeleteCertificate = async (certId: string) => {
    await supabase.from("certificates").delete().eq("id", certId);
    setDeleteCertConfirm(null);
    refreshCertificates();
  };

  const completedProjects = data?.projects?.filter((p: any) => p.progress >= 100) || [];
  const savedProjects = data?.projects?.filter((p: any) => (p.progress || 0) < 100) || [];

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
            { icon: "📜", value: savedCertificates.length, label: "Certificates" },
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

      {/* Main Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4 lg:mb-6 -mx-2 px-2 lg:mx-0 lg:px-0">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1 rounded-full px-2.5 lg:px-4 py-1.5 lg:py-2 text-[10px] lg:text-sm font-medium whitespace-nowrap transition shrink-0 ${activeTab === tab.key ? "bg-[#8B5CF6] text-white shadow-md" : "bg-white/40 text-[#6B7280] hover:bg-white/60"}`}>
            <span className="text-xs lg:text-base">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tabs for Projects */}
      {activeTab === "projects" && (
        <div className="flex gap-1 mb-4">
          <button onClick={() => setProjectFilter("completed")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${projectFilter === "completed" ? "bg-[#8B5CF6] text-white" : "bg-white/40 text-[#6B7280]"}`}>
            ✅ Completed
          </button>
          <button onClick={() => setProjectFilter("saved")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${projectFilter === "saved" ? "bg-[#8B5CF6] text-white" : "bg-white/40 text-[#6B7280]"}`}>
            📌 Saved for Later
          </button>
        </div>
      )}

      <div className="space-y-2 lg:space-y-4">
        {/* LESSONS TAB */}
        {activeTab === "lessons" && (
          data?.lessons?.filter((l: any) => !search || (l.title || "").toLowerCase().includes(search.toLowerCase())).length === 0 ? (
            <EmptyState icon="📖" message="No completed lessons yet." cta="Start Learning" href="/learn" img="/assignments.png" />
          ) : data?.lessons?.filter((l: any) => !search || (l.title || "").toLowerCase().includes(search.toLowerCase())).map((lesson: any) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <>
            {projectFilter === "completed" && (
              completedProjects.length === 0 ? (
                <EmptyState icon="📁" message="No fully completed projects yet." cta="Start a Project" href="/garden" img="/pose1.png" />
              ) : (
                <div className="grid grid-cols-1 gap-2.5 lg:gap-4">
                  {completedProjects.filter((p: any) => !search || p.title?.toLowerCase().includes(search.toLowerCase())).map((project: any) => (
                    <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-white/40 p-2.5 lg:p-4"
                      style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                      <div className="flex items-center gap-2 mb-2"><span className="text-lg">📁</span><div className="min-w-0"><h3 className="font-heading font-semibold text-[#312E81] text-[11px] lg:text-sm truncate">{project.title}</h3><p className="text-[9px] lg:text-xs text-[#6B7280]">{new Date(project.created_at).toLocaleDateString()}</p></div></div>
                      <p className="text-[10px] lg:text-xs text-[#6B7280] mb-2 line-clamp-2">{project.goal}</p>
                      <div className="flex items-center justify-between"><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] lg:text-xs font-semibold text-emerald-700">✅ 100% Done</span><Link href={`/projects/${project.id}`} className="text-[10px] lg:text-xs font-semibold text-[#8B5CF6] hover:underline">Open →</Link></div>
                    </motion.div>
                  ))}
                </div>
              )
            )}
            {projectFilter === "saved" && (
              savedProjects.length === 0 ? (
                <EmptyState icon="📌" message="No saved projects." cta="Start a Project" href="/garden" img="/pose1.png" />
              ) : (
                <div className="grid grid-cols-1 gap-2.5 lg:gap-4">
                  {savedProjects.filter((p: any) => !search || p.title?.toLowerCase().includes(search.toLowerCase())).map((project: any) => (
                    <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-white/40 p-2.5 lg:p-4"
                      style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
                      <div className="flex items-center gap-2 mb-2"><span className="text-lg">📁</span><div className="min-w-0"><h3 className="font-heading font-semibold text-[#312E81] text-[11px] lg:text-sm truncate">{project.title}</h3><p className="text-[9px] lg:text-xs text-[#6B7280]">{new Date(project.created_at).toLocaleDateString()}</p></div></div>
                      <p className="text-[10px] lg:text-xs text-[#6B7280] mb-2 line-clamp-2">{project.goal}</p>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] lg:text-xs font-semibold text-amber-700">📌 {project.progress || 0}% done</span>
                        <Link href={`/projects/${project.id}`} className="text-[10px] lg:text-xs font-semibold text-[#8B5CF6] hover:underline">Open →</Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </>
        )}

   {/* BADGES TAB */}
{activeTab === "badges" && (
  data?.badges?.length === 0 ? (
    <EmptyState icon="🏆" message="No badges earned yet." cta="Start Learning" href="/learn" img="/pose2.png" />
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 justify-items-center py-4">
      {data?.badges?.map((badge: any) => (
        <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center hover:scale-110 transition">
          <img 
            src={getBadgeImage(badge.badge_name)} 
            alt={badge.badge_name} 
            className="w-28 h-28 lg:w-28 lg:h-28 object-contain"
            onError={(e) => { 
              (e.target as HTMLImageElement).style.display = "none"; 
            }}
          />
        </motion.div>
      ))}
    </div>
  )
)}

 {/* CERTIFICATES TAB */}
{activeTab === "certificates" && (
  <div>
    {savedCertificates.length === 0 ? (
      <div>
        <div className="text-center py-8">
          <img src="/pose2.png" alt="No certificates" className="object-contain w-24 lg:w-32 h-auto mx-auto mb-3" />
          <p className="font-heading font-semibold text-[#312E81] text-sm lg:text-base">No certificates yet</p>
          <p className="text-xs text-[#6B7280] mt-1">Complete a project and generate your first certificate!</p>
        </div>
        <Link href="/certificates" 
          className="block rounded-2xl border-2 border-dashed border-[#C4B5FD]/40 p-8 text-center hover:bg-white/20 transition cursor-pointer mx-auto max-w-xs"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(22px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
          <div className="w-14 h-14 rounded-full bg-[#C4B5FD]/20 flex items-center justify-center mx-auto mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <h3 className="font-heading font-semibold text-[#8B5CF6] text-sm">Generate Certificate</h3>
          <p className="text-xs text-[#6B7280] mt-1">Showcase your completed project with a beautiful certificate</p>
        </Link>
      </div>
    ) : (
      <div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Saved Certificates */}
{savedCertificates.map((cert: any) => (
  <motion.div key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    className="aspect-square rounded-2xl border border-white/40 overflow-hidden flex flex-col"
    style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(22px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
    
    {/* Thumbnail Area */}
    <div className="flex-1 flex items-center justify-center p-3 bg-[#F8F7FF]">
      {cert.data?.screenshot ? (
        <img 
          src={cert.data.screenshot} 
          alt={cert.data?.projectName} 
          className="w-full h-full object-cover rounded-lg border border-white/40"
        />
      ) : (
        <div className="w-full h-full rounded-lg border-2 border-dashed border-[#C4B5FD]/30 flex flex-col items-center justify-center text-center p-2"
          style={{ background: "rgba(139,92,246,0.04)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p className="text-[9px] text-[#C4B5FD] mt-1">No preview</p>
        </div>
      )}
    </div>

    {/* Bottom: Project Name + Actions */}
    <div className="p-2.5">
      <h3 className="font-heading font-semibold text-[#312E81] text-[10px] leading-snug line-clamp-1 text-center mb-2">{cert.data?.projectName || "Untitled"}</h3>
      <div className="flex items-center justify-center gap-1">
        <Link href={`/certificates?view=${cert.id}`} className="p-1.5 rounded-full hover:bg-white/50 transition text-[#8B5CF6]" title="View">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </Link>
        <Link href={`/certificates?edit=${cert.id}`} className="p-1.5 rounded-full hover:bg-white/50 transition text-[#6B7280]" title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </Link>
        <button onClick={() => handleCertificateDownload(cert.data)} className="p-1.5 rounded-full hover:bg-white/50 transition text-[#8B5CF6]" title="Download">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button onClick={() => setDeleteCertConfirm(cert.id)} className="p-1.5 rounded-full hover:bg-red-50 transition text-red-400" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  </motion.div>
))}
              

          {/* Generate New Certificate Card */}
          <Link href="/certificates" 
            className="aspect-square rounded-2xl border-2 border-dashed border-[#C4B5FD]/40 flex flex-col items-center justify-center text-center hover:bg-white/20 transition cursor-pointer"
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(14px)" }}>
            <div className="w-12 h-12 rounded-full bg-[#C4B5FD]/20 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <h3 className="font-heading font-semibold text-[#8B5CF6] text-xs">Generate Certificate</h3>
            <p className="text-[10px] text-[#6B7280] mt-1">Showcase your project</p>
          </Link>
        </div>
      </div>
    )}
  </div>
)}

        {/* NOTES TAB */}
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

        {/* RESOURCES TAB */}
        {activeTab === "resources" && (
          data?.bookmarks?.filter((b: any) => !search || b.title?.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
            <EmptyState icon="📚" message="No saved resources yet." cta="Browse Resources" href="#" img="/pose3.png" />
          ) : (
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-3">
              {data?.bookmarks?.filter((b: any) => !search || b.title?.toLowerCase().includes(search.toLowerCase())).map((bookmark: any) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} onDelete={handleDeleteBookmark} onUpdate={refreshData} />
              ))}
            </div>
          )
        )}
      </div>

      {/* Delete Certificate Confirmation */}
      <AnimatePresence>
        {deleteCertConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-2xl border border-white/40 p-6 w-full max-w-sm text-center bg-white/90 backdrop-blur-xl"
              style={{ boxShadow: "0 20px 60px rgba(139,92,246,0.15)" }}>
              <span className="text-4xl">🗑️</span>
              <h3 className="font-heading font-bold text-[#312E81] mt-3">Delete Certificate?</h3>
              <p className="text-sm text-[#6B7280] mt-1">This cannot be undone.</p>
              <div className="flex gap-3 justify-center mt-5">
                <button onClick={() => setDeleteCertConfirm(null)} className="rounded-full border border-[#C4B5FD]/40 bg-white/50 px-5 py-2.5 text-sm text-[#6B7280]">Cancel</button>
                <button onClick={() => handleDeleteCertificate(deleteCertConfirm)} className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Lesson Card ───
function LessonCard({ lesson }: { lesson: any }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/40 p-2.5 lg:p-4"
      style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="w-8 h-8 lg:w-11 lg:h-11 rounded-xl bg-[#C4B5FD]/20 flex items-center justify-center text-base lg:text-xl shrink-0">📖</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-[#312E81] text-[11px] lg:text-sm truncate">{lesson.title || "Untitled Lesson"}</h3>
          <p className="text-[9px] lg:text-xs text-[#6B7280]">{lesson.completed_at ? new Date(lesson.completed_at).toLocaleDateString() : ""} — {lesson.score || 0}%</p>
        </div>
        <Link 
          href={`/learn?skill_id=${lesson.skill_id}${lesson.project_id ? `&project_id=${lesson.project_id}` : ""}`}
          className="rounded-full bg-[#8B5CF6]/10 px-2.5 py-1.5 text-[10px] lg:text-xs font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition shrink-0">
          Review
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Bookmark Card with Edit ───
function BookmarkCard({ bookmark, onDelete, onUpdate }: { bookmark: any; onDelete: (id: string) => void; onUpdate: () => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url || "");
  const [desc, setDesc] = useState(bookmark.description || "");
  const [type, setType] = useState(bookmark.type || "article");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("bookmarks").update({ title, url, description: desc, type }).eq("id", bookmark.id);
    setEditing(false);
    setSaving(false);
    onUpdate();
  };

  if (editing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="rounded-2xl border border-white/40 p-3 lg:p-4"
        style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
        <div className="space-y-2">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-lg border border-white/40 bg-white/50 px-3 py-1.5 text-xs text-[#312E81] outline-none" />
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" className="w-full rounded-lg border border-white/40 bg-white/50 px-3 py-1.5 text-xs text-[#312E81] outline-none" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" rows={2} className="w-full rounded-lg border border-white/40 bg-white/50 px-3 py-1.5 text-xs text-[#312E81] outline-none resize-none" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-white/40 bg-white/50 px-3 py-1.5 text-xs text-[#312E81] outline-none">
            <option value="article">📄 Article</option>
            <option value="video">🎬 Video</option>
            <option value="tool">🔧 Tool</option>
            <option value="other">🔗 Other</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="flex-1 rounded-lg border border-[#C4B5FD]/40 bg-white/50 py-1.5 text-[10px] text-[#6B7280]">Cancel</button>
            <button onClick={handleSave} disabled={!title.trim() || saving} className="flex-1 rounded-lg bg-[#8B5CF6] py-1.5 text-[10px] font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/40 p-2.5 lg:p-4"
      style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs">{bookmark.type === "video" ? "🎬" : bookmark.type === "article" ? "📄" : bookmark.type === "tool" ? "🔧" : "🔗"}</span>
          <h3 className="font-heading font-semibold text-[#312E81] text-[11px] lg:text-sm truncate">{bookmark.title}</h3>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={() => setEditing(true)} className="p-1 rounded-full hover:bg-white/40 text-[#6B7280]"><Edit3 size={13} /></button>
          <button onClick={() => onDelete(bookmark.id)} className="p-1 rounded-full hover:bg-white/40 text-[#6B7280] hover:text-red-500"><Trash2 size={13} /></button>
        </div>
      </div>
      <p className="text-[10px] lg:text-xs text-[#6B7280] line-clamp-2 mb-1.5">{bookmark.description}</p>
      {bookmark.url && (
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] lg:text-xs font-semibold text-[#8B5CF6] hover:underline">
          <ExternalLink size={12} /> Open
        </a>
      )}
    </motion.div>
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
function getBadgeImage(badgeName: string): string {
  const map: Record<string, string> = {
    "First Step 🌱": "/first_step.png",
    "Code Gardener 🌿": "/code_gardener.png",
    "Knowledge Seeker 📚": "/knowledge_seeker.png",
    "Scholar Owl 🦉": "/scholar_owl.png",
    "Perfect Score ⭐": "/perfect_score.png",
    "Precision Master 🎯": "/precision_master.png",
    "Project Starter 🚀": "/project_starter.png",
    "Builder 🏗️": "/builder.png",
    "Project Master 🏆": "/project_master.png",
    "Ship It! 🚢": "/ship_it.png",
    "Triple Threat 🔥": "/triple_threat.png",
    "Consistent 🌟": "/consistent.png",
    "Weekly Warrior 🔥": "/weekly_warrior.png",
    "Monthly Master 👑": "/monthly_master.png",
  };
  return map[badgeName] || "";
}