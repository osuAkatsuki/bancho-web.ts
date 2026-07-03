import { env } from "@/lib/env";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface Envelope<T> {
  data: T;
  meta: Record<string, unknown>;
}

type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * GET a bancho.py v2 api endpoint and unwrap its
 * `{status, data, meta}` response envelope.
 */
export async function apiGet<T>(
  path: string,
  params?: QueryParams,
): Promise<Envelope<T>> {
  const url = new URL(`${env.apiBaseUrl}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  const body = (await response.json().catch(() => null)) as {
    status?: string;
    data?: T;
    meta?: Record<string, unknown>;
    error?: string;
  } | null;

  if (!response.ok || body?.status !== "success" || body.data === undefined) {
    throw new ApiError(
      body?.error ?? `Request failed (${response.status})`,
      response.status,
    );
  }

  return { data: body.data, meta: body.meta ?? {} };
}
