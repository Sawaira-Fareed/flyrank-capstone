import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function GradientButton({
  children,
  className,
  ...props
}: GradientButtonProps) {
  return (
    <button
      className={cn(
        "group relative overflow-hidden",
        "rounded-full",
        "px-7 py-3.5",
        "font-semibold",
        "text-white",
        "transition-all duration-300",
        "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500",
        "shadow-[0_10px_30px_rgba(168,85,247,0.35)]",
        "hover:scale-105",
        "hover:shadow-[0_14px_40px_rgba(168,85,247,0.5)]",
        "active:scale-95",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>

      <div
        className="
          absolute inset-0
          bg-white/20
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />
    </button>
  );
}