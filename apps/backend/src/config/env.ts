export type EnvConfig = {
  port: number;
  nodeEnv: string;
};

export function getEnvConfig(): EnvConfig {
  const port = Number(process.env.PORT ?? 8080);
  return {
    port: Number.isNaN(port) ? 8080 : port,
    nodeEnv: process.env.NODE_ENV ?? "development"
  };
}
