"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface BadgePopupProps {
  badge: {
    badge_name: string;
    badge_icon: string;
    badge_description: string;
    xp_reward: number;
  } | null;
  onClose: () => void;
}

const badgeImageMap: Record<string, string> = {
  "First Step 🌱": "/first_step.png",
  "Code Gardener 🌿": "/code_gardener.png",
  "Knowledge Seeker 📚": "/knowledge_seeker.png",
  "Scholar Owl 🦉": "/scholar_owl.png",
  "Perfect Score ⭐": "/perfect_score.png",
  "Precision Master 🎯": "/precision_master.png",
  "Project Starter 🚀": "/project_starter.png",
  "Builder 🏗️": "/builder.png",
  "Project Master 🏆": "/project_master.png",
  "Ship It! 🚢": "/ship_it.png",
  "Triple Threat 🔥": "/triple_threat.png",
  "Consistent 🌟": "/consistent.png",
  "Weekly Warrior 🔥": "/weekly_warrior.png",
  "Monthly Master 👑": "/monthly_master.png",
};

const sparkles = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 4 + Math.random() * 8,
  delay: Math.random() * 0.5,
  duration: 1.5 + Math.random() * 2,
}));

export default function BadgePopup({ badge, onClose }: BadgePopupProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopSound = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}
    }
  };

  const handleClose = () => {
    stopSound();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onClose();
  };

  useEffect(() => {
    if (badge) {
      // Play sound
      try {
        audioRef.current = new Audio("/badge-earned.mp3");
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(() => {});
      } catch {}

      // Auto-dismiss after 5 seconds
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, 5000);
    }

    return () => {
      // Cleanup on unmount only — don't clear timer here
      stopSound();
    };
  }, [badge]);

  const badgeImage = badge ? badgeImageMap[badge.badge_name] || "/first_step.png" : null;

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
        >
          {/* Sparkles */}
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: [0, (s.x - 50) * 2], y: [0, (s.y - 50) * 2] }}
              transition={{ delay: s.delay, duration: s.duration, repeat: Infinity }}
              className="absolute rounded-full bg-yellow-300/80"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            />
          ))}

          {/* Badge Card */}
          <motion.div
            initial={{ scale: 0, rotateY: 90 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: -90 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gradient-to-b from-[#FFFBF5] to-[#F3EEFA] rounded-3xl p-8 text-center max-w-sm w-full mx-4 border-4 border-[#C4B5FD]/40 shadow-2xl cursor-default"
            style={{ boxShadow: "0 0 80px rgba(139,92,246,0.4)" }}
          >
            {badgeImage && (
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", damping: 10 }}
                className="w-40 h-40 mx-auto mb-4 relative"
              >
                <Image
                  src={badgeImage}
                  alt={badge.badge_name}
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </motion.div>
            )}

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="font-heading text-2xl font-bold text-[#312E81] mb-2"
            >
              🏆 Badge Earned!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-[#6B7280] mb-1"
            >
              {badge.badge_description}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-sm font-semibold text-[#8B5CF6]"
            >
              +{badge.xp_reward} XP
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-xs text-[#6B7280]/60 mt-4"
            >
              Click anywhere to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}