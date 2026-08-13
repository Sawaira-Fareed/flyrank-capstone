"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AnimatedSendButton from "@/components/common/AnimatedSendButton";

export default function ButtonPlaygroundPage() {
  const [lastResult, setLastResult] = useState<string>("Click the Send button to test");
  const [forceState, setForceState] = useState<"none" | "success" | "failure">("none");

  const simulateSuccess = async (): Promise<boolean> => {
    setLastResult("Sending...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastResult("✅ Message sent successfully!");
    return true;
  };

  const simulateFailure = async (): Promise<boolean> => {
    setLastResult("Sending...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastResult("❌ Connection failed — click Retry");
    return false;
  };

  const simulateRandom = async (): Promise<boolean> => {
    setLastResult("Sending...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    const success = Math.random() > 0.5;
    setLastResult(success ? "✅ Message sent successfully!" : "❌ Connection failed — click Retry");
    return success;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #87CEEB 0%, #B0E0E6 25%, #FFD6E8 50%, #FDF2F8 75%, #EDE9FE 100%)",
      }}>
      <div className="max-w-lg w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#312E81] mb-6">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="rounded-[28px] border border-white/40 p-8 text-center"
          style={{
            background: "rgba(255,255,255,0.30)",
            backdropFilter: "blur(22px)",
            boxShadow: "0 20px 60px rgba(139,92,246,0.15)",
          }}>
          <h1 className="font-heading text-2xl font-bold text-[#312E81] mb-2">
            🎯 Animated Send Button
          </h1>
          <p className="text-sm text-[#6B7280] mb-6">
            FE-AA1: Buttons with a Brain — Full lifecycle animation
          </p>

          <div className="rounded-2xl border border-white/40 bg-white/20 p-4 mb-6">
            <div className="flex items-end gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-white/40 bg-white/50 px-4 py-2.5 text-sm text-[#312E81] outline-none"
                disabled
              />
              <AnimatedSendButton onSend={simulateRandom} />
            </div>
            <p className="text-xs text-[#6B7280] mt-3">{lastResult}</p>
          </div>

          {/* Force State Triggers */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#312E81]">Force States for Review:</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={simulateSuccess}
                className="rounded-full bg-emerald-400/20 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-400/30 transition"
              >
                ✓ Force Success
              </button>
              <button 
                onClick={simulateFailure}
                className="rounded-full bg-red-400/20 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-400/30 transition"
              >
                ✗ Force Failure
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/40 p-5 mt-6 text-left"
          style={{ background: "rgba(255,255,255,0.30)", backdropFilter: "blur(18px)" }}>
          <h3 className="font-heading font-semibold text-[#312E81] text-sm mb-2">📝 Duration & Easing Choices</h3>
          <ul className="space-y-2 text-xs text-[#6B7280]">
            <li>• <strong>Hover scale:</strong> 1.08 — subtle enough to not feel jumpy</li>
            <li>• <strong>Icon crossfade:</strong> 200ms ease-out — fast but visible</li>
            <li>• <strong>Success checkmark:</strong> Spring damping 12, stiffness 300 — bouncy confirmation</li>
            <li>• <strong>Error shake:</strong> 400ms — 3 oscillations convey error</li>
            <li>• <strong>Spinner:</strong> 1s linear infinite rotation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}