"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ElsaPanel() {
  return (
    <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50 p-12">

      {/* Background Glow */}

      <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-violet-300/20 blur-[100px]" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-pink-300/20 blur-[120px]" />

      <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/10 blur-[120px]" />

      {/* Floating Decorations */}

      {[
        {
          emoji: "🌸",
          className: "top-10 left-10",
          duration: 6,
        },
        {
          emoji: "✨",
          className: "top-24 right-16",
          duration: 5,
        },
        {
          emoji: "🍃",
          className: "bottom-24 left-16",
          duration: 7,
        },
        {
          emoji: "🌸",
          className: "bottom-12 right-12",
          duration: 6,
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          animate={{
            y: [-8, 8, -8],
            rotate: [-8, 8, -8],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
          }}
          className={`absolute text-3xl ${item.className}`}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Logo */}

      <Link
        href="/"
        className="absolute left-10 top-10 flex items-center gap-3"
      >
        <span className="text-4xl">🌸</span>

        <span className="font-heading text-2xl font-bold text-slate-800">
          BloomLab
        </span>
      </Link>

      {/* Elsa */}

      <motion.div
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10"
      >
        <Image
          src="/elsa-auth.png"
          alt="Elsa"
          width={360}
          height={520}
          priority
          className="object-contain drop-shadow-[0_35px_60px_rgba(167,139,250,.25)]"
        />
      </motion.div>

      {/* Speech Bubble */}

      <motion.div
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="
          absolute
          right-12
          top-28
          rounded-3xl
          border
          border-white/70
          bg-white/80
          px-6
          py-5
          backdrop-blur-xl
          shadow-xl
        "
      >
        <p className="text-sm text-violet-600 font-semibold">
          👋 Hi, I'm Elsa
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Ready to build your next project?
        </p>

        <div
          className="
            absolute
            -left-2
            top-10
            h-4
            w-4
            rotate-45
            border-b
            border-l
            border-white/70
            bg-white
          "
        />
      </motion.div>

      {/* Bottom Text */}

      <h2 className="mt-8 text-3xl font-bold text-slate-900">
        Grow Every Day 🌱
      </h2>

      <p className="mt-3 max-w-sm text-center leading-7 text-slate-500">
        Learn by building real-world projects with your AI mentor guiding you
        every step of the way.
      </p>

      {/* Badges */}

      <div className="mt-8 flex flex-wrap justify-center gap-3">

        <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium shadow">
          🔥 7 Day Streak
        </div>

        <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium shadow">
          🌱 AI Guided
        </div>

        <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium shadow">
          ⭐ 15k Learners
        </div>

      </div>
    </div>
  );
}