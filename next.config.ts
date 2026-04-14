import type { NextConfig } from "next"

// CSP is set dynamically per-request by proxy.ts (nonce-based).
// Only static security headers are set here.
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

const apiInternalUrl = process.env.API_INTERNAL_URL ?? "http://localhost:3000/api/v1"

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiInternalUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
