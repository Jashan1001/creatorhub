import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary:   "bg-accent text-(--text-inverse) hover:bg-(--accent-hover) font-medium",
  secondary: "bg-(--bg-elevated) text-(--text-primary) border border-(--border-strong) hover:bg-(--bg-hover)",
  ghost:     "bg-transparent text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-elevated)",
  danger:    "bg-(--danger) text-white hover:opacity-90",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-(--radius-sm)",
  md: "px-4 py-2 text-sm rounded-(--radius-md)",
  lg: "px-6 py-3 text-base rounded-(--radius-lg)",
};

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-(--transition)
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...(props as object)}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  );
};

