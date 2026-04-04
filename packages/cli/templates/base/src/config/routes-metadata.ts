/**
 * Route metadata configuration.
 * Maps route paths to their page titles and descriptions.
 */

export interface RouteMetadata {
  title: string;
  description: string;
}

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  "/": {
    title: "Home",
    description:
      "RSUD R.T. Notopuro - Modern hospital information system for efficient patient management and medical services.",
  },
  "/about": {
    title: "About",
    description:
      "Learn about RSUD R.T. Notopuro - Our mission, vision, and commitment to providing quality healthcare services.",
  },
  "/components": {
    title: "Components",
    description:
      "UI component library for RSUD R.T. Notopuro hospital information system. Reusable, accessible components.",
  },
  "/login": {
    title: "Login",
    description:
      "Login to RSUD R.T. Notopuro hospital information system. Secure authentication for authorized personnel.",
  },
  "/otp": {
    title: "OTP Verification",
    description:
      "Verify your OTP code to complete authentication in RSUD R.T. Notopuro hospital information system.",
  },
  "/examples/error-handling": {
    title: "Error Handling Examples",
    description:
      "Error handling examples and patterns used in RSUD R.T. Notopuro hospital information system.",
  },
  "/examples/auth": {
    title: "Authentication",
    description:
      "Authentication examples for RSUD R.T. Notopuro hospital information system. Login, logout, and session management.",
  },
  "/examples/form-validation": {
    title: "Form Validation",
    description:
      "Form validation examples using Zod and React Hook Form in RSUD R.T. Notopuro hospital information system.",
  },
  "/examples/data-table": {
    title: "Data Table",
    description:
      "Data table component examples for displaying and managing patient data in RSUD R.T. Notopuro hospital information system.",
  },
};

/**
 * Gets metadata for a given path.
 * Returns default metadata if path not found.
 */
export function getRouteMetadata(path: string): RouteMetadata {
  // Check for exact match
  if (ROUTE_METADATA[path]) {
    return ROUTE_METADATA[path];
  }

  // Check for partial matches (for dynamic routes)
  const partialMatch = Object.keys(ROUTE_METADATA).find((key) => {
    if (key.endsWith("*")) {
      const baseKey = key.slice(0, -1);
      return path.startsWith(baseKey);
    }
    return false;
  });

  if (partialMatch) {
    return ROUTE_METADATA[partialMatch];
  }

  // Return default metadata
  return ROUTE_METADATA["/"];
}
