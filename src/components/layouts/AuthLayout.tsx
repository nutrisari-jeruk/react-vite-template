import { Outlet } from "react-router-dom";

/**
 * AuthLayout
 *
 * A centered card layout for authentication pages (login, register).
 * No navbar or sidebar - just a clean centered container for auth forms.
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            React Template
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
