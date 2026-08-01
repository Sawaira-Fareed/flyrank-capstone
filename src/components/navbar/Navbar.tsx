"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import GradientButton from "@/components/common/GradientButton";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#cta" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`flex items-center justify-between px-6 lg:px-16 py-5 transition-all duration-500 ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl lg:text-4xl">🌸</span>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">BloomLab</h1>
            <p className="text-xs text-slate-500">Learning grows naturally</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="font-medium text-slate-700 hover:text-violet-600 transition">
              {item.label}
            </Link>
          ))}
          {/* Resources Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 font-medium text-slate-700 hover:text-violet-600 transition">
              Resources <ChevronDown size={16} />
            </button>
             <Link href="/assignments" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 rounded-t-xl transition">📋 Assignments</Link>
            <div className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link href="/playground" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 rounded-t-xl transition">🧩 Playground</Link>
              <Link href="/health" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition">❤️ Health Check</Link>
              <Link href="/chat" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 rounded-b-xl transition">💬 AI Chat</Link>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="font-medium text-slate-700 hover:text-violet-600 transition text-sm lg:text-base">
            Log In
          </Link>
          <Link href="/signup">
            <GradientButton>Start Growing 🌱</GradientButton>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}