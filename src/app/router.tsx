import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "@/components/layouts";

const Home = lazy(() => import("@/app/routes/Home"));
const About = lazy(() => import("@/app/routes/About"));
const Components = lazy(() => import("@/app/routes/Components"));
const AuthExample = lazy(() => import("@/app/routes/examples/auth"));
const ErrorExamples = lazy(
  () => import("@/app/routes/examples/error-handling")
);
const FormValidationExample = lazy(
  () => import("@/app/routes/examples/form-validation")
);
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <Home />
          </LazyPage>
        ),
      },
      {
        path: "about",
        element: (
          <LazyPage>
            <About />
          </LazyPage>
        ),
      },
      {
        path: "components",
        element: (
          <LazyPage>
            <Components />
          </LazyPage>
        ),
      },
      {
        path: "examples/error-handling",
        element: (
          <LazyPage>
            <ErrorExamples />
          </LazyPage>
        ),
      },
      {
        path: "examples/auth",
        element: (
          <LazyPage>
            <AuthExample />
          </LazyPage>
        ),
      },
      {
        path: "examples/form-validation",
        element: (
          <LazyPage>
            <FormValidationExample />
          </LazyPage>
        ),
      },
      {
        path: "*",
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
