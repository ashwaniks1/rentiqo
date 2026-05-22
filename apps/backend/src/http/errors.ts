export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(statusCode: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function createErrorEnvelope(error: unknown) {
  if (error instanceof HttpError) {
    return {
      statusCode: error.statusCode,
      body: {
        code: error.code,
        message: error.message,
        trace_id: `trace-${Date.now()}`,
        details: error.details
      }
    };
  }

  return {
    statusCode: 500,
    body: {
      code: "INTERNAL_ERROR",
      message: "Unexpected server error",
      trace_id: `trace-${Date.now()}`
    }
  };
}
