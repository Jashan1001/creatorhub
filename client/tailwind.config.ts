import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base:      "var(--bg-base)",
        surface:   "var(--bg-surface)",
        elevated:  "var(--bg-elevated)",
        accent:    "var(--accent)",
        border:    "var(--border)",
        primary:   "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted:     "var(--text-muted)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body:    "var(--font-body)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
} satisfies Config;
