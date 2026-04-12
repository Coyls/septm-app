import { type NextRequest, NextResponse } from "next/server";

// No auth check — always accessible
const OPEN_PATHS = ["/", "/statistics"];

// Auth check: redirect to /dashboard if already authenticated
const AUTH_PAGES = ["/auth/signin", "/auth/signup"];

async function checkAuth(request: NextRequest): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `${process.env.API_INTERNAL_URL ?? "http://localhost:3000/api/v1"}/auth/me`,
      {
        headers: { cookie: request.headers.get("cookie") ?? "" },
        cache: "no-store",
        signal: controller.signal,
      },
    );
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
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

  // Protected pages — redirect unauthenticated users to signin
  if (!isAuthenticated) {
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
