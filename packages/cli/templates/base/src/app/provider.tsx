import type { ErrorInfo } from "react";
import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
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

function handleError(error: unknown, info: ErrorInfo) {
  console.error("ErrorBoundary caught an error:", error, info);
}

function ErrorFallback({ error }: { error: unknown }) {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Something went wrong</h1>
      <pre style={{ color: "red" }}>{errorMessage}</pre>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          padding: "0.5rem 1rem",
          marginTop: "1rem",
          cursor: "pointer",
        }}
      >
        Reload page
      </button>
    </div>
  );
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ErrorBoundary>
  );
}
