import { AppError, MUTATION_METHODS } from "@/lib/types";
import { useCsrfStore } from "@/stores/csrf.store";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

let isRefreshing = false;
let refreshQueue: Array<(success: boolean) => void> = [];

async function doRefresh(): Promise<boolean> {
  try {
    const csrfToken = useCsrfStore.getState().token;
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

function waitForRefresh(): Promise<boolean> {
  return new Promise((resolve) => {
    refreshQueue.push(resolve);
  });
}

function redirectToSignIn(): never {
  if (typeof window !== "undefined") {
    const { pathname } = window.location;
    const target = pathname.startsWith("/auth/")
      ? "/auth/signin"
      : `/auth/signin?redirect=${encodeURIComponent(pathname)}`;
    window.location.href = target;
  }
  throw new AppError("UNAUTHORIZED", 401, "Non authentifié");
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit & { noRedirect?: boolean } = {},
): Promise<T> {
  const csrfToken = useCsrfStore.getState().token;
  const method = (options.method?.toUpperCase() ?? "GET") as string;
  const isMutation = (MUTATION_METHODS as readonly string[]).includes(method);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(isMutation && csrfToken ? { "x-csrf-token": csrfToken } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (response.status === 401) {
    let refreshed: boolean;

    if (isRefreshing) {
      // Another request is already refreshing — wait for it to complete
      refreshed = await waitForRefresh();
    } else {
      isRefreshing = true;
      refreshed = await doRefresh();
      isRefreshing = false;
      // Resolve all queued requests with the refresh result
      refreshQueue.forEach((resolve) => resolve(refreshed));
      refreshQueue = [];
    }

    if (refreshed) {
      // Re-read CSRF token after refresh — the server may have rotated it
      const freshCsrfToken = useCsrfStore.getState().token;
      const retryHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(isMutation && freshCsrfToken ? { "x-csrf-token": freshCsrfToken } : {}),
        ...(options.headers as Record<string, string> | undefined),
      };

      // Retry original request once with fresh cookies
      const retryResponse = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: "include",
        headers: retryHeaders,
      });

      if (!retryResponse.ok) {
        const body = await retryResponse.json().catch(() => ({}));
        const code =
          typeof body?.message === "object"
            ? body.message.code
            : String(body?.message ?? "UNKNOWN");
        throw new AppError(
          code,
          retryResponse.status,
          String(body?.message ?? ""),
        );
      }

      return retryResponse.json() as Promise<T>;
    } else {
      if (options.noRedirect) {
        throw new AppError("UNAUTHORIZED", 401, "Non authentifié");
      }
      // Refresh failed — clear state and redirect
      useCsrfStore.getState().clearToken();
      const { getQueryClient } = await import("@/lib/query/client");
      try {
        getQueryClient().clear();
      } catch {
        // ignore if not available
      }
      redirectToSignIn();
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const code =
      typeof body?.message === "object"
        ? body.message.code
        : String(body?.message ?? "UNKNOWN");
    throw new AppError(code, response.status, String(body?.message ?? ""));
  }

  // Handle empty responses (204)
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return true as unknown as T;
  }

  return response.json() as Promise<T>;
}
