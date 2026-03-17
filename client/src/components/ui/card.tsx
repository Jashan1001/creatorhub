import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  accent?: boolean;
}

export const Card = ({ children, className = "", hover = false, accent = false }: CardProps) => (
  <div
    className={`
      bg-[var(--bg-surface)] border-[1.5px] rounded-lg p-6 shadow-[var(--shadow-sm)]
      ${accent ? "border-[var(--accent-border)] shadow-[var(--shadow-accent)]" : "border-[var(--border)]"}
      ${hover ? "transition-all duration-150 hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] hover:-translate-y-px" : ""}
      ${className}
    `}
  >
    {children}
  </div>
);

