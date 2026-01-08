import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { env } from "@/utils/env";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: env.queryRetryTimes,
      retryDelay: env.queryRetryDelay,
      refetchOnWindowFocus: false,
      staleTime: env.queryStaleTime,
      gcTime: env.queryCacheTime,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
