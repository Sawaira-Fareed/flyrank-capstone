"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Markdown from "react-markdown";

export default function TrialPage() {
  const [messageCount, setMessageCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasSent = useRef(false);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  // Track message count
  useEffect(() => {
    const userMessages = messages.filter((m) => m.role === "user").length;
    setMessageCount(userMessages);
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-send project idea from URL — only once
  useEffect(() => {
    if (typeof window !== "undefined" && !hasSent.current) {
      const params = new URLSearchParams(window.location.search);
      const idea = params.get("idea");
      if (idea) {
        hasSent.current = true;
        setTimeout(() => {
          sendMessage({ text: idea });
        }, 600);
      }
    }
  }, []);

  const trialOver = messageCount >= 3;
  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = () => {
    if (!input.trim() || isLoading || trialOver) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="relative min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/auth-back.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}>
      <div className="absolute inset-0 bg-white/50" />

      {/* Elsa — fixed on left edge */}
      <div className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <Image src="/elsa.png" alt="Elsa" width={300} height={400} className="object-contain" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#312E81] transition bg-white/50 backdrop-blur rounded-full px-4 py-2 border border-white/40">
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur rounded-full px-4 py-2 border border-white/40">
            <MessageCircle size={16} className="text-[#8B5CF6]" />
            <span className="text-sm font-semibold text-[#312E81]">{3 - messageCount} free messages left</span>
          </div>
        </div>

        {/* Chat Card */}
        <div className="flex-1 rounded-[28px] border border-white/45 flex flex-col overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            boxShadow: "0 20px 60px rgba(167,139,250,0.15)",
          }}>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Image src="/laptop.png" alt="Elsa" width={200} height={260} className="object-contain mb-4" />
                <h2 className="font-heading text-2xl font-bold text-[#312E81]">Hi! I'm Elsa 🌸</h2>
                <p className="text-sm text-[#6B7280] mt-2 max-w-md">
                  I'm your AI coding mentor. Ask me anything about programming, or tell me what project you want to build!
                </p>
                <p className="text-xs text-[#6B7280]/60 mt-4 bg-white/40 rounded-full px-4 py-1.5 border border-white/30">
                  You have 3 free messages — no signup required
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white"
                    : "bg-white/60 backdrop-blur text-[#312E81] border border-white/40"
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

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/40 backdrop-blur rounded-2xl px-4 py-3 text-sm text-[#6B7280] animate-pulse">Elsa is thinking...</div>
              </div>
            )}

            {trialOver && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-6 text-center border border-[#F9A8D4]/30"
                style={{ background: "rgba(253,242,248,0.60)", backdropFilter: "blur(14px)" }}>
                <Image src="/rocket.png" alt="Ready to launch" width={140} height={160} className="object-contain mx-auto mb-3" />
                <h3 className="font-heading text-xl font-bold text-[#312E81]">You've used your 3 free messages!</h3>
                <p className="text-sm text-[#6B7280] mt-2 mb-4">
                  Create a free account to unlock unlimited learning with Elsa — personalized lessons, projects, and more.
                </p>
                <Link href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-3 text-sm font-semibold text-white hover:scale-105 transition shadow-lg">
                  Create Free Account 🌸
                </Link>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {!trialOver && (
            <div className="border-t border-white/30 p-4">
              <div className="flex items-center gap-3">
                <input value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask Elsa something..." disabled={isLoading}
                  className="flex-1 rounded-full border border-white/40 bg-white/50 backdrop-blur px-5 py-3 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 disabled:opacity-50" />
                <button onClick={handleSend} disabled={!input.trim() || isLoading}
                  className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] p-3 text-white hover:scale-105 transition disabled:opacity-50">
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}