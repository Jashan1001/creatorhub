import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary:   "bg-accent text-(--text-inverse) hover:bg-(--accent-hover) font-medium shadow-(--shadow-accent) hover:shadow-(--shadow-accent-lg)",
  secondary: "bg-(--bg-elevated) text-(--text-primary) border border-(--border-strong) hover:bg-(--bg-hover) hover:border-(--border-strong)",
  ghost:     "bg-transparent text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-elevated)",
  danger:    "bg-(--danger-muted) text-(--danger) border border-(--danger)/20 hover:bg-(--danger) hover:text-white",
};

const sizes = {
  sm:   "px-3 py-1.5 text-sm rounded-(--radius-sm) gap-1.5",
  md:   "px-4 py-2 text-sm rounded-(--radius-md) gap-2",
  lg:   "px-6 py-3 text-base rounded-(--radius-lg) gap-2",
  icon: "p-2 rounded-(--radius-md)",
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
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className={`
        inline-flex items-center justify-center
        transition-all duration-(--transition)
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        select-none whitespace-nowrap
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...(props as object)}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </motion.button>
  );
};