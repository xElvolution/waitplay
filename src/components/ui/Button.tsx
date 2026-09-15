"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void | Promise<void>;
};

const variants = {
  primary:
    "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 text-zinc-950 shadow-[0_0_32px_rgba(168,85,247,0.35)] hover:brightness-110",
  secondary:
    "bg-white/5 text-zinc-100 border border-white/10 hover:bg-white/10 hover:border-white/20",
  ghost: "bg-transparent text-zinc-300 hover:text-white hover:bg-white/5",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  type = "button",
  onClick,
}: Props) {
  return (
    <motion.button
      type={type}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
