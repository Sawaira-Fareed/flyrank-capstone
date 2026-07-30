"use client";

import { motion } from "framer-motion";
import { Sparkles, Clock, Target, Trophy, Zap, Heart } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Mentor Elsa",
    text: "Your personal guide who explains concepts, reviews your code, and celebrates every win.",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: Clock,
    title: "15-Minute Lessons",
    text: "Bite-sized daily lessons that fit into your busy life. Learn consistently without burnout.",
    color: "from-sky-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Project-Based Learning",
    text: "You pick what to build. We create the roadmap. Learn by making real things, not watching tutorials.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Trophy,
    title: "Earn Achievements",
    text: "Unlock badges, build streaks, and watch your garden grow as you complete lessons.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Zap,
    title: "Track Your Progress",
    text: "Beautiful dashboards show your skills growing. See how far you've come every day.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Heart,
    title: "Built With Care",
    text: "Designed to feel like a magical garden, not a classroom. Learning should be joyful.",
    color: "from-rose-500 to-pink-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-50/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
         <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
  <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
   Why BloomLab
  </span>
</h2>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-slate-900">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              grow.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Learning to code shouldn't feel like a chore. We've designed every
            part of BloomLab to make your journey joyful, effective, and
            beautiful.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-white/50 bg-white/60 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-md`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-6">
                  {feature.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}