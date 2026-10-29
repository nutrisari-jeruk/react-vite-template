import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeMocks } from "@/mocks/initialize";
import { App } from "@/app";
import "./index.css";

async function initApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");
  try {
    if (!(await initializeMocks())) return;
  } catch (error) {
    console.error("Application initialization failed:", error);
    rootElement.setAttribute("role", "alert");
    rootElement.textContent =
      "Unable to start the application. Check the console for details.";
    return;
  }
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
initApp();
