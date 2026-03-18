import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
  showCount?: boolean;
  maxLength?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, suffix, showCount, maxLength, className = "", value, ...props }, ref) => {
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5">
        {(label || (showCount && maxLength)) && (
          <div className="flex items-center justify-between">
            {label && (
              <label className="text-sm font-medium text-(--text-secondary)">
                {label}
              </label>
            )}
            {showCount && maxLength && (
              <span className={`text-xs tabular-nums ${
                currentLength > maxLength * 0.9 ? "text-(--warning)" : "text-(--text-muted)"
              }`}>
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}

        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-(--text-muted) pointer-events-none flex items-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            value={value}
            maxLength={maxLength}
            className={`
              w-full py-2.5 text-sm
              bg-(--bg-elevated) text-(--text-primary)
              border rounded-md
              placeholder:text-(--text-muted)
              transition-all duration-(--transition)
              ${icon ? "pl-9 pr-3" : "px-3"}
              ${suffix ? "pr-10" : ""}
              ${error
                ? "border-(--danger) focus:border-(--danger) focus:ring-2 focus:ring-(--danger)/20"
                : "border-(--border) focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20"
              }
              focus:outline-none focus:bg-(--bg-hover)
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-(--text-muted) flex items-center">
              {suffix}
            </span>
          )}
        </div>

        {error && <p className="text-xs text-(--danger) flex items-center gap-1">
          <span>⚠</span> {error}
        </p>}
        {hint && !error && <p className="text-xs text-(--text-muted)">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";