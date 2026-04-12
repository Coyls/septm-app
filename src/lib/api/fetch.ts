import { AppError, MUTATION_METHODS } from "@/lib/types";
import { useCsrfStore } from "@/stores/csrf.store";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

let isRefreshing = false;

async function doRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

function redirectToSignIn(): never {
  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
  throw new AppError("UNAUTHORIZED", 401, "Non authentifié");
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
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

  if (response.status === 401 && !isRefreshing) {
    isRefreshing = true;
    const refreshed = await doRefresh();
    isRefreshing = false;

    if (refreshed) {
      // Retry original request once
      const retryResponse = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: "include",
        headers,
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
      // Refresh failed — clear state and redirect
      useCsrfStore.getState().clearToken();
      // Lazy import to avoid circular dependency
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
