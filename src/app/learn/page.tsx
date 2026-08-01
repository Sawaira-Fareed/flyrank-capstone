"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell, Send, StopCircle, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function LearnPage() {
  const [timer, setTimer] = useState(900); // 15 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");

  // Timer
  useEffect(() => {
    if (!isRunning || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Auto-scroll
  useEffect(() => {
    if (!userScrolledUp) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, userScrolledUp]);

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

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/path" className="text-[#6B7280] hover:text-[#312E81] transition">
              <ArrowLeft size={22} />
            </Link>
            <div>
              <span className="font-heading text-lg font-bold text-[#312E81]">Today's Lesson</span>
              <p className="text-xs text-[#6B7280]">Displaying Data — Day 7 of 12</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Timer */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isRunning
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-[#C4B5FD]/20 text-[#8B5CF6]"
              }`}
            >
              ⏱️ {formatTime(timer)}
            </button>
            <Bell size={20} className="text-[#6B7280]" />
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/60">
              <Image src="/face.png" alt="Profile" fill className="object-cover" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — Elsa Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div
              className="rounded-2xl border border-white/40 p-6 text-center"
              style={{
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
              }}
            >
              <Image
                src="/elsa-auth.png"
                alt="Elsa"
                width={160}
                height={220}
                className="object-contain mx-auto"
              />
              <h2 className="font-heading text-xl font-bold text-[#312E81] mt-3">Elsa</h2>
              <p className="text-xs text-[#6B7280]">AI Mentor</p>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 mt-2" />

              <div className="mt-5 text-left space-y-3">
                <div
                  className="rounded-xl p-3 text-sm"
                  style={{ background: "rgba(139,92,246,0.08)" }}
                >
                  <p className="font-semibold text-[#8B5CF6] text-xs">🌟 Today's Goal</p>
                  <p className="text-[#312E81] text-sm mt-1">Learn how to display data from an API on screen</p>
                </div>
                <div
                  className="rounded-xl p-3 text-sm"
                  style={{ background: "rgba(244,114,182,0.06)" }}
                >
                  <p className="font-semibold text-[#EC4899] text-xs">✏️ Challenge</p>
                  <p className="text-[#312E81] text-sm mt-1">Display the weather data in a card format</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CENTER — Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col"
          >
            <div
              className="flex-1 rounded-2xl border border-white/40 flex flex-col overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.20)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 8px 24px rgba(139,92,246,0.08)",
              }}
            >
              {/* Messages */}
              <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-5 space-y-4"
                style={{ maxHeight: "500px" }}
              >
                {messages.length === 0 && (
                  <div className="text-center py-16">
                    <span className="text-5xl">👩‍🏫</span>
                    <p className="font-heading font-semibold text-[#312E81] mt-4">Ready to learn?</p>
                    <p className="text-sm text-[#6B7280] mt-1">
                      Ask Elsa anything about today's lesson!
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mt-5">
                      {[
                        "Explain APIs like I'm 5",
                        "Show me an example",
                        "What is JSON?",
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            sendMessage({ text: suggestion });
                            if (!isRunning) setIsRunning(true);
                          }}
                          className="rounded-full border border-[#C4B5FD]/40 bg-white/40 px-4 py-2 text-xs text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white"
                          : "bg-white/60 backdrop-blur text-[#312E81] border border-white/40"
                      }`}
                    >
                      {msg.parts.map((part, i) =>
                        part.type === "text" ? <span key={i}>{part.text}</span> : null
                      )}
                    </div>
                  </div>
                ))}

                {status === "submitted" && (
                  <div className="flex justify-start">
                    <div className="bg-white/40 backdrop-blur rounded-2xl px-4 py-3 text-sm text-[#6B7280] animate-pulse">
                      Elsa is thinking...
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-white/30 p-4">
                <div className="flex items-center gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask Elsa something..."
                    disabled={isLoading}
                    className="flex-1 rounded-full border border-white/40 bg-white/40 backdrop-blur px-5 py-3 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 disabled:opacity-50"
                  />
                  {isLoading ? (
                    <button
                      onClick={() => stop()}
                      className="rounded-full bg-red-400 p-3 text-white hover:bg-red-500 transition"
                    >
                      <StopCircle size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] p-3 text-white hover:scale-105 transition disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}