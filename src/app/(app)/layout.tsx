"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/garden", label: "My Garden", icon: "🏠" },
  { href: "/projects", label: "Projects", icon: "📁" },
  { href: "/path", label: "Skill Map", icon: "🗺️" },
  { href: "/learn", label: "Learn", icon: "📖" },
  { href: "/dashboard", label: "Progress", icon: "📊" },
  { href: "/archive", label: "Archive", icon: "📚" },
  { href: "/notes", label: "Notes", icon: "📝" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
  { href: "/profile", label: "Profile", icon: "👤" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{
      backgroundImage: "url('/auth-back.png')",
      backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed",
    }}>
      <div className="absolute inset-0 bg-white/50 pointer-events-none" />

      {/* DESKTOP Sidebar */}
      <aside className="relative z-20 hidden lg:flex w-60 flex-col border-r border-white/30 bg-white/15 backdrop-blur-xl p-4 shrink-0">
        <Link href="/garden" className="flex items-center gap-2 mb-8 mt-2">
          <span className="text-2xl">🌸</span>
          <span className="font-heading text-lg font-bold text-[#312E81]">BloomLab</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  isActive ? "bg-white/40 text-[#7C3AED] font-semibold shadow-sm" : "text-[#6B7280] hover:bg-white/20"
                }`}>
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/25 mt-auto">
          <Image src="/idle.png" alt="Elsa" width={32} height={40} className="object-contain" />
          <div><p className="text-xs font-semibold text-[#312E81]">Elsa</p><p className="text-[10px] text-[#6B7280]">AI Mentor</p></div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 ml-auto" />
        </div>
      </aside>

      {/* MOBILE Header + Content */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="flex items-center justify-between px-3 lg:px-8 py-2.5 lg:py-3 border-b border-white/20 bg-white/10 backdrop-blur-xl lg:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 rounded-lg hover:bg-white/20">
            <Menu size={22} className="text-[#312E81]" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <span className="font-heading font-bold text-[#312E81]">BloomLab</span>
          </div>
          <Link href="/profile" className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-white/40">
            <Image src="/idle.png" alt="Profile" fill className="object-cover" />
          </Link>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden lg:flex items-center justify-end gap-3 px-4 lg:px-8 py-3 border-b border-white/20 bg-white/10 backdrop-blur-xl">
          <Link href="/notifications" className="relative p-2 rounded-full hover:bg-white/20 transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B7280]">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </Link>
          <Link href="/profile" className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/40">
            <Image src="/idle.png" alt="Profile" fill className="object-cover" />
          </Link>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex-1 overflow-y-auto bg-white/10 backdrop-blur-sm">
          {children}
        </main>
      </div>

           {/* MOBILE Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 lg:hidden"
              style={{
                backgroundImage: "url('/auth-back.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 0 60px rgba(139,92,246,0.15)",
              }}>
              {/* Frosted overlay */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xl" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/30">
                  <Link href="/garden" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                    <span className="text-2xl">🌸</span>
                    <span className="font-heading text-lg font-bold text-[#312E81]">BloomLab</span>
                  </Link>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-white/30">
                    <X size={22} className="text-[#312E81]" />
                  </button>
                </div>
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${
                          isActive ? "bg-white/50 text-[#7C3AED] font-semibold" : "text-[#6B7280] hover:bg-white/20"
                        }`}>
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="px-3 py-4 border-t border-white/30">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/30">
                    <Image src="/idle.png" alt="Elsa" width={36} height={44} className="object-contain" />
                    <div><p className="text-sm font-semibold text-[#312E81]">Elsa</p><p className="text-xs text-[#6B7280]">AI Mentor</p></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}