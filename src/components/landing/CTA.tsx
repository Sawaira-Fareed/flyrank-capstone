"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();
  const [projectIdea, setProjectIdea] = useState("");

  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    if (projectIdea.trim()) {
      router.push(`/trial?idea=${encodeURIComponent(projectIdea.trim())}`);
    } else {
      router.push("/trial");
    }
  };

  return (
    <section id="cta" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Sky Blossom Background */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #87CEEB 0%, #B0E0E6 25%, #FFD6E8 50%, #FDF2F8 75%, #EDE9FE 100%)" }} />
      <div className="absolute top-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-white/30 blur-[140px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#FFD6E8]/30 blur-[130px]" />

      <motion.div animate={{ y: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 5 }}
        className="absolute left-4 lg:left-10 top-20 text-2xl lg:text-3xl">🌸</motion.div>
      <motion.div animate={{ y: [8, -8, 8] }} transition={{ repeat: Infinity, duration: 4 }}
        className="absolute right-4 lg:right-10 bottom-20 text-2xl lg:text-3xl">✨</motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* LEFT — Main CTA Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex-1 w-full lg:max-w-xl">
            <div className="rounded-[28px] border border-white/45 px-6 lg:px-10 py-8 lg:py-10 text-center"
              style={{
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(22px)",
                WebkitBackdropFilter: "blur(22px)",
                boxShadow: "0 20px 60px rgba(167,139,250,0.15)",
              }}>
              
              <Image src="/cta.png" alt="Start Growing" width={160} height={160} className="w-32 lg:w-40 h-auto mx-auto mb-4" />

              <h2 className="text-4xl lg:text-5xl font-bold text-[#312E81]">
                Ready to{" "}
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">grow</span>?
              </h2>
              <p className="mt-4 text-base lg:text-lg text-[#6B7280]">
                Tell Elsa what you want to build — try it free, no signup needed.
              </p>

              <form onSubmit={handleStart} className="mt-8">
                <div className="flex items-center rounded-full border border-white/50 bg-white/70 backdrop-blur-xl px-3 py-2 shadow-lg max-w-md mx-auto">
                  <input
                    type="text"
                    value={projectIdea}
                    onChange={(e) => setProjectIdea(e.target.value)}
                    placeholder='e.g., "I want to build a weather app"'
                    className="flex-1 bg-transparent px-4 text-sm lg:text-base text-[#312E81] outline-none placeholder:text-[#6B7280]/60"
                  />
                  <button type="submit"
                    className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-5 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base font-semibold text-white shadow-lg transition hover:scale-105 whitespace-nowrap">
                    Try Elsa Free →
                  </button>
                </div>
              </form>
              <p className="mt-4 text-xs text-[#6B7280]/70">3 messages free · No credit card required</p>
            </div>
          </motion.div>

          {/* CENTER — Elsa */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="hidden lg:block shrink-0">
            <Image src="/pose7.png" alt="Elsa" width={240} height={320} className="object-contain" />
          </motion.div>

          {/* RIGHT — Contact Card */}
          <ContactCard />
        </div>
      </div>
    </section>
  );
}

// Contact Card
function ContactCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) { setError("Fill in email and message."); return; }
    setLoading(true); setError("");
    try {
      await fetch("https://formspree.io/f/xwvgdzab", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, subject, message }) });
      setSent(true);
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
      className="w-full lg:w-[400px] shrink-0">
      <div className="rounded-[28px] border border-white/45 px-6 lg:px-8 py-8"
        style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", boxShadow: "0 20px 60px rgba(167,139,250,0.15)" }}>
        {sent ? (
          <div className="text-center py-4">
            <span className="text-5xl">✅</span>
            <h2 className="font-heading text-xl font-bold text-[#312E81] mt-4">Sent!</h2>
            <p className="text-sm text-[#6B7280] mt-2">We'll get back to you soon 🌸</p>
          </div>
        ) : (
          <>
            <h2 className="font-heading text-xl font-bold text-[#312E81] text-center mb-1">Get in Touch</h2>
            <p className="text-xs text-[#6B7280] text-center mb-6">Questions or suggestions?</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-5 py-2.5 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 focus:border-[#8B5CF6]" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email *" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-5 py-2.5 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 focus:border-[#8B5CF6]" />
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-5 py-2.5 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 focus:border-[#8B5CF6]" />
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your Message *" rows={3} className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur px-5 py-2.5 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 focus:border-[#8B5CF6] resize-none" />
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] py-2.5 font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
}