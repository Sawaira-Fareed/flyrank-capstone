"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell, Send, StopCircle, Loader2, CheckCircle } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { createClient } from "@/utils/supabase/client";
import { getUserProjects, getProjectSkills, updateProjectProgress } from "@/lib/store";
import { ELSA_SYSTEM_PROMPT } from "@/lib/prompts";
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

  const initialMessage = activeSkill
    ? `I'm ready to learn "${activeSkill.name}" for my project "${activeProject?.title}". Let's start the lesson!`
    : "";

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  // Load user + active skill
  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("email", authUser.email)
        .single();
      setUser(profile || { name: authUser.email?.split("@")[0] || "Bloomer" });

      if (profile) {
        const userProjects = await getUserProjects(profile.id);
        const active = userProjects.filter((p: any) => p.status === "active")[0];
        if (active) {
          setActiveProject(active);
          const skills = await getProjectSkills(active.id);
          const currentSkill = skills.find((s: any) => s.status === "active");
          if (currentSkill) {
            setActiveSkill(currentSkill);
            // Auto-send initial message
            setTimeout(() => {
              sendMessage({
                text: `I'm ready to learn "${currentSkill.name}" for my project "${active.title}". My project goal is: "${active.goal}". Please create a lesson for this skill.`,
              });
            }, 500);
          }
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  // Timer
  useEffect(() => {
    if (!isRunning || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // Auto-scroll
  useEffect(() => {
    if (!userScrolledUp) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, userScrolledUp]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setUserScrolledUp(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleSend = () => {
    if (!input.trim() || status !== "ready") return;
    sendMessage({ text: input });
    setInput("");
    setUserScrolledUp(false);
    if (!isRunning) setIsRunning(true);
  };

  const handleCompleteLesson = async () => {
    if (!user || !activeSkill || !activeProject) return;
    setCompleting(true);
    try {
      // Mark skill as completed
      await supabase.from("skills").update({ status: "completed" }).eq("id", activeSkill.id);

      // Activate next skill
      const skills = await getProjectSkills(activeProject.id);
      const nextSkill = skills.find((s: any) => s.status === "locked");
      if (nextSkill) {
        await supabase.from("skills").update({ status: "active" }).eq("id", nextSkill.id);
      }

      // Save lesson record
      await supabase.from("lessons").insert({
        user_id: user.id,
        skill_id: activeSkill.id,
        content: `Completed lesson: ${activeSkill.name}`,
        score: 100,
        completed: true,
        completed_at: new Date().toISOString(),
      });

      // Update project progress
      const completedCount = skills.filter((s: any) => s.status === "completed").length + 1;
      const newProgress = Math.round((completedCount / skills.length) * 100);
      await updateProjectProgress(activeProject.id, newProgress, activeProject.current_day + 1);

      setLessonCompleted(true);
      setIsRunning(false);
    } finally {
      setCompleting(false);
    }
  };

  const isLoading = status === "submitted" || status === "streaming";

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
        <span className="text-6xl">🔒</span>
        <h2 className="font-heading text-2xl font-bold text-[#312E81]">Please log in</h2>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  if (!activeSkill || !activeProject) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
        <Image src="/showel.png" alt="Start building" width={160} height={180} className="object-contain" />
        <h2 className="font-heading text-2xl font-bold text-[#312E81]">No active lesson</h2>
        <p className="text-sm text-[#6B7280]">Create a project and start your skill map to begin learning!</p>
        <Link href="/garden" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Garden</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/path" className="text-[#6B7280] hover:text-[#312E81] transition"><ArrowLeft size={22} /></Link>
            <div>
              <h1 className="font-heading text-lg lg:text-xl font-bold text-[#312E81]">{activeSkill.name}</h1>
              <p className="text-xs text-[#6B7280]">
                {activeProject.title} — Skill {activeSkill.sort_order + 1} of {activeProject.total_days}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsRunning(!isRunning)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isRunning ? "bg-emerald-100 text-emerald-700" : "bg-[#C4B5FD]/20 text-[#8B5CF6]"
              }`}>
              ⏱️ {formatTime(timer)}
            </button>
            <Bell size={20} className="text-[#6B7280]" />
            <Link href="/profile" className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/60">
              <Image src="/idle.png" alt="Profile" fill className="object-cover" />
            </Link>
          </div>
        </div>

        {lessonCompleted ? (
          /* Completion State */
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/40 p-8 text-center max-w-lg mx-auto"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
            <Image src="/mission.png" alt="Lesson Complete" width={160} height={180} className="object-contain mx-auto" />
            <CheckCircle size={48} className="mx-auto text-emerald-400 mt-4" />
            <h2 className="font-heading text-2xl font-bold text-[#312E81] mt-4">Lesson Complete! 🎉</h2>
            <p className="text-sm text-[#6B7280] mt-2">You've mastered {activeSkill.name}. Amazing progress!</p>
            <div className="flex gap-3 justify-center mt-6">
              <Link href="/path" className="rounded-full border border-[#C4B5FD]/40 bg-white/40 px-5 py-2.5 text-sm font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition">
                Back to Skill Map
              </Link>
              <Link href="/garden" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 transition">
                Go to Garden
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT — Elsa Panel */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <div className="rounded-2xl border border-white/40 p-5 text-center"
                style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
                <Image src="/laptop.png" alt="Elsa teaching" width={150} height={200} className="object-contain mx-auto" />
                <h2 className="font-heading text-lg font-bold text-[#312E81] mt-3">Elsa</h2>
                <p className="text-xs text-[#6B7280]">AI Mentor</p>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 mt-2" />

                <div className="mt-5 text-left space-y-3">
                  <div className="rounded-xl p-3 text-sm" style={{ background: "rgba(139,92,246,0.08)" }}>
                    <p className="font-semibold text-[#8B5CF6] text-xs">🌟 Today's Goal</p>
                    <p className="text-[#312E81] text-sm mt-1">{activeSkill.description}</p>
                  </div>
                  <div className="rounded-xl p-3 text-sm" style={{ background: "rgba(244,114,182,0.06)" }}>
                    <p className="font-semibold text-[#EC4899] text-xs">📌 Project</p>
                    <p className="text-[#312E81] text-sm mt-1">{activeProject.title}</p>
                  </div>
                </div>

                <button onClick={handleCompleteLesson} disabled={completing}
                  className="mt-5 w-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 py-2.5 text-sm font-semibold text-white hover:scale-105 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {completing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  {completing ? "Saving..." : "Complete Lesson"}
                </button>
              </div>
            </motion.div>

            {/* CENTER/RIGHT — Chat */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 flex flex-col">
              <div className="flex-1 rounded-2xl border border-white/40 flex flex-col overflow-hidden"
                style={{ background: "rgba(255,255,255,0.20)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
                <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-5 space-y-4" style={{ maxHeight: "500px" }}>
                  {messages.length === 0 && (
                    <div className="text-center py-16">
                      <span className="text-5xl">👩‍🏫</span>
                      <p className="font-heading font-semibold text-[#312E81] mt-4">Starting your lesson...</p>
                      <p className="text-sm text-[#6B7280] mt-1">Elsa is preparing your personalized lesson for "{activeSkill.name}".</p>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === "user" ? "bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white" : "bg-white/60 backdrop-blur text-[#312E81] border border-white/40"
                      }`}>
                       {msg.parts.map((part, i) => 
  part.type === "text" ? (
    <Markdown key={i}>{part.text}</Markdown>
  ) : null
)}
{msg.role === "assistant" && !isLoading && (
  <div className="flex gap-2 mt-2 ml-1">
    {/* Continue */}
    <button
      onClick={() => sendMessage({ text: "Please continue from where you stopped." })}
      className="text-[#6B7280] hover:text-[#8B5CF6] transition p-1 rounded-full hover:bg-white/40"
      title="Continue response"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>

    {/* Retry */}
    <button
      onClick={() => {
        const userMessages = messages.filter(m => m.role === "user");
        const lastUserMsg = userMessages[userMessages.length - 1];
        if (lastUserMsg) {
          const text = lastUserMsg.parts.find(p => p.type === "text")?.text || "";
          sendMessage({ text });
        }
      }}
      className="text-[#6B7280] hover:text-[#8B5CF6] transition p-1 rounded-full hover:bg-white/40"
      title="Retry"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    </button>

    {/* Copy */}
    <button
      onClick={() => {
        const text = msg.parts.find(p => p.type === "text")?.text || "";
        navigator.clipboard.writeText(text);
      }}
      className="text-[#6B7280] hover:text-[#8B5CF6] transition p-1 rounded-full hover:bg-white/40"
      title="Copy"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  </div>
)}
                      </div>
                    </div>
                  ))}

                  {status === "submitted" && (
                    <div className="flex justify-start">
                      <div className="bg-white/40 backdrop-blur rounded-2xl px-4 py-3 text-sm text-[#6B7280] animate-pulse">Elsa is thinking...</div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="border-t border-white/30 p-4">
                  <div className="flex items-center gap-3">
                    <input value={input} onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask Elsa something..." disabled={isLoading}
                      className="flex-1 rounded-full border border-white/40 bg-white/40 backdrop-blur px-5 py-3 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 disabled:opacity-50" />
                    {isLoading ? (
                      <button onClick={() => stop()} className="rounded-full bg-red-400 p-3 text-white hover:bg-red-500 transition">
                        <StopCircle size={18} />
                      </button>
                    ) : (
                      <button onClick={handleSend} disabled={!input.trim()}
                        className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] p-3 text-white hover:scale-105 transition disabled:opacity-50">
                        <Send size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}