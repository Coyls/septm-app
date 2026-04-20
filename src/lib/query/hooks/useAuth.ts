"use client";

import {
  forgotPassword,
  getMe,
  getMePublic,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "@/lib/api/auth";
import { queryKeys } from "@/lib/query/keys";
import type { SignInBody, SignUpBody } from "@/lib/types";
import { isSafeRedirect } from "@/lib/utils";
import { useCsrfStore } from "@/stores/csrf.store";
import { useGameWizardStore } from "@/stores/game-wizard.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getMe,
    retry: false,
  });
}

export function useMePublic() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getMePublic,
    retry: false,
  });
}

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (body: SignInBody) => signIn(body),
    onSuccess: () => {
      const redirectParam = searchParams.get("redirect");
      router.push(isSafeRedirect(redirectParam) ? redirectParam : "/dashboard");
    },
  });
}

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (body: SignUpBody) => signUp(body),
    onSuccess: () => {
      router.push("/dashboard?newAccount=true");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetPassword(token, password),
    onSuccess: () => {
      router.push("/auth/signin?reset=true");
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearToken = useCsrfStore((s) => s.clearToken);
  const resetWizard = useGameWizardStore((s) => s.reset);

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      clearToken();
      resetWizard();
      queryClient.clear();
      router.push("/auth/signin");
    },
  });
}
