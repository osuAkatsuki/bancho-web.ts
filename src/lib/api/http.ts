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

async function request<T>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  options: { params?: QueryParams; body?: unknown } = {},
): Promise<Envelope<T>> {
  const url = new URL(`${env.apiBaseUrl}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    // sessions are transported via an http-only cookie
    credentials: "include",
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

/**
 * Call a bancho.py v2 api endpoint and unwrap its
 * `{status, data, meta}` response envelope.
 */
export function apiGet<T>(
  path: string,
  params?: QueryParams,
): Promise<Envelope<T>> {
  return request<T>("GET", path, { params });
}

export function apiPost<T>(path: string, body: unknown): Promise<Envelope<T>> {
  return request<T>("POST", path, { body });
}

export function apiDelete<T>(path: string): Promise<Envelope<T>> {
  return request<T>("DELETE", path);
}
