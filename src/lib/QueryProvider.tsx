import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { env } from "@/utils/env";
import { isRetryableError } from "@/lib/api-error";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Only retry retryable errors
        if (!isRetryableError(error)) {
          return false;
        }

        // Retry up to configured times
        return failureCount < env.queryRetryTimes;
      },
      retryDelay: (attemptIndex) => {
        // Exponential backoff with jitter
        const delay = Math.min(1000 * 2 ** attemptIndex, 30000);
        return delay + Math.random() * 1000; // Add jitter to avoid thundering herd
      },
      refetchOnWindowFocus: false,
      staleTime: env.queryStaleTime,
      gcTime: env.queryCacheTime,
    },

    mutations: {
      retry: (failureCount, error) => {
        // Only retry retryable errors
        if (!isRetryableError(error)) {
          return false;
        }

        // Retry up to configured times
        return failureCount < env.queryRetryTimes;
      },
      retryDelay: (attemptIndex) => {
        // Exponential backoff with jitter
        const delay = Math.min(1000 * 2 ** attemptIndex, 30000);
        return delay + Math.random() * 1000;
      },
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
