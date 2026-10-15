import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "@/libs/tokenStorage";
import { ROUTES } from "@/config/constants";
import { useUser } from "../lib/AuthProvider";

export function AuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const user = useUser();
  if (!getAccessToken())
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  if (sessionStorage.getItem("otp_pending"))
    return <Navigate to={ROUTES.OTP} replace />;
  if (user.isLoading) return <div role="status">Loading session...</div>;
  if (!user.data)
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  return <>{children}</>;
}
