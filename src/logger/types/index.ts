export type LogInfo = {
  message: string;
  action: string;
  source: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  xRequestId?: string;
  durationMs?: number;
};

export type LogError = LogInfo & {
  error?: Error;
  errorMessage?: string;
  errorCode?: string | number;
  errorStack?: unknown;
};

export type LogLabels = {
  requestId: string;
  action: string;
  source: string;
};
