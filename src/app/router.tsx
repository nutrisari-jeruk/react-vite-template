import { lazy, Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  Navigate,
} from "react-router-dom";
import type { ReactNode } from "react";
import {
  MainLayout,
  LandingLayout,
  AuthLayout,
  AuthenticatedLayout,
} from "@/components/layouts";
import { setPageMetadata, setCanonicalUrl } from "@/utils";
import { getRouteMetadata } from "@/config/routes-metadata";
import { AuthLoader } from "@/features/auth/lib/auth-provider";
import { getAccessToken } from "@/features/auth";

const Home = lazy(() => import("@/app/routes/Home"));
const Login = lazy(() => import("@/app/routes/Login"));
const Register = lazy(() => import("@/app/routes/Register"));
const ForgetPassword = lazy(() => import("@/app/routes/ForgetPassword"));
const ResetPassword = lazy(() => import("@/app/routes/ResetPassword"));
const Otp = lazy(() => import("@/app/routes/Otp"));
const Dashboard = lazy(() => import("@/app/routes/Dashboard"));
const About = lazy(() => import("@/app/routes/About"));
const Components = lazy(() => import("@/app/routes/Components"));
const AuthExample = lazy(() => import("@/app/routes/examples/auth"));
const ErrorExamples = lazy(
  () => import("@/app/routes/examples/error-handling")
);
const FormValidationExample = lazy(
  () => import("@/app/routes/examples/form-validation")
);
const DataTableExample = lazy(() => import("@/app/routes/examples/data-table"));
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
 * ProtectedRoute - Checks token before rendering AuthLoader
 * This ensures redirect happens immediately if no token exists
 */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const hasToken = !!getAccessToken();

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
    // Get metadata for current path
    const metadata = getRouteMetadata(location.pathname);

    // Update page title and description
    setPageMetadata(metadata);

    // Update canonical URL
    const fullUrl = window.location.origin + location.pathname;
    setCanonicalUrl(fullUrl);
  }, [location.pathname]);

  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <MetadataUpdater />
        <LandingLayout />
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <Home />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <>
        <MetadataUpdater />
        <LazyPage>
          <Login />
        </LazyPage>
      </>
    ),
  },
  {
    path: "/otp",
    element: (
      <>
        <MetadataUpdater />
        <LazyPage>
          <Otp />
        </LazyPage>
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <MetadataUpdater />
        <AuthLayout />
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <Register />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: "/forget-password",
    element: (
      <>
        <MetadataUpdater />
        <LazyPage>
          <ForgetPassword />
        </LazyPage>
      </>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <>
        <MetadataUpdater />
        <LazyPage>
          <ResetPassword />
        </LazyPage>
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <MetadataUpdater />
        <LandingLayout />
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <About />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: "/components",
    element: (
      <>
        <MetadataUpdater />
        <MainLayout />
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <Components />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: "/examples",
    element: (
      <>
        <MetadataUpdater />
        <MainLayout />
      </>
    ),
    children: [
      {
        path: "error-handling",
        element: (
          <LazyPage>
            <ErrorExamples />
          </LazyPage>
        ),
      },
      {
        path: "auth",
        element: (
          <LazyPage>
            <AuthExample />
          </LazyPage>
        ),
      },
      {
        path: "form-validation",
        element: (
          <LazyPage>
            <FormValidationExample />
          </LazyPage>
        ),
      },
      {
        path: "data-table",
        element: (
          <LazyPage>
            <DataTableExample />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <>
        <MetadataUpdater />
        <ProtectedRoute>
          <AuthLoader
            renderLoading={() => (
              <div className="flex min-h-dvh items-center justify-center">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
              </div>
            )}
            renderError={() => {
              // Redirect to login on auth error
              window.location.href = "/login";
              return null;
            }}
          >
            <AuthenticatedLayout />
          </AuthLoader>
        </ProtectedRoute>
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <Dashboard />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: "/app",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "*",
    element: (
      <>
        <MetadataUpdater />
        <MainLayout />
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <NotFound />
          </LazyPage>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
