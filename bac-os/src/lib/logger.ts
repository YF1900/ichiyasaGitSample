type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  action: string;
  message: string;
  context?: Record<string, unknown>;
  error?: string;
}

function createLogEntry(
  level: LogLevel,
  action: string,
  message: string,
  context?: Record<string, unknown>,
  error?: string
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    action,
    message,
    context,
    error,
  };
}

export const logger = {
  info(action: string, message: string, context?: Record<string, unknown>) {
    const entry = createLogEntry("info", action, message, context);
    console.log(JSON.stringify(entry));
  },
  warn(action: string, message: string, context?: Record<string, unknown>) {
    const entry = createLogEntry("warn", action, message, context);
    console.warn(JSON.stringify(entry));
  },
  error(action: string, message: string, error?: unknown, context?: Record<string, unknown>) {
    const errMsg = error instanceof Error ? error.message : String(error ?? "");
    const entry = createLogEntry("error", action, message, context, errMsg);
    console.error(JSON.stringify(entry));
  },
  debug(action: string, message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV === "development") {
      const entry = createLogEntry("debug", action, message, context);
      console.debug(JSON.stringify(entry));
    }
  },
};
