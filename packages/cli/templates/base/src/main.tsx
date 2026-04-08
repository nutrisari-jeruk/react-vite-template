import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "@/components/error-boundary";
import { App } from "@/app";
import { startMockWorker } from "@/mocks/browser";
import "./index.css";

async function initApp() {
  // Wait for MSW to be ready in development
  if (import.meta.env.DEV) {
    try {
      await startMockWorker();
      console.log("[MSW] Mock API worker ready");
    } catch (err) {
      console.error("Failed to start MSW worker:", err);
    }
  }

  // Render app after MSW is ready
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  createRoot(rootElement).render(
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
}

// Initialize the app
initApp();
