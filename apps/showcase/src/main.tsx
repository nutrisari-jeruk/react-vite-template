import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { App } from "@/app";
import { initializeMocks } from "@/mocks/initialize";
import "./index.css";

async function initApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  try {
    if (!(await initializeMocks())) return;
  } catch (error) {
    // Do not silently switch to the real backend after a failed mock startup.
    console.error("Application initialization failed:", error);
    rootElement.setAttribute("role", "alert");
    rootElement.textContent =
      "Unable to start the application. Check the console for details.";
    return;
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
