import type { CSSProperties, ReactNode } from "react";

interface IconContainerProps {
  children: ReactNode;
  variant?: "default" | "accent" | "muted";
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
}

const variants = {
  default: "bg-[var(--bg-elevated)] text-[var(--text-muted)]",
  accent: "bg-[var(--accent-muted)] text-[var(--accent)]",
  muted: "bg-[var(--border-subtle)] text-[var(--text-secondary)]",
};

const sizes = {
  sm: "w-7 h-7 rounded-[var(--radius-sm)]",
  md: "w-9 h-9 rounded-[var(--radius-sm)]",
  lg: "w-11 h-11 rounded-[var(--radius-md)]",
};

export const IconContainer = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  style,
}: IconContainerProps) => (
  <div
    style={style}
    className={`inline-flex items-center justify-center shrink-0 ${sizes[size]} ${variants[variant]} ${className}`}
  >
    {children}
  </div>
);
