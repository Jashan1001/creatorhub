// ─── Logger ───────────────────────────────────────────────────────────────────
// Thin wrapper around console so we can swap to Pino/Winston later without
// touching every controller. Always includes a timestamp + level prefix.
// Usage:
//   import logger from "../lib/logger.js";
//   logger.info("Server started");
//   logger.error("DB connection failed", err);   // second arg = Error or any value
//   logger.warn("Missing env var", { key: "JWT_SECRET" });

type LogLevel = "info" | "warn" | "error" | "debug";

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info:  1,
  warn:  2,
  error: 3,
};

// In production only log info and above; in development show everything.
const MIN_LEVEL: LogLevel =
  process.env.NODE_ENV === "production" ? "info" : "debug";

function log(level: LogLevel, message: string, meta?: unknown): void {
  if (LEVELS[level] < LEVELS[MIN_LEVEL]) return;

  const ts   = new Date().toISOString();
  const prefix = `[${ts}] [${level.toUpperCase()}]`;

  if (level === "error") {
    if (meta instanceof Error) {
      console.error(`${prefix} ${message}`, {
        name:    meta.name,
        message: meta.message,
        stack:   meta.stack,
      });
    } else {
      console.error(`${prefix} ${message}`, meta ?? "");
    }
  } else if (level === "warn") {
    console.warn(`${prefix} ${message}`, meta ?? "");
  } else {
    console.log(`${prefix} ${message}`, meta ?? "");
  }
}

const logger = {
  debug: (msg: string, meta?: unknown) => log("debug", msg, meta),
  info:  (msg: string, meta?: unknown) => log("info",  msg, meta),
  warn:  (msg: string, meta?: unknown) => log("warn",  msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
};

export default logger;