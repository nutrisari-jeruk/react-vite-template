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
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../lib/auth-provider";
import { getAccessToken } from "../lib/token-storage";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const user = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  // Check if there's a token - if not, redirect immediately
  // This is the primary check since useUser() might return {} when not initialized
  const hasToken = !!getAccessToken();

  // Handle case where useUser() returns empty object or invalid structure
  const isLoading = user?.isLoading ?? false;
  const userData = user?.data;
  const userError = user?.error;
  const isError = (user as { isError?: boolean })?.isError ?? !!userError;
  const isValidUserObject =
    user && typeof user === "object" && Object.keys(user).length > 0;

  // PRIMARY CHECK: Immediate redirect if no token (before query even runs)
  // This handles the case when localStorage is cleared
  useEffect(() => {
    if (!hasToken) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        // Use window.location for immediate redirect (bypasses React Router if needed)
        window.location.href = "/login";
      }
      return;
    }
  }, [hasToken, navigate, location]);

  // SECONDARY CHECK: Redirect if query finishes without user data
  // Only runs if token exists (primary check already handled no-token case)
  useEffect(() => {
    // Skip if already redirected
    if (hasRedirected.current || !hasToken) {
      return;
    }

    // Don't redirect while loading (but only if we have a valid user object)
    if (isLoading && isValidUserObject) {
      return;
    }

    // If user object is empty/invalid OR query finished without data OR there's an error
    const shouldRedirect =
      !isValidUserObject || (!isLoading && (!userData || isError));

    if (shouldRedirect) {
      hasRedirected.current = true;
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [
    isLoading,
    userData,
    userError,
    isError,
    hasToken,
    navigate,
    location,
    user,
    isValidUserObject,
  ]);

  // If we're redirecting, show nothing (or a loading state)
  // Primary check: no token
  // Secondary check: invalid user object or query finished without data
  const shouldRedirect =
    !hasToken || !isValidUserObject || (!isLoading && (!userData || isError));

  if (shouldRedirect) {
    // Return null while redirecting (useEffect handles the navigation)
    return null;
  }

  return <>{children}</>;
}
