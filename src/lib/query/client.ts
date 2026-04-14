import { AppError } from "@/lib/types";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
          if (error instanceof AppError && error.status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        onError: (error) => {
          if (error instanceof AppError && error.status === 429) {
            toast.error("Trop de requêtes. Veuillez patienter avant de réessayer.");
          }
        },
      },
    },
  });
}

let browserClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    throw new Error("getQueryClient() can only be called client-side");
  }
  if (!browserClient) {
    browserClient = makeQueryClient();
  }
  return browserClient;
}
