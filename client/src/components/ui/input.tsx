import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-(--text-secondary)">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2.5 text-sm
            bg-(--bg-elevated) text-(--text-primary)
            border rounded-md
            placeholder:text-(--text-muted)
            transition-all duration-(--transition)
            ${error
              ? "border-(--danger) focus:border-(--danger)"
              : "border-(--border) focus:border-(--accent)"
            }
            focus:outline-none focus:ring-2
            ${error ? "focus:ring-(--danger)/20" : "focus:ring-(--accent)/20"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-(--danger)">{error}</p>}
        {hint && !error && <p className="text-xs text-(--text-muted)">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

