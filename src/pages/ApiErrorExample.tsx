/**
 * API Error Example Page
 * Demonstrates comprehensive API error handling
 */

import { useState } from "react";
import api from "@/lib/api";
import { useApiError } from "@/hooks/useApiError";

export default function ApiErrorExample() {
  const { error, isError, clearError, handleApiError, getFieldError } =
    useApiError();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Example: Handle form submission with error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      // Simulate API call
      const response = await api.post("/auth/login", formData);
      console.log("Success:", response.data);
    } catch (err) {
      // Handle API error
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Example: Simulate different error types
  const simulateError = async (type: string) => {
    clearError();
    setLoading(true);

    try {
      switch (type) {
        case "network":
          await api.get("/simulate/network-error");
          break;
        case "timeout":
          await api.get("/simulate/timeout", { timeout: 1 });
          break;
        case "validation":
          await api.post("/simulate/validation", { email: "invalid" });
          break;
        case "404":
          await api.get("/simulate/not-found");
          break;
        case "500":
          await api.get("/simulate/server-error");
          break;
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Error Handling Example</h1>

      {/* Error Display */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error?.message}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Example */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Form with Validation</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg ${
                  getFieldError("email") ? "border-red-500" : "border-gray-300"
                }`}
                aria-invalid={!!getFieldError("email")}
                aria-describedby={
                  getFieldError("email") ? "email-error" : undefined
                }
              />
              {getFieldError("email") && (
                <p id="email-error" className="text-sm text-red-600 mt-1">
                  {getFieldError("email")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg border-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Error Simulation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Simulate Errors</h2>
          <div className="space-y-3">
            <button
              onClick={() => simulateError("network")}
              disabled={loading}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
            >
              Simulate Network Error
            </button>
            <button
              onClick={() => simulateError("timeout")}
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              Simulate Timeout
            </button>
            <button
              onClick={() => simulateError("validation")}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Simulate Validation Error
            </button>
            <button
              onClick={() => simulateError("404")}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Simulate 404 Not Found
            </button>
            <button
              onClick={() => simulateError("500")}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Simulate 500 Server Error
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          Error Handling Features
        </h3>
        <ul className="space-y-2 text-blue-700">
          <li>✓ Automatic retry for network and server errors</li>
          <li>✓ Exponential backoff with jitter</li>
          <li>✓ Automatic token refresh on 401</li>
          <li>✓ Form field-level error display</li>
          <li>✓ User-friendly error messages</li>
          <li>✓ Request ID for debugging</li>
          <li>✓ Type-safe error handling</li>
        </ul>
      </div>
    </div>
  );
}
