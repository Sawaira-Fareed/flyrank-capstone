"use client";

import { useState } from "react";
import { FieldError } from "react-hook-form";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

interface PasswordInputProps {
  label: string;
  placeholder?: string;
  error?: FieldError;
  registration: any;
}

export default function PasswordInput({
  label,
  placeholder,
  error,
  registration,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">

      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <motion.div
        whileFocus={{ scale: 1.015 }}
        className={`
          flex
          items-center
          rounded-2xl
          border
          bg-white/70
          backdrop-blur-xl
          px-5
          py-3.5
          transition-all
          duration-200

          ${
            error
              ? "border-red-400 focus-within:ring-4 focus-within:ring-red-200"
              : "border-slate-200 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-200"
          }
        `}
      >

        {/* Lock Icon */}

        <FiLock className="mr-3 text-slate-400" />

        {/* Password */}

        <input
          {...registration}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="
            flex-1
            bg-transparent
            text-sm
            text-slate-700
            outline-none
            placeholder:text-slate-400
          "
        />

        {/* Eye Button */}

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="
            ml-3
            rounded-full
            p-1
            text-slate-400
            transition
            hover:bg-violet-100
            hover:text-violet-600
          "
        >
          {showPassword ? (
            <FiEyeOff size={18} />
          ) : (
            <FiEye size={18} />
          )}
        </button>

      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium text-red-500"
        >
          {error.message}
        </motion.p>
      )}

    </div>
  );
}