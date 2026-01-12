import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // TODO: Integrate with error tracking service (e.g., Sentry)
        console.error("Global error caught:", error, errorInfo);
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
