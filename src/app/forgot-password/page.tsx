"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/auth-back.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/8" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#C4B5FD]/15 blur-[130px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#F9A8D4]/12 blur-[130px]" />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Back link */}
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#312E81] transition mb-6 bg-white/40 backdrop-blur rounded-full px-4 py-2 border border-white/40">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[28px] border border-white/45 px-8 py-10"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            boxShadow: "0 20px 60px rgba(167,139,250,0.18)",
          }}
        >
          {sent ? (
            /* Success State */
            <div className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <CheckCircle size={64} className="mx-auto text-emerald-400" />
              </motion.div>
              <h2 className="font-heading text-2xl font-bold text-[#312E81] mt-4">Check Your Email</h2>
              <p className="text-sm text-[#6B7280] mt-2">
                We've sent a password reset link to <span className="font-semibold text-[#312E81]">{email}</span>
              </p>
              <p className="text-xs text-[#6B7280] mt-4">
                Didn't receive it?{" "}
                <button onClick={() => setSent(false)} className="text-[#8B5CF6] hover:underline font-semibold">
                  Try again
                </button>
              </p>
              <Link href="/login" className="inline-block mt-6 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white hover:scale-105 transition">
                Return to Login
              </Link>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-6">
                <span className="text-4xl">🔑</span>
                <h2 className="font-heading text-2xl font-bold text-[#312E81] mt-3">Forgot Password?</h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 rounded-full border border-white/40 bg-white/50 backdrop-blur px-5 py-3">
                    <Mail size={18} className="text-[#6B7280]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="your@email.com"
                      className="flex-1 bg-transparent text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60"
                    />
                  </div>
                  {error && <p className="mt-2 ml-4 text-xs text-red-500">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(139,92,246,0.35)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center text-sm text-[#6B7280] mt-6">
                Remember your password?{" "}
                <Link href="/login" className="font-semibold text-[#8B5CF6] hover:underline">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}