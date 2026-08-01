"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const cards = [
  {
    image: "/card1.png",
    title: "Pick a Project",
    text: "Tell BloomLab what you want to build. A portfolio, weather app, blog or even your own AI.",
  },
  {
    image: "/card2.png",
    title: "Meet Elsa",
    text: "Elsa breaks your project into bite-sized lessons and guides you step by step.",
  },
  {
    image: "/card3.png",
    title: "Watch it Bloom",
    text: "Complete lessons, earn streaks and grow your coding garden every day.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 scroll-mt-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-violet-50/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-8">
    <motion.div
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="text-center"
>
  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
    <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
      How it works
    </span>
  </h2>
  <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
    Every project becomes your classroom. Elsa turns overwhelming ideas
    into small, enjoyable lessons.
  </p>
</motion.div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group rounded-[32px] border border-white/70 bg-white/70 p-8 backdrop-blur-xl shadow-xl transition-all text-center flex flex-col items-center"
            >
                <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-violet-300/20 via-pink-300/20 to-sky-300/20 blur-3xl" />
              <Image
                src={card.image}
                alt={card.title}
                width={160}
                height={160}
                className="h-[160px] w-[160px] object-contain"
              />
              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-4 leading-8 text-slate-500 flex-1">{card.text}</p>
              <div className="mt-8 mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all group-hover:w-28" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}