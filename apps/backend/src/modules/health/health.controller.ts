export function getHealthResponse() {
  return {
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString()
  };
}
