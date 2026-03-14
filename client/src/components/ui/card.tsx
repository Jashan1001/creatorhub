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
      bg-(--bg-surface) border rounded-lg p-6
      ${accent ? "border-(--accent-border) shadow-(--shadow-accent)" : "border-(--border)"}
      ${hover ? "transition-all duration-(--transition) hover:border-(--border-strong) hover:bg-(--bg-elevated)" : ""}
      ${className}
    `}
  >
    {children}
  </div>
);

