"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GradientButton from "@/components/common/GradientButton";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Glimpse Inside", href: "#glimpse-inside" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setResourcesOpen(false);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`flex items-center justify-between px-4 lg:px-16 py-4 lg:py-5 transition-all duration-500 ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-lg"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 lg:gap-3 shrink-0">
          <span className="text-2xl lg:text-4xl">🌸</span>
          <div>
            <h1 className="text-lg lg:text-2xl font-bold text-slate-900">BloomLab</h1>
            <p className="text-[10px] lg:text-xs text-slate-500 hidden sm:block">Learning grows naturally</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="font-medium text-slate-700 hover:text-violet-600 transition">
              {item.label}
            </Link>
          ))}

          {/* Resources Dropdown */}
          
            <div className="relative"
  onMouseEnter={() => setResourcesOpen(true)}
  onMouseLeave={() => setResourcesOpen(false)}>
  <button className="flex items-center gap-1 font-medium text-slate-700 hover:text-violet-600 transition py-2">
    Resources <ChevronDown size={16} className={resourcesOpen ? "rotate-180 transition" : "transition"} />
  </button>
  {resourcesOpen && (
    <div className="absolute top-full left-0 w-48 rounded-xl bg-white/95 backdrop-blur-xl border border-white/50 shadow-xl z-50 overflow-hidden">
      <Link href="/assignments" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition">📋 Assignments</Link>
      <Link href="/playground" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition">🧩 Playground</Link>
      <Link href="/health" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition">❤️ Health Check</Link>
      <Link href="/chat" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition">💬 AI Chat</Link>
      <Link href="/notes" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition">📝 Notes</Link>
    </div>
  )}
</div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/login" className="font-medium text-slate-700 hover:text-violet-600 transition text-sm">
            Log In
          </Link>
          <Link href="/signup">
            <GradientButton>Start Growing 🌱</GradientButton>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button 
  onClick={() => setMobileOpen(true)} 
  aria-label="Open navigation menu"
  className="lg:hidden text-slate-700 p-2">
  <Menu size={24} />
</button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl z-50 lg:hidden flex flex-col"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <span className="text-2xl">🌸</span>
                  <span className="font-heading font-bold text-slate-900">BloomLab</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="text-slate-500 p-1">
                  <X size={24} />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 px-6 py-8 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-slate-700 hover:text-violet-600 transition py-2">
                    {item.label}
                  </Link>
                ))}

                {/* Resources */}
                <div>
                  <button onClick={() => setResourcesOpen(!resourcesOpen)}
                    className="flex items-center justify-between w-full text-lg font-medium text-slate-700 hover:text-violet-600 transition py-2">
                    Resources <ChevronDown size={18} className={resourcesOpen ? "rotate-180 transition" : "transition"} />
                  </button>
                  {resourcesOpen && (
                    <div className="ml-4 mt-2 flex flex-col gap-1 border-l-2 border-violet-200 pl-4">
                      <Link href="/assignments" onClick={() => setMobileOpen(false)} className="text-sm text-slate-600 hover:text-violet-600 py-1.5">📋 Assignments</Link>
                      <Link href="/playground" onClick={() => setMobileOpen(false)} className="text-sm text-slate-600 hover:text-violet-600 py-1.5">🧩 Playground</Link>
                      <Link href="/health" onClick={() => setMobileOpen(false)} className="text-sm text-slate-600 hover:text-violet-600 py-1.5">❤️ Health Check</Link>
                      <Link href="/chat" onClick={() => setMobileOpen(false)} className="text-sm text-slate-600 hover:text-violet-600 py-1.5">💬 AI Chat</Link>
                      <Link href="/notes" onClick={() => setMobileOpen(false)} className="text-sm text-slate-600 hover:text-violet-600 py-1.5">📝 Notes</Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="px-6 py-6 border-t border-slate-100 flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="w-full text-center rounded-full border border-slate-200 bg-white py-3 font-medium text-slate-700 hover:bg-slate-50 transition">
                  Log In
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="w-full">
                  <GradientButton>Start Growing 🌱</GradientButton>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}