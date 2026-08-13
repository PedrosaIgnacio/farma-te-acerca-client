import { clearSession, readSession } from "@/lib/session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function extractMessage(body: unknown): string | undefined {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message: unknown }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }
  return undefined;
}

/**
 * Injects the bearer token and API base URL. On a 401 for an already-authenticated
 * request (session exists), the token is treated as expired/invalid: the session is
 * cleared and the browser is bounced to /login. A 401 with no session present (e.g. bad
 * login credentials) is left to the caller, which needs the response body to show inline.
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const session = readSession();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && session) {
    clearSession();
    window.location.assign("/login");
  }

  return res;
}

export async function apiJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      // no JSON body
    }
    throw new ApiError(res.status, extractMessage(body) ?? res.statusText, body);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function apiBlob(path: string, options?: RequestInit): Promise<Blob> {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      // no JSON body
    }
    throw new ApiError(res.status, extractMessage(body) ?? res.statusText, body);
  }
  return res.blob();
}
