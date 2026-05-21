export function logInfo(message: string, metadata?: Record<string, unknown>): void {
  const payload = {
    level: "info",
    message,
    metadata: metadata ?? {},
    timestamp: new Date().toISOString()
  };
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

export function logError(message: string, metadata?: Record<string, unknown>): void {
  const payload = {
    level: "error",
    message,
    metadata: metadata ?? {},
    timestamp: new Date().toISOString()
  };
  process.stderr.write(`${JSON.stringify(payload)}\n`);
}
