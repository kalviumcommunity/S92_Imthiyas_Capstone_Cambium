export interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number;
  maxRetries?: number;
  idempotencyKey?: string;
  skipAuthRefresh?: boolean;
}

const RETRIABLE_STATUS = new Set([502, 503, 504]);
let inflightRefreshPromise: Promise<string | null> | null = null;

export function resolveApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isLocal) {
      return "https://cambium-api-ufj3.onrender.com/api";
    }
  }
  return "http://localhost:5000/api";
}

export function resolveApiV1Base(): string {
  const clean = resolveApiBase().replace(/\/$/, "");
  if (clean.endsWith("/v1")) return clean;
  if (clean.endsWith("/api")) return `${clean}/v1`;
  return `${clean}/api/v1`;
}

export function generateRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export function computeJitteredBackoffMs(attempt: number, baseMs = 300, maxMs = 8000): number {
  const exponential = Math.min(maxMs, baseMs * Math.pow(2, attempt));
  return Math.round(exponential * (0.5 + Math.random() * 0.5));
}

export function isRequestSafeToRetry(method: string, headers: Headers): boolean {
  const upper = (method || "GET").toUpperCase();
  if (upper === "GET" || upper === "HEAD" || upper === "OPTIONS") {
    return true;
  }
  return Boolean(headers.get("Idempotency-Key") || headers.get("x-idempotency-key"));
}

async function performTokenRefresh(): Promise<string | null> {
  if (inflightRefreshPromise) {
    return inflightRefreshPromise;
  }

  inflightRefreshPromise = (async () => {
    try {
      const refreshUrl = `${resolveApiV1Base()}/auth/refresh`;
      // Refresh credentials travel strictly via HttpOnly cookie (never persisted in localStorage)
      if (typeof window !== "undefined") {
        localStorage.removeItem("cambium_refresh_token");
      }
      const res = await fetch(refreshUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Request-Id": generateRequestId() },
        credentials: "include",
      });

      if (!res.ok) return null;
      const json = await res.json();
      const newToken: string | undefined = json?.token || json?.accessToken;
      if (newToken && typeof window !== "undefined") {
        localStorage.setItem("cambium_token", newToken);
        localStorage.setItem("cambium_access_token", newToken);
        return newToken;
      }
      return null;
    } catch {
      return null;
    } finally {
      inflightRefreshPromise = null;
    }
  })();

  return inflightRefreshPromise;
}

export async function apiFetch(
  input: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const {
    timeoutMs = 12000,
    maxRetries = 2,
    idempotencyKey,
    skipAuthRefresh = false,
    headers: initHeaders,
    ...rest
  } = options;

  const url = input.startsWith("http")
    ? input
    : `${resolveApiV1Base()}${input.startsWith("/") ? input : `/${input}`}`;

  const method = (rest.method || "GET").toUpperCase();
  const headers = new Headers(initHeaders || {});
  if (!headers.has("Content-Type") && !(rest.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("X-Request-Id")) {
    headers.set("X-Request-Id", generateRequestId());
  }
  if (idempotencyKey && !headers.has("Idempotency-Key")) {
    headers.set("Idempotency-Key", idempotencyKey);
  }
  if (typeof window !== "undefined" && !headers.has("Authorization")) {
    const token =
      localStorage.getItem("cambium_token") || localStorage.getItem("cambium_access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const canRetry = isRequestSafeToRetry(method, headers);
  const attemptsLimit = canRetry ? maxRetries + 1 : 1;

  let lastError: unknown;
  let refreshedOnce = false;

  for (let attempt = 0; attempt < attemptsLimit; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...rest,
        method,
        headers,
        credentials: rest.credentials || "include",
        signal: options.signal || controller.signal,
      });

      clearTimeout(timer);

      if (response.status === 401 && !skipAuthRefresh && !refreshedOnce) {
        refreshedOnce = true;
        const nextToken = await performTokenRefresh();
        if (nextToken) {
          headers.set("Authorization", `Bearer ${nextToken}`);
          attempt--;
          continue;
        }
      }

      if (RETRIABLE_STATUS.has(response.status) && canRetry && attempt + 1 < attemptsLimit) {
        await new Promise((r) => setTimeout(r, computeJitteredBackoffMs(attempt)));
        continue;
      }

      return response;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (!canRetry || attempt + 1 >= attemptsLimit) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, computeJitteredBackoffMs(attempt)));
    }
  }

  throw lastError || new Error("Network request failed after bounded retries");
}
