"use client";

import { motion } from "framer-motion";
import Image from "next/image";

function AuroraSeparator() {
  return (
    <div className="relative w-full h-8 my-3 overflow-hidden">
      <svg
        viewBox="0 0 400 32"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="20%" stopColor="#f9a8d4" />
            <stop offset="40%" stopColor="#fde68a" />
            <stop offset="60%" stopColor="#67e8f9" />
            <stop offset="80%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          animate={{ d: [
            "M0,16 Q50,4 100,14 T200,18 T300,12 T400,16 L400,32 L0,32 Z",
            "M0,14 Q50,20 100,10 T200,16 T300,20 T400,14 L400,32 L0,32 Z",
            "M0,18 Q50,8 100,16 T200,14 T300,18 T400,16 L400,32 L0,32 Z",
            "M0,16 Q50,4 100,14 T200,18 T300,12 T400,16 L400,32 L0,32 Z",
          ]}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          fill="url(#aurora1)"
          opacity="0.5"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
}

export default function GlimpseInside() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Galaxy Rainbow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-fuchsia-50 via-pink-50 via-cyan-50 via-mint-50 to-amber-50" />
      
      {/* Large galaxy blobs */}
      <div className="absolute top-0 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-300/30 via-fuchsia-300/20 to-transparent blur-[120px]" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-cyan-300/30 via-mint-300/20 to-transparent blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] rounded-full bg-gradient-to-br from-pink-300/30 via-amber-200/20 to-transparent blur-[140px]" />
      <div className="absolute top-1/2 left-0 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-sky-300/25 via-violet-300/20 to-transparent blur-[100px]" />

          {/* Floating stars - outer edges only */}
      {[
        "top-10 left-[2%] text-lg",
        "top-32 right-[2%] text-sm",
        "bottom-40 left-[3%] text-base",
        "bottom-10 right-[3%] text-lg",
        "top-1/2 left-[1%] text-sm",
        "top-1/2 right-[1%] text-base",
        "top-[20%] right-[4%] text-xs",
        "bottom-[30%] left-[4%] text-base",
        "top-[60%] right-[3%] text-lg",
        "bottom-[10%] left-[2%] text-sm",
      ].map((pos, i) => (
        <motion.div
          key={`star-${i}`}
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.4 }}
          className={`absolute ${pos} z-0`}
        >
          ✨
        </motion.div>
      ))}

      {/* Floating flowers - outer edges */}
      {[
        "top-[5%] left-[6%] text-xl",
        "top-[35%] right-[5%] text-lg",
        "bottom-[20%] left-[5%] text-base",
        "bottom-[5%] right-[6%] text-xl",
        "top-[55%] left-[3%] text-lg",
      ].map((pos, i) => (
        <motion.div
          key={`flower-${i}`}
          animate={{ y: [-4, 5, -4], rotate: [0, 10, -8, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 5 + (i % 2), repeat: Infinity, delay: i * 0.6 }}
          className={`absolute ${pos} z-0`}
        >
          🌸
        </motion.div>
      ))}

      {/* Floating hearts - outer edges */}
      {[
        "top-[18%] right-[8%] text-lg",
        "top-[70%] left-[7%] text-xl",
        "bottom-[15%] right-[7%] text-base",
        "top-[45%] right-[3%] text-lg",
        "bottom-[35%] left-[2%] text-xl",
      ].map((pos, i) => (
        <motion.div
          key={`heart-${i}`}
          animate={{ y: [3, -5, 3], rotate: [0, -8, 6, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 5.5 + (i % 2), repeat: Infinity, delay: i * 0.5 }}
          className={`absolute ${pos} z-0`}
        >
          💖
        </motion.div>
      ))}
      <div className="mx-auto max-w-6xl px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-slate-900">
        
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              A Glimpse Inside
            </span>
          </h2>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Card 1: Skill Map */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[32px] bg-white/80 backdrop-blur-xl shadow-2xl text-center flex flex-col p-[3px]"
          >
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-violet-300 via-fuchsia-300 via-pink-300 via-cyan-300 via-mint-300 to-amber-200 opacity-70" />
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-50" />
            <div className="absolute inset-[3px] rounded-[29px] bg-white/90" />

            <div className="relative z-10 rounded-[29px] p-5 flex flex-col">
              <div className="flex justify-start mb-3">
                <span className="inline-block rounded-full bg-gradient-to-r from-violet-100 to-pink-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  Your Skill Map
                </span>
              </div>
<div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-violet-300/20 via-pink-300/20 to-sky-300/20 blur-3xl" />
              <Image
                src="/skillmap.png"
                alt="Skill Map"
                width={400}
                height={200}
                className="w-4/5 mx-auto h-auto object-contain rounded-2xl"
              />

              <AuroraSeparator />

              <h3 className="mt-1 text-lg font-bold text-slate-900">
                Your personalized learning path.
              </h3>
              <p className="mt-1 text-sm text-slate-500 leading-6">
                We create a custom roadmap for your project
                <br />
                and guide you lesson by lesson.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Elsa Guide */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[32px] bg-white/80 backdrop-blur-xl shadow-2xl text-center flex flex-col p-[3px]"
          >
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-sky-300 via-violet-300 via-pink-300 via-peach-300 to-mint-300 opacity-70" />
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tl from-transparent via-white/40 to-transparent opacity-50" />
            <div className="absolute inset-[3px] rounded-[29px] bg-white/90" />

            <div className="relative z-10 rounded-[29px] p-5 flex flex-col">
              <div className="flex justify-start mb-3">
                <span className="inline-block rounded-full bg-gradient-to-r from-pink-100 to-rose-100 px-3 py-1 text-xs font-semibold text-pink-700">
                  Today's Lesson with Elsa
                </span>
              </div>
<div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-violet-300/20 via-pink-300/20 to-sky-300/20 blur-3xl" />
              <Image
                src="/guide.png"
                alt="Elsa guiding a lesson"
                width={400}
                height={200}
                className="w-4/5 mx-auto h-auto object-contain rounded-2xl"
              />

              <AuroraSeparator />

              <h3 className="mt-1 text-lg font-bold text-slate-900">
                Elsa guides every step.
              </h3>
              <p className="mt-1 text-sm text-slate-500 leading-6">
                Your AI mentor explains, encourages,
                <br />
                and celebrates your progress.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}