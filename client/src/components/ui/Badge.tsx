interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "accent" | "info";
  dot?: boolean;
  pulse?: boolean;
}

const badgeVariants = {
  default: "bg-(--bg-elevated) text-(--text-secondary) border-(--border)",
  success: "bg-(--success-muted) text-(--success) border-(--success)/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger:  "bg-(--danger-muted) text-(--danger) border-(--danger)/20",
  accent:  "bg-(--accent-muted) text-(--accent) border-(--accent-border)",
  info:    "bg-(--info-muted) text-(--info) border-(--info)/20",
};

const dotColors = {
  default: "bg-(--text-muted)",
  success: "bg-(--success)",
  warning: "bg-amber-400",
  danger:  "bg-(--danger)",
  accent:  "bg-(--accent)",
  info:    "bg-(--info)",
};

export const Badge = ({ children, variant = "default", dot = false, pulse = false }: BadgeProps) => (
  <span className={`
    inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium
    border rounded-full
    ${badgeVariants[variant]}
  `}>
    {dot && (
      <span className={`
        w-1.5 h-1.5 rounded-full shrink-0
        ${dotColors[variant]}
        ${pulse ? "animate-pulse-dot" : ""}
      `} />
    )}
    {children}
  </span>
);