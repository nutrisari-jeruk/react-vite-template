import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "@/components/layouts";

const Home = lazy(() => import("@/app/routes/Home"));
const About = lazy(() => import("@/app/routes/About"));
const Contact = lazy(() => import("@/app/routes/Contact"));
const Components = lazy(() => import("@/app/routes/Components"));
const ErrorExamples = lazy(() => import("@/app/routes/error-examples"));
const AuthExample = lazy(() => import("@/app/routes/auth-example"));
const FormValidationExample = lazy(
  () => import("@/app/routes/form-validation-example")
);
const NotFound = lazy(() => import("@/app/routes/not-found"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
        path: "contact",
        element: (
          <LazyPage>
            <Contact />
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
        path: "error-examples",
        element: (
          <LazyPage>
            <ErrorExamples />
          </LazyPage>
        ),
      },
      {
        path: "auth-example",
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
