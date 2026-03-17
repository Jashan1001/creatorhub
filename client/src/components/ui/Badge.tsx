interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "accent";
}

const badgeVariants = {
  default: "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border)]",
  success: "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30",
  warning: "bg-amber-600/12 text-amber-800 border-amber-700/30",
  danger:  "bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/30",
  accent:  "bg-[var(--accent-muted)] text-[var(--accent)] border-[var(--accent-border)]",
};

export const Badge = ({ children, variant = "default" }: BadgeProps) => (
  <span className={`
    inline-flex items-center px-2 py-0.5 text-xs font-medium
    border-[1.5px] rounded-full
    ${badgeVariants[variant]}
  `}>
    {children}
  </span>
);

