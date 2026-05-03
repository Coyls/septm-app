import type { AuthUser, SignInBody, SignUpBody } from "@/lib/types";
import { apiFetch } from "./fetch";

export function getMe(): Promise<{ user: AuthUser }> {
  return apiFetch("/auth/me");
}

export function getMePublic(): Promise<{ user: AuthUser }> {
  return apiFetch("/auth/me", { noRedirect: true });
}

export function signIn(body: SignInBody): Promise<{ userId: string }> {
  return apiFetch("/auth/signin", {
    method: "POST",
    body: JSON.stringify(body),
    noRedirect: true,
  });
}

export function signUp(body: SignUpBody): Promise<{ userId: string }> {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
    noRedirect: true,
  });
}

export function refresh(): Promise<{ success: true }> {
  return apiFetch("/auth/refresh", { method: "POST" });
}

export function signOut(): Promise<true> {
  return apiFetch("/auth/refresh/signout", { method: "POST" });
}

export function getCsrfToken(): Promise<{ csrfToken: string }> {
  return apiFetch("/csrf");
}

export function verifyEmail(token: string): Promise<{ success: boolean }> {
  return apiFetch(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
    noRedirect: true,
  });
}

export function resendVerification(): Promise<{ success: true }> {
  return apiFetch("/auth/resend-verification", { method: "POST" });
}

export function forgotPassword(email: string): Promise<{ success: true }> {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
    noRedirect: true,
  });
}

export function resetPassword(
  token: string,
  password: string,
): Promise<{ success: boolean }> {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
    noRedirect: true,
  });
}
