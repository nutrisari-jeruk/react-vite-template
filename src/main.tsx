import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "@/components/error-boundary";
import { App } from "@/app";
import "./index.css";

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
