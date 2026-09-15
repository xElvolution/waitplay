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
    "bg-violet-500 text-white shadow-[0_0_0_1px_rgba(167,139,250,0.35),0_12px_40px_rgba(139,92,246,0.35)] hover:bg-violet-400",
  secondary:
    "bg-white/[0.04] text-zinc-100 border border-white/10 hover:bg-white/[0.07] hover:border-white/16",
  ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/[0.04]",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
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
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
