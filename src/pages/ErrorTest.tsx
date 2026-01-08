/**
 * Error Test Page
 * Demonstrates ErrorBoundary functionality by intentionally throwing errors
 */

import { useState } from "react";

export default function ErrorTest() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("This is a test error thrown on purpose!");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Error Boundary Test</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          This page demonstrates the Error Boundary
        </h2>
        <p className="text-gray-600 mb-4">
          Click the button below to trigger an error. The Error Boundary will
          catch it and display a fallback UI instead of a blank screen.
        </p>

        <button
          onClick={() => setShouldError(true)}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Trigger Error
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          What is an Error Boundary?
        </h3>
        <p className="text-yellow-700 text-sm">
          Error boundaries are React components that catch JavaScript errors
          anywhere in their child component tree, log those errors, and display
          a fallback UI instead of the component tree that crashed. They catch
          errors during rendering, in lifecycle methods, and in constructors of
          the whole tree below them.
        </p>
      </div>
    </div>
  );
}
