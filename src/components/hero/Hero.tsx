"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import GradientButton from "@/components/common/GradientButton";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-white to-pink-50" />

      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-300/20 blur-[140px]" />
      <div className="absolute top-40 right-0 h-[500px] w-[500px] rounded-full bg-sky-300/20 blur-[160px]" />
      <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-pink-300/20 blur-[140px]" />

      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-8 pt-28 pb-20 lg:px-12">
        <div className="grid w-full items-center gap-20 lg:grid-cols-2">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
          >
            <span className="inline-flex rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">
              🌸 Learning grows naturally
            </span>

            <h1 className="mt-8 text-6xl font-bold leading-[1.05] text-slate-900">
              Let's grow something{" "}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                amazing
              </span>{" "}
              today.
            </h1>

            <p className="mt-8 max-w-xl text-xl leading-9 text-slate-600">
              Learn to code by building real projects.
              <br />
              Just 15 minutes a day.
              <br />
              With Elsa, your AI mentor.
            </p>

            <div className="mt-10 flex gap-5">
              <Link href="/signup">
              <GradientButton>
                Start Growing 🌱
              </GradientButton>
              </Link>

              <button className="rounded-full border border-slate-200 bg-white/80 px-7 py-3.5 font-medium backdrop-blur transition hover:bg-white">
                ▶ Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-4">

              <div className="flex -space-x-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-300 text-white font-bold">
                  A
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-300 text-white font-bold">
                  E
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-300 text-white font-bold">
                  S
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  ⭐⭐⭐⭐⭐ 4.9/5
                </p>

                <p className="text-sm text-slate-500">
                  Trusted by 15,000+ learners
                </p>
              </div>

            </div>

          </motion.div>

    {/* RIGHT */}

<motion.div
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  className="relative flex items-center justify-center overflow-visible"
>
  {/* Background Glow */}
  <div className="absolute h-[700px] w-[700px] rounded-full bg-gradient-to-br from-violet-300/20 via-pink-300/20 to-sky-300/20 blur-[140px]" />

  <div className="absolute left-12 top-20 h-28 w-28 rounded-full bg-pink-200/40 blur-3xl" />
  <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />

  {/* Floating Decorations */}

  <motion.div
    animate={{ y: [-8, 10, -8], rotate: [-8, 8, -8] }}
    transition={{ repeat: Infinity, duration: 6 }}
    className="absolute left-4 top-10 z-20 text-4xl"
  >
    🌸
  </motion.div>

  <motion.div
    animate={{ y: [10, -10, 10] }}
    transition={{ repeat: Infinity, duration: 5 }}
    className="absolute right-5 top-24 z-20 text-3xl"
  >
    ✨
  </motion.div>

  <motion.div
    animate={{ y: [-10, 10, -10] }}
    transition={{ repeat: Infinity, duration: 7 }}
    className="absolute bottom-8 left-10 z-20 text-3xl"
  >
    🍃
  </motion.div>

  {/* Speech Bubble */}

<motion.div
  animate={{ y: [-6, 6, -6] }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="
    absolute
    top-24
    right-[-50px]
    z-50
    max-w-[280px]
    rounded-[28px]
    border
    border-white/70
    bg-white/80
    px-6
    py-5
    backdrop-blur-xl
    shadow-[0_20px_60px_rgba(167,139,250,0.18)]
  "
>
  {/* Tail pointing to Elsa */}
  <div
    className="
      absolute
      -left-2
      top-10
      h-5
      w-5
      rotate-45
      border-l
      border-b
      border-white/70
      bg-white/80
    "
  />

  <p className="text-sm font-semibold text-violet-600">
    👋 Hi, Elsa here 
  </p>
 
 
</motion.div>

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
    <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-violet-300/20 via-pink-300/20 to-sky-300/20 blur-3xl" />
    <Image
      src="/elsa.png"
      alt="Elsa AI Mentor"
      width={500}
      height={650}
      priority
      className="
        select-none
        object-contain
        drop-shadow-[0_40px_80px_rgba(167,139,250,0.35)]
      "
    />
  </motion.div>

  {/* Floating Badge */}

  <motion.div
    animate={{ y: [6, -6, 6] }}
    transition={{
      duration: 3,
      repeat: Infinity,
    }}
    className="
      absolute
      bottom-16
      right-0
      z-30
      rounded-full
      bg-gradient-to-r
      from-violet-500
      to-pink-500
      px-5
      py-3
      text-sm
      font-semibold
      text-white
      shadow-xl
    "
  >
    🌸 Your AI Mentor
  </motion.div>
</motion.div>
         

        </div>
      </div>
    </section>
  );
}