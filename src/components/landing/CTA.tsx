"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-white to-pink-50" />
      <div className="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-violet-200/30 blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-pink-200/30 blur-[100px]" />

      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute left-4 lg:left-10 top-20 text-2xl lg:text-3xl"
      >
        🌸
      </motion.div>
      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute right-4 lg:right-10 bottom-20 text-2xl lg:text-3xl"
      >
        ✨
      </motion.div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* CTA Image */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/cta.png"
              alt="Start Growing with BloomLab"
              width={200}
              height={200}
              className="w-40 lg:w-52 h-auto"
            />
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
            Ready to{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              grow
            </span>
            ?
          </h2>

          <p className="mt-4 text-base lg:text-lg text-slate-500">
            Start your project today. Free forever.
          </p>

          <div className="mt-8 lg:mt-10">
            <div className="flex items-center rounded-full border border-white/50 bg-white/80 px-2 py-2 backdrop-blur-xl shadow-lg max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent px-4 text-sm lg:text-base text-slate-700 outline-none placeholder:text-slate-400"
              />
              <Link
                href="/garden"
                className="rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-5 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base font-semibold text-white shadow-lg transition hover:scale-105 whitespace-nowrap"
              >
                Get Started →
              </Link>
            </div>
          </div>

          <p className="mt-4 text-xs lg:text-sm text-slate-400">No credit card required.</p>
        </motion.div>
      </div>
    </section>
  );
}