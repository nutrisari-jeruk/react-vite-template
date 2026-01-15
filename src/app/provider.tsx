import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { env } from "@/config/env";
import { isRetryableError } from "@/lib/api-error";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (!isRetryableError(error)) {
          return false;
        }
        return failureCount < env.queryRetryTimes;
      },
      retryDelay: (attemptIndex) => {
        const delay = Math.min(1000 * 2 ** attemptIndex, 30000);
        return delay + Math.random() * 1000;
      },
      refetchOnWindowFocus: false,
      staleTime: env.queryStaleTime,
      gcTime: env.queryCacheTime,
    },
    mutations: {
      retry: (failureCount, error) => {
        if (!isRetryableError(error)) {
          return false;
        }
        return failureCount < env.queryRetryTimes;
      },
      retryDelay: (attemptIndex) => {
        const delay = Math.min(1000 * 2 ** attemptIndex, 30000);
        return delay + Math.random() * 1000;
      },
    },
  },
});

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
