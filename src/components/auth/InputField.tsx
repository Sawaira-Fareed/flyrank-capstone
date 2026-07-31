"use client";

import { FieldError } from "react-hook-form";
import { motion } from "framer-motion";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  registration: any;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  error,
  registration,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <motion.input
        whileFocus={{ scale: 1.015 }}
        transition={{ duration: 0.15 }}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`
          w-full
          rounded-2xl
          border
          bg-white/70
          backdrop-blur-xl
          px-5
          py-3.5
          text-sm
          text-slate-700
          outline-none
          transition-all
          duration-200
          placeholder:text-slate-400

          ${
            error
              ? "border-red-400 focus:ring-4 focus:ring-red-200"
              : "border-slate-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
          }
        `}
      />

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