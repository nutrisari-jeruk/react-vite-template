/**
 * AuthGuard Component
 * Protects routes that require authentication
 *
 * Uses react-query-auth's useUser hook to check authentication status.
 * Redirects to /login if user is not authenticated.
 *
 * Note: AuthLoader should be used at a higher level to handle initial loading.
 */

import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../lib/auth-provider";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const user = useUser();
  const location = useLocation();

  // user.isLoading should be handled by AuthLoader at a higher level
  if (!user.isLoading && !user.data) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
