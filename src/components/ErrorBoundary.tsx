/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */

import type { ComponentType, ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
  fallback?: ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to console
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call the custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Log error to error tracking service (e.g., Sentry)
    // Sentry.captureException(error, { extra: errorInfo });
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      // Render default error UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 mb-6">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetError}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
            >
              Reload page
            </button>
          </div>

          {/* Development: Show error details */}
          {isDevelopment && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Show error details
              </summary>
              <div className="mt-3 p-4 bg-gray-100 rounded-lg overflow-auto">
                <p className="text-xs font-mono text-gray-700 mb-2">
                  <strong>Error:</strong> {error.name}
                </p>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </div>
            </details>
          )}

          {/* Help Text */}
          <p className="mt-6 text-sm text-gray-500">
            If the problem persists, please contact{" "}
            <a
              href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL || "support@example.com"}`}
              className="text-blue-600 hover:text-blue-700"
            >
              support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Higher-order component to wrap existing components with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: Pick<Props, "fallback" | "onError">
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary {...options}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
