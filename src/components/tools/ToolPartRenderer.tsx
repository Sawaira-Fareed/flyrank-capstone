"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import LearningSummaryCard from "./LearningSummaryCard";

type ToolState = "input-streaming" | "input-available" | "output-available" | "output-error";

export default function ToolPartRenderer({ toolName, state, input, output, error }: {
  toolName: string;
  state: ToolState;
  input?: any;
  output?: any;
  error?: string;
}) {
  const [retrying, setRetrying] = useState(false);

  if (state === "input-streaming") {
    return (
      <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 text-xs text-[#6B7280]">
        <Loader2 size={14} className="animate-spin" />
        <span>🔧 Elsa is deciding how to help...</span>
      </div>
    );
  }

  if (state === "input-available") {
    return (
      <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 text-xs text-[#8B5CF6]">
        <span>🔧</span>
        <span>Fetching your learning summary...</span>
      </div>
    );
  }

  if (state === "output-available" && output) {
    return <LearningSummaryCard data={output} />;
  }

  if (state === "output-error") {
    return (
      <div className="flex items-center gap-2 bg-red-50/50 rounded-xl px-3 py-2 text-xs text-red-500">
        <XCircle size={14} />
        <span>Couldn't fetch your data.</span>
        <button 
          onClick={() => setRetrying(true)}
          className="underline font-semibold ml-auto"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
}