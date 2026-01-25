import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "@/components/error-boundary";
import { App } from "@/app";
import { startMockWorker } from "@/mocks/browser";
import "./index.css";

// Start MSW mock worker in development
startMockWorker().catch((err) =>
  console.error("Failed to start MSW worker:", err)
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("Global error caught:", error, errorInfo);
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
