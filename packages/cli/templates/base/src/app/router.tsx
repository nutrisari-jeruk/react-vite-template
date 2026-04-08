import { lazy, Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import type { ReactNode } from "react";
import { setPageMetadata, setCanonicalUrl } from "@/utils";
import { getRouteMetadata } from "@/config/routes-metadata";

// --- FRONTIER-FE: LAZY IMPORTS ---
const NotFound = lazy(() => import("@/app/routes/not-found"));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
    </div>
  );
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

/**
 * ProtectedRoute - Redirects to login if no auth token exists
 */
function ProtectedRoute({ children }: { children: ReactNode }) {
  // NOTE: Uncomment when auth feature is added:
  // import { getAccessToken } from "@/features/auth";
  // const hasToken = !!getAccessToken();
  const hasToken = true;

  useEffect(() => {
    if (!hasToken) {
      window.location.href = "/login";
    }
  }, [hasToken]);

  if (!hasToken) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Updates page metadata based on the current route.
 */
function MetadataUpdater() {
  const location = useLocation();

  useEffect(() => {
    const metadata = getRouteMetadata(location.pathname);
    setPageMetadata(metadata);
    const fullUrl = window.location.origin + location.pathname;
    setCanonicalUrl(fullUrl);
  }, [location.pathname]);

  return null;
}

const router = createBrowserRouter([
  // --- FRONTIER-FE: ROUTES ---
  {
    path: "*",
    element: (
      <>
        <MetadataUpdater />
        <LazyPage>
          <NotFound />
        </LazyPage>
      </>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
