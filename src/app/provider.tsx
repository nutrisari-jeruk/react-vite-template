import type { ErrorInfo } from "react";
import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/libs/queryClient";

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
