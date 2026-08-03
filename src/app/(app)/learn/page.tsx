"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Send, StopCircle, Loader2, CheckCircle, Bookmark, X } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { createClient } from "@/utils/supabase/client";
import { getUserProjects, getProjectSkills, updateProjectProgress, addBookmark } from "@/lib/store";
import Markdown from "react-markdown";

export default function LearnPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [activeSkill, setActiveSkill] = useState<any>(null);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(900);
  const [isRunning, setIsRunning] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [input, setInput] = useState("");
  const [showBookmark, setShowBookmark] = useState(false);
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [bookmarkUrl, setBookmarkUrl] = useState("");
  const [bookmarkDesc, setBookmarkDesc] = useState("");
  const [bookmarkType, setBookmarkType] = useState("article");
  const [bookmarkSaving, setBookmarkSaving] = useState(false);
  const [bookmarkDone, setBookmarkDone] = useState(false);

  const { messages, sendMessage, status, stop } = useChat({ transport: new DefaultChatTransport({ api: "/api/chat" }) });

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("email", authUser.email).single();
      setUser(profile || { name: authUser.email?.split("@")[0] || "Bloomer" });
      if (profile) {
        const all = await getUserProjects(profile.id);
        const active = all.filter((p: any) => p.status === "active")[0];
        if (active) {
          setActiveProject(active);
          const skills = await getProjectSkills(active.id);
          const current = skills.find((s: any) => s.status === "active");
          if (current) {
            setActiveSkill(current);
            setTimeout(() => sendMessage({ text: `I'm ready to learn "${current.name}" for my project "${active.title}". My project goal is: "${active.goal}". Please create a lesson.` }), 500);
          }
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => { if (!isRunning || timer <= 0) return; const i = setInterval(() => setTimer((t) => t - 1), 1000); return () => clearInterval(i); }, [isRunning, timer]);
  useEffect(() => { if (!userScrolledUp) bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, userScrolledUp]);

  const formatTime = (s: number) => { const m = Math.floor(s / 60); return `${m}:${(s % 60).toString().padStart(2, "0")}`; };
  const handleScroll = () => { if (!containerRef.current) return; const { scrollTop, scrollHeight, clientHeight } = containerRef.current; setUserScrolledUp(scrollHeight - scrollTop - clientHeight > 100); };
  const handleSend = () => { if (!input.trim() || status !== "ready") return; sendMessage({ text: input }); setInput(""); setUserScrolledUp(false); if (!isRunning) setIsRunning(true); };

  const handleCompleteLesson = async () => {
    if (!user || !activeSkill || !activeProject) return;
    setCompleting(true);
    try {
      await supabase.from("skills").update({ status: "completed" }).eq("id", activeSkill.id);
      const skills = await getProjectSkills(activeProject.id);
      const next = skills.find((s: any) => s.status === "locked");
      if (next) await supabase.from("skills").update({ status: "active" }).eq("id", next.id);
      await supabase.from("lessons").insert({ user_id: user.id, skill_id: activeSkill.id, content: `Completed: ${activeSkill.name}`, score: 100, completed: true, completed_at: new Date().toISOString() });
      const done = skills.filter((s: any) => s.status === "completed").length + 1;
      await updateProjectProgress(activeProject.id, Math.round((done / skills.length) * 100), activeProject.current_day + 1);
      setLessonCompleted(true); setIsRunning(false);
    } finally { setCompleting(false); }
  };

  const handleSaveBookmark = async () => {
    if (!user || !bookmarkTitle.trim()) return;
    setBookmarkSaving(true);
    try {
      await addBookmark(user.id, { title: bookmarkTitle.trim(), description: bookmarkDesc, url: bookmarkUrl, type: bookmarkType });
      setBookmarkDone(true);
      setTimeout(() => { setShowBookmark(false); setBookmarkDone(false); setBookmarkTitle(""); setBookmarkUrl(""); setBookmarkDesc(""); }, 1500);
    } catch {}
    finally { setBookmarkSaving(false); }
  };

  const isLoading = status === "submitted" || status === "streaming";

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        <div className="h-8 bg-white/20 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-white/15 rounded-2xl animate-pulse" />
          <div className="lg:col-span-2 h-96 bg-white/15 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
        <Image src="/laptop.png" alt="Elsa" width={160} height={200} className="object-contain w-36 lg:w-44 h-auto" />
        <h2 className="font-heading text-xl font-bold text-[#312E81] text-center">Please log in</h2>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  if (!activeSkill || !activeProject) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
        <Image src="/pose5.png" alt="Start building" width={140} height={170} className="object-contain w-32 lg:w-40 h-auto" />
        <h2 className="font-heading text-xl font-bold text-[#312E81] text-center">No active lesson</h2>
        <p className="text-sm text-[#6B7280] text-center">Create a project and start your skill map!</p>
        <Link href="/garden" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Garden</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link href="/path" className="text-[#6B7280] hover:text-[#312E81]"><ArrowLeft size={22} /></Link>
          <div>
            <h1 className="font-heading text-lg lg:text-xl font-bold text-[#312E81]">{activeSkill.name}</h1>
            <p className="text-xs text-[#6B7280]">{activeProject.title} — Skill {activeSkill.sort_order + 1}</p>
          </div>
        </div>
        <button onClick={() => setIsRunning(!isRunning)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isRunning ? "bg-emerald-100 text-emerald-700" : "bg-[#C4B5FD]/20 text-[#8B5CF6]"}`}>⏱️ {formatTime(timer)}</button>
      </div>

      {lessonCompleted ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-white/40 p-6 lg:p-8 text-center max-w-lg mx-auto"
          style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
          <Image src="/mission_complete.png" alt="Complete" width={140} height={160} className="object-contain w-32 lg:w-40 h-auto mx-auto" />
          <CheckCircle size={48} className="mx-auto text-emerald-400 mt-4" />
          <h2 className="font-heading text-xl lg:text-2xl font-bold text-[#312E81] mt-4">Lesson Complete! 🎉</h2>
          <p className="text-sm text-[#6B7280] mt-2">You've mastered {activeSkill.name}!</p>
          <div className="flex gap-3 justify-center mt-6">
            <Link href="/path" className="rounded-full border border-[#C4B5FD]/40 bg-white/40 px-5 py-2.5 text-sm font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition">Skill Map</Link>
            <Link href="/garden" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 transition">Garden</Link>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-56 shrink-0">
            <div className="rounded-2xl border border-white/40 p-5 text-center"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
              <Image src="/laptop.png" alt="Elsa" width={120} height={160} className="object-contain w-28 lg:w-32 h-auto mx-auto" />
              <h2 className="font-heading text-lg font-bold text-[#312E81] mt-2">Elsa</h2>
              <p className="text-xs text-[#6B7280]">AI Mentor</p>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mt-1" />
              <div className="mt-4 text-left space-y-2">
                <div className="rounded-xl p-3 text-sm" style={{ background: "rgba(139,92,246,0.08)" }}>
                  <p className="font-semibold text-[#8B5CF6] text-xs">🌟 Goal</p>
                  <p className="text-[#312E81] text-sm mt-1">{activeSkill.description}</p>
                </div>
                <div className="rounded-xl p-3 text-sm" style={{ background: "rgba(244,114,182,0.06)" }}>
                  <p className="font-semibold text-[#EC4899] text-xs">📌 Project</p>
                  <p className="text-[#312E81] text-sm mt-1">{activeProject.title}</p>
                </div>
              </div>
              <button onClick={() => setShowBookmark(true)}
                className="mt-3 w-full rounded-full border border-[#C4B5FD]/40 bg-white/30 px-3 py-2 text-[11px] lg:text-xs font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition flex items-center justify-center gap-1">
                📌 Save as Resource
              </button>
              <button onClick={handleCompleteLesson} disabled={completing}
                className="mt-3 w-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 py-2.5 text-sm font-semibold text-white hover:scale-105 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {completing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}{completing ? "Saving..." : "Complete"}
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1 flex flex-col">
            <div className="flex-1 rounded-2xl border border-white/40 flex flex-col overflow-hidden"
              style={{ background: "rgba(255,255,255,0.20)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
              <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4" style={{ maxHeight: "500px" }}>
                {messages.length === 0 && (
                  <div className="text-center py-16">
                    <span className="text-4xl">👩‍🏫</span>
                    <p className="font-heading font-semibold text-[#312E81] mt-4">Starting your lesson...</p>
                    <p className="text-sm text-[#6B7280] mt-1">Elsa is preparing "{activeSkill.name}".</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white" : "bg-white/60 backdrop-blur text-[#312E81] border border-white/40"}`}>
                      {msg.parts.map((part, i) => part.type === "text" ? <Markdown key={i}>{part.text}</Markdown> : null)}
                      {msg.role === "assistant" && !isLoading && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => sendMessage({ text: "Please continue." })} className="text-[#6B7280] hover:text-[#8B5CF6] p-1 rounded-full hover:bg-white/40" title="Continue">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                          </button>
                          <button onClick={() => { const u = [...messages].reverse().find(m => m.role === "user"); const t = u ? (u.parts.find((p: any) => p.type === "text") as any)?.text || "" : ""; if (t) sendMessage({ text: t }); }} className="text-[#6B7280] hover:text-[#8B5CF6] p-1 rounded-full hover:bg-white/40" title="Retry">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                          </button>
                          <button onClick={() => { const t = (msg.parts.find((p: any) => p.type === "text") as any)?.text || ""; if (t) navigator.clipboard.writeText(t); }} className="text-[#6B7280] hover:text-[#8B5CF6] p-1 rounded-full hover:bg-white/40" title="Copy">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {status === "submitted" && <div className="flex justify-start"><div className="bg-white/40 rounded-2xl px-4 py-3 text-sm text-[#6B7280] animate-pulse">Elsa is thinking...</div></div>}
                <div ref={bottomRef} />
              </div>
              <div className="border-t border-white/30 p-3 lg:p-4">
                <div className="flex items-center gap-2">
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Ask Elsa..." disabled={isLoading}
                    className="flex-1 rounded-full border border-white/40 bg-white/40 backdrop-blur px-4 py-2.5 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 disabled:opacity-50" />
                  {isLoading ? (
                    <button onClick={() => stop()} className="rounded-full bg-red-400 p-2.5 text-white hover:bg-red-500 transition"><StopCircle size={18} /></button>
                  ) : (
                    <button onClick={handleSend} disabled={!input.trim()} className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] p-2.5 text-white hover:scale-105 transition disabled:opacity-50"><Send size={18} /></button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bookmark Modal */}
      <AnimatePresence>
        {showBookmark && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-2xl border border-white/40 p-6 w-full max-w-md bg-white/90 backdrop-blur-xl"
              style={{ boxShadow: "0 20px 60px rgba(139,92,246,0.15)" }}>
              {bookmarkDone ? (
                <div className="text-center py-4">
                  <CheckCircle size={48} className="mx-auto text-emerald-400" />
                  <h3 className="font-heading font-bold text-[#312E81] mt-3">Saved!</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Resource added to your library.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg font-bold text-[#312E81]">Save Resource</h2>
                    <button onClick={() => setShowBookmark(false)} className="p-1 rounded-full hover:bg-white/40"><X size={18} className="text-[#6B7280]" /></button>
                  </div>
                  <div className="space-y-3">
                    <input type="text" value={bookmarkTitle} onChange={(e) => setBookmarkTitle(e.target.value)} placeholder="Title *" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2.5 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60" />
                    <input type="url" value={bookmarkUrl} onChange={(e) => setBookmarkUrl(e.target.value)} placeholder="URL (optional)" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2.5 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60" />
                    <textarea value={bookmarkDesc} onChange={(e) => setBookmarkDesc(e.target.value)} placeholder="Description (optional)" rows={2} className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur px-4 py-2.5 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 resize-none" />
                    <select value={bookmarkType} onChange={(e) => setBookmarkType(e.target.value)} className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2.5 text-sm text-[#312E81] outline-none">
                      <option value="article">📄 Article</option>
                      <option value="video">🎬 Video</option>
                      <option value="tool">🔧 Tool</option>
                      <option value="other">🔗 Other</option>
                    </select>
                    <button onClick={handleSaveBookmark} disabled={!bookmarkTitle.trim() || bookmarkSaving}
                      className="w-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] py-2.5 text-sm font-semibold text-white hover:scale-105 transition disabled:opacity-50 flex items-center justify-center gap-2">
                      <Bookmark size={16} /> {bookmarkSaving ? "Saving..." : "Save Resource"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}