import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary:   "bg-accent text-[var(--text-inverse)] hover:bg-[var(--accent-hover)] font-medium",
  secondary: "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-strong)] hover:bg-[var(--bg-hover)]",
  ghost:     "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]",
  danger:    "bg-[var(--danger)] text-white hover:opacity-90",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-[var(--radius-sm)]",
  md: "px-4 py-2 text-sm rounded-[var(--radius-md)]",
  lg: "px-6 py-3 text-base rounded-[var(--radius-lg)]",
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
        transition-all duration-[var(--transition)]
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
