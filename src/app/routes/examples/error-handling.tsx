import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiError } from "@/hooks/use-api-error";
import {
  NetworkError,
  TimeoutError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServerError,
} from "@/lib/api-error";
import { Button, Alert } from "@/components/ui";

export default function ErrorExamples() {
  const navigate = useNavigate();
  const { error, isError, clearError, handleApiError } = useApiError();

  const [loading, setLoading] = useState(false);
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("This is a test error thrown on purpose!");
  }

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
      <h1 className="mb-6 text-3xl font-bold text-balance">
        Error Handling Examples
      </h1>

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

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">ErrorBoundary Demo</h2>
          <p className="mb-4 text-pretty text-gray-600">
            Click the button to trigger a render error.
          </p>
          <div className="space-y-3">
            <Button
              variant="danger"
              onClick={() => setShouldError(true)}
              className="w-full"
            >
              Trigger Render Error
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/this-route-does-not-exist")}
              className="w-full"
            >
              Trigger Not Found Page
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Simulate API Errors</h2>
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
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-yellow-800">
            What is an Error Boundary?
          </h3>
          <p className="text-sm text-yellow-700">
            Error boundaries are React components that catch JavaScript errors
            anywhere in their child component tree, log those errors, and
            display a fallback UI.
          </p>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-blue-800">
            Error Handling Features
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>✓ Automatic retry for network errors</li>
            <li>✓ Exponential backoff with jitter</li>
            <li>✓ 401 unauthorized with auto-redirect</li>
            <li>✓ Form field-level error display</li>
            <li>✓ User-friendly error messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
