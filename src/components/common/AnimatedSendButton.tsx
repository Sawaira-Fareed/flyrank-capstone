"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Check, RotateCcw, AlertCircle } from "lucide-react";

type ButtonState = "idle" | "loading" | "success" | "error";

interface AnimatedSendButtonProps {
  onSend: () => Promise<boolean>; // Returns true if success, false if error
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { button: "p-2", icon: 16 },
  md: { button: "p-2.5", icon: 18 },
  lg: { button: "p-3", icon: 20 },
};

export default function AnimatedSendButton({ onSend, disabled = false, size = "md" }: AnimatedSendButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");
  const [isHovered, setIsHovered] = useState(false);

  const sizes = sizeMap[size];

  const handleClick = async () => {
    if (state === "loading" || disabled) return;

    // Shake on error before retry
    if (state === "error") {
      setState("loading");
      const result = await onSend();
      setState(result ? "success" : "error");
      return;
    }

    setState("loading");
    const result = await onSend();

    if (result) {
      setState("success");
      // Return to idle after checkmark
      setTimeout(() => setState("idle"), 1200);
    } else {
      setState("error");
    }
  };

  const buttonVariants = {
    idle: {
      scale: isHovered ? 1.08 : 1,
      boxShadow: isHovered 
        ? "0 0 20px rgba(139,92,246,0.5)" 
        : "0 2px 8px rgba(139,92,246,0.2)",
    },
    loading: { scale: 0.95 },
    success: { scale: 1 },
    error: { scale: 1 },
  };

  return (
    <motion.button
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      variants={buttonVariants}
      animate={state === "error" ? { x: [0, -8, 8, -8, 8, 0], transition: { duration: 0.4 } } : state}
      whileTap={{ scale: 0.9 }}
      disabled={disabled}
      className={`relative overflow-hidden rounded-full ${sizes.button} transition-colors duration-300 ${
        state === "error" 
          ? "bg-red-400 hover:bg-red-500" 
          : "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777]"
      } text-white`}
      style={{ width: "auto", minWidth: "40px" }}
    >
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <Send size={sizes.icon} />
          </motion.span>
        )}

        {state === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <Loader2 size={sizes.icon} className="animate-spin" />
          </motion.span>
        )}

        {state === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ type: "spring", damping: 12, stiffness: 300 }}
            className="flex items-center justify-center"
          >
            <Check size={sizes.icon} />
          </motion.span>
        )}

        {state === "error" && (
          <motion.span
            key="error"
            initial={{ opacity: 0, rotate: -30 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center gap-1"
          >
            <RotateCcw size={sizes.icon} />
            <span className="text-xs font-semibold">Retry</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}