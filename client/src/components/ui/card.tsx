import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  accent?: boolean;
}

export const Card = ({ children, className = "", hover = false, accent = false }: CardProps) => (
  <div
    className={`
      bg-[var(--bg-surface)] border rounded-[var(--radius-lg)] p-6
      ${accent ? "border-[var(--accent-border)] shadow-[var(--shadow-accent)]" : "border-[var(--border)]"}
      ${hover ? "transition-all duration-[var(--transition)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]" : ""}
      ${className}
    `}
  >
    {children}
  </div>
);
