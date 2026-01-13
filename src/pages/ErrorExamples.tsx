/**
 * Error Examples Page
 * Demonstrates both ErrorBoundary and API error handling functionality
 */

import { useState } from "react";
import api from "@/lib/api";
import { useApiError } from "@/hooks/useApiError";
import {
  NetworkError,
  TimeoutError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServerError,
} from "@/lib/api-error";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Alert from "@/components/Alert";

export default function ErrorExamples() {
  const { error, isError, clearError, handleApiError, getFieldError } =
    useApiError();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [shouldError, setShouldError] = useState(false);

  // ErrorBoundary trigger
  if (shouldError) {
    throw new Error("This is a test error thrown on purpose!");
  }

  // Handle form submission with error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      const response = await api.post("/auth/login", formData);
      console.log("Success:", response.data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Simulate different error types
  const simulateError = async (type: string) => {
    clearError();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      switch (type) {
        case "network":
          throw new NetworkError();
        case "timeout":
          throw new TimeoutError();
        case "validation":
          throw new ValidationError("Invalid form data.", {
            email: ["Please enter a valid email address."],
            password: ["Password must be at least 8 characters."],
          });
        case "401":
          throw new UnauthorizedError(
            "Your session has expired. Please log in again."
          );
        case "403":
          throw new ForbiddenError(
            "You don't have permission to access this resource."
          );
        case "404":
          throw new NotFoundError("The requested resource was not found.");
        case "500":
          throw new ServerError("Internal server error occurred.");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Error Handling Examples</h1>

      {/* Error Display Banner */}
      {isError && (
        <Alert
          variant="error"
          title="Error"
          dismissible
          onDismiss={clearError}
          floating
          position="top-right"
          timeout={3000}
        >
          {error?.message}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* ErrorBoundary Demo Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">ErrorBoundary Demo</h2>
          <p className="text-gray-600 mb-4">
            Click the button to trigger a render error that will be caught by
            the Error Boundary.
          </p>
          <Button
            variant="danger"
            onClick={() => setShouldError(true)}
            className="w-full"
          >
            Trigger Render Error
          </Button>
        </div>

        {/* API Error Simulation Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Simulate API Errors</h2>
          <div className="space-y-3">
            <Button
              onClick={() => simulateError("network")}
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              Network Error
            </Button>
            <Button
              onClick={() => simulateError("timeout")}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Timeout
            </Button>
            <Button
              onClick={() => simulateError("validation")}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Validation Error
            </Button>
            <Button
              onClick={() => simulateError("401")}
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              401 Unauthorized
            </Button>
            <Button
              onClick={() => simulateError("403")}
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700"
            >
              403 Forbidden
            </Button>
            <Button
              onClick={() => simulateError("404")}
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              404 Not Found
            </Button>
            <Button
              onClick={() => simulateError("500")}
              disabled={loading}
              variant="danger"
              className="w-full"
            >
              500 Server Error
            </Button>
          </div>
        </div>

        {/* Form with Validation Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Form with Validation</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={getFieldError("email") || undefined}
            />

            <Input
              id="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={getFieldError("password") || undefined}
            />

            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              variant="primary"
              className="w-full"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ErrorBoundary Explanation */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            What is an Error Boundary?
          </h3>
          <p className="text-yellow-700 text-sm">
            Error boundaries are React components that catch JavaScript errors
            anywhere in their child component tree, log those errors, and
            display a fallback UI instead of the component tree that crashed.
            They catch errors during rendering, in lifecycle methods, and in
            constructors of the whole tree below them.
          </p>
        </div>

        {/* API Error Handling Features */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Error Handling Features
          </h3>
          <ul className="space-y-2 text-blue-700 text-sm">
            <li>✓ Automatic retry for network and server errors</li>
            <li>✓ Exponential backoff with jitter</li>
            <li>✓ 401 unauthorized with auto-redirect to login</li>
            <li>✓ 403 forbidden access handling</li>
            <li>✓ Form field-level error display</li>
            <li>✓ User-friendly error messages</li>
            <li>✓ Request ID for debugging</li>
            <li>✓ Type-safe error handling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
