import { type NextRequest, NextResponse } from "next/server";

const API_INTERNAL = process.env.API_INTERNAL_URL ?? "http://localhost:3000/api/v1";

// No auth check — always accessible
const OPEN_PATHS = ["/", "/statistics"];

// Auth check: redirect to /dashboard if already authenticated
const AUTH_PAGES = ["/auth/signin", "/auth/signup"];

async function checkAuth(request: NextRequest): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_INTERNAL}/auth/me`, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

/** Attempt a server-side token refresh. Returns Set-Cookie headers on success, null on failure. */
async function tryRefresh(request: NextRequest): Promise<string[] | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_INTERNAL}/auth/refresh`, {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const cookies = res.headers.getSetCookie();
    return cookies.length > 0 ? cookies : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Open paths — skip auth check entirely
  if (OPEN_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const isAuthenticated = await checkAuth(request);

  // Auth pages — redirect authenticated users to dashboard
  if (AUTH_PAGES.includes(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected pages
  if (!isAuthenticated) {
    // Access token expired — try to refresh before giving up
    const newCookies = await tryRefresh(request);

    if (newCookies) {
      // Refresh succeeded: let the request through and forward the new cookies
      const response = NextResponse.next();
      for (const cookie of newCookies) {
        response.headers.append("Set-Cookie", cookie);
      }
      return response;
    }

    // Truly unauthenticated — redirect to signin
    const redirectUrl = new URL("/auth/signin", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/statistics",
    "/dashboard",
    "/game/:path*",
    "/statistics/me",
    "/friends",
  ],
};
