"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import GradientButton from "@/components/common/GradientButton";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Projects", href: "#projects" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

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
        className={`
          flex items-center justify-between
          px-16 py-5
          transition-all duration-500

          ${
            scrolled
              ? "bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-lg"
              : "bg-transparent"
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="text-4xl">🌸</span>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              BloomLab
            </h1>

            <p className="text-xs text-slate-500">
              Learning grows naturally
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-medium text-slate-700 hover:text-violet-600 transition"
            >
              {item.label}
            </Link>
          ))}

          <button className="flex items-center gap-1 font-medium text-slate-700 hover:text-violet-600">
            Resources
            <ChevronDown size={16} />
          </button>
        </nav>

        <div className="flex items-center gap-5">
          <button className="font-medium text-slate-700 hover:text-violet-600">
            Log In
          </button>

          <GradientButton>
            Start Growing 🌱
          </GradientButton>
        </div>
      </div>
    </motion.header>
  );
}