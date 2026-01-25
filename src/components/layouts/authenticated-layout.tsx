import { Outlet } from "react-router-dom";
import { AuthGuard } from "@/features/auth";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

/**
 * AuthenticatedLayout
 *
 * Wraps routes that require authentication. Combines AuthGuard protection
 * with the main layout structure. Use this for protected routes like
 * dashboard, settings, profile, etc.
 */
export function AuthenticatedLayout() {
  return (
    <AuthGuard>
      <div className="flex min-h-dvh bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-1 flex-col">
          <main className="grow p-4 md:p-6 dark:text-white">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </AuthGuard>
  );
}

export default AuthenticatedLayout;
