import { type NextRequest, NextResponse } from "next/server";

// No auth check — always accessible
const OPEN_PATHS = ["/", "/statistics"];

// Redirect to dashboard if already has a valid access_token
const AUTH_PAGES = ["/auth/signin", "/auth/signup"];

const isDev = process.env.NODE_ENV === "development";

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

function nextWithNonce(
  request: NextRequest,
  nonce: string,
  csp: string,
): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

/**
 * The proxy only checks cookie *presence*, not validity.
 * Actual token validation and refresh are handled client-side by apiFetch.
 * Doing a server-side refresh here would race with the client-side refresh,
 * causing token rotation conflicts (revoked token → redirect to signin).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  if (OPEN_PATHS.includes(pathname)) {
    return nextWithNonce(request, nonce, csp);
  }

  const hasAccessToken = request.cookies.has("access_token");
  const hasRefreshToken = request.cookies.has("refresh_token");
  const hasSession = hasAccessToken || hasRefreshToken;

  // Auth pages — redirect to dashboard only if access_token is present and not expired.
  // Checking refresh_token alone is not enough: it may be revoked in the DB,
  // which would cause a redirect loop (dashboard → 401 → signin → redirect → dashboard…).
  if (AUTH_PAGES.includes(pathname)) {
    if (hasAccessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return nextWithNonce(request, nonce, csp);
  }

  // All other /auth/* paths (e.g. /auth/verify-email) are publicly accessible
  if (pathname.startsWith("/auth/")) {
    return nextWithNonce(request, nonce, csp);
  }

  // Protected pages — redirect only if no session at all
  if (!hasSession) {
    const redirectUrl = new URL("/auth/signin", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return nextWithNonce(request, nonce, csp);
}

export const config = {
  matcher: [
    {
      // Run on all routes except API, static assets, and image optimization
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      // Skip Next.js prefetch requests — they don't render a page
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
