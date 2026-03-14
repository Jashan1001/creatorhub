interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "accent";
}

const badgeVariants = {
  default: "bg-(--bg-elevated) text-(--text-secondary) border-(--border)",
  success: "bg-(--success)/10 text-(--success) border-(--success)/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger:  "bg-(--danger)/10 text-(--danger) border-(--danger)/20",
  accent:  "bg-(--accent-muted) text-(--accent) border-(--accent-border)",
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

