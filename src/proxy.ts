import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/signin", "/signup", "/statistics"];
const AUTH_REDIRECT_PATHS = ["/signin", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Skip API call entirely for public paths — no need to check auth
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For protected routes, check auth with a hard timeout to avoid hanging
  const cookieHeader = request.headers.get("cookie") ?? "";
  let isAuthenticated = false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `${process.env.API_INTERNAL_URL ?? "http://localhost:3000/api/v1"}/auth/me`,
      {
        headers: { cookie: cookieHeader },
        cache: "no-store",
        signal: controller.signal,
      },
    );
    clearTimeout(timeout);
    isAuthenticated = res.ok;
  } catch {
    // Network error or timeout — fail closed, redirect to signin
  }

  if (!isAuthenticated) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (AUTH_REDIRECT_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only match actual app pages — never intercept API paths
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/statistics",
    "/dashboard",
    "/game/:path*",
    "/statistics/me",
    "/friends",
  ],
};
