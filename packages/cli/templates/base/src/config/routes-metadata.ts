/**
 * Route metadata configuration.
 * Maps route paths to their page titles and descriptions.
 */

export interface RouteMetadata {
  title: string;
  description: string;
}

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  // --- FRONTIER-FE: ROUTE METADATA ---
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
  return {
    title: "App",
    description: "Application",
  };
}
