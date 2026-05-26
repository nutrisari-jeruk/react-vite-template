import { lazy, Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
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
