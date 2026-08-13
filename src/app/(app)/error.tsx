"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <span className="text-5xl mb-4">🌸</span>
      <h2 className="font-heading text-xl font-bold text-[#312E81]">Something went wrong</h2>
      <p className="text-sm text-[#6B7280] mt-2">Don't worry — your garden is safe.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white hover:scale-105 transition"
      >
        Try Again
      </button>
    </div>
  );
}