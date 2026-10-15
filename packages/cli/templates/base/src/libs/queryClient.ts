import { QUERY_KEYS } from "@/config/constants";
import { subscribeSessionCleared } from "./tokenStorage";
import { QueryClient } from "@tanstack/react-query";
import { env } from "@/config/env";
import { isRetryableError } from "./apiError";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: env.queryStaleTime,
      gcTime: env.queryCacheTime,
      retry: (failureCount, error) =>
        isRetryableError(error) && failureCount < env.queryRetryTimes,
      retryDelay: (attemptIndex) =>
        Math.min(env.queryRetryDelay * 2 ** attemptIndex, 30000) +
        Math.random() * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
});

// Session expiry from the HTTP client must also remove cached private data.
const unsubscribe = subscribeSessionCleared(() => {
  void queryClient.cancelQueries();
  queryClient.removeQueries({
    predicate: (query) =>
      JSON.stringify(query.queryKey) !== JSON.stringify(QUERY_KEYS.AUTH.USER),
  });
  queryClient.setQueryData(QUERY_KEYS.AUTH.USER, null);
});
if (import.meta.hot) import.meta.hot.dispose(unsubscribe);
