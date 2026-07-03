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

// notified when any api response indicates the session is no longer
// valid (revoked, expired, or never existed) — registered by the auth
// provider, which drops the signed-in state in response
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  options: { params?: QueryParams; body?: unknown } = {},
): Promise<Envelope<T>> {
  const url = new URL(`${env.apiBaseUrl}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  // FormData bodies set their own multipart content type (with boundary)
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: isFormData
      ? (options.body as FormData)
      : options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
    // sessions are transported via an http-only cookie
    credentials: "include",
  });

  // a 401 from the login endpoint means bad credentials, not a dead
  // session; from anywhere else it means our session is gone
  if (
    response.status === 401 &&
    !(method === "POST" && path === "/v2/sessions")
  ) {
    unauthorizedHandler?.();
  }

  const body = (await response.json().catch(() => null)) as {
    status?: string;
    data?: T;
    meta?: Record<string, unknown>;
    error?: string;
  } | null;

  if (!response.ok || body?.status !== "success" || body.data === undefined) {
    // rate-limit responses come from the proxy layer without our envelope
    const fallback =
      response.status === 429
        ? "You're doing that too often — please wait a minute and try again."
        : `Request failed (${response.status})`;
    throw new ApiError(body?.error ?? fallback, response.status);
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

export function apiPut<T>(path: string, body: unknown): Promise<Envelope<T>> {
  return request<T>("PUT", path, { body });
}

export function apiDelete<T>(path: string): Promise<Envelope<T>> {
  return request<T>("DELETE", path);
}
