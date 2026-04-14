"use client";

import { getMe, signIn, signOut, signUp } from "@/lib/api/auth";
import { queryKeys } from "@/lib/query/keys";
import type { SignInBody, SignUpBody } from "@/lib/types";
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

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (body: SignInBody) => signIn(body),
    onSuccess: () => {
      const redirect = searchParams.get("redirect") ?? "/dashboard";
      router.push(redirect);
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
