"use client";

import { deleteAccount, updateName } from "@/lib/api/user";
import { queryKeys } from "@/lib/query/keys";
import { useCsrfStore } from "@/stores/csrf.store";
import { useGameWizardStore } from "@/stores/game-wizard.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useUpdateName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => updateName(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearToken = useCsrfStore((s) => s.clearToken);
  const resetWizard = useGameWizardStore((s) => s.reset);

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      clearToken();
      resetWizard();
      queryClient.clear();
      router.push("/auth/signin");
    },
  });
}
