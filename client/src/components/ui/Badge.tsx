interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "accent";
}

const badgeVariants = {
  default: "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border)]",
  success: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger:  "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20",
  accent:  "bg-[var(--accent-muted)] text-[var(--accent)] border-[var(--accent-border)]",
};

export const Badge = ({ children, variant = "default" }: BadgeProps) => (
  <span className={`
    inline-flex items-center px-2 py-0.5 text-xs font-medium
    border rounded-full
    ${badgeVariants[variant]}
  `}>
    {children}
  </span>
);
