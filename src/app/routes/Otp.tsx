import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { OtpForm } from "@/features/auth/components/otp-form";
import { getAccessToken } from "@/features/auth";
import { ROUTES } from "@/config/constants";

const OTP_PENDING_KEY = "otp_pending";
const RESET_OTP_PENDING_KEY = "reset_otp_pending";
const RESET_PASSWORD_TOKEN_KEY = "reset_password_token";
const RESET_PASSWORD_IDENTIFIER_KEY = "reset_password_identifier";

type OtpFlow = "login" | "reset_password";

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const flow: OtpFlow =
    (location.state as { flow?: OtpFlow } | null)?.flow ?? "login";

  // Get expiresIn from location state (passed from login/reset-password redirect)
  // Default to 75 seconds (1 minute 15 seconds) if not provided
  const expiresIn =
    (location.state as { expiresIn?: number } | null)?.expiresIn ?? 75;

  // Get identifier for reset-password flow (username/NIP/NIK)
  const identifier =
    (location.state as { identifier?: string } | null)?.identifier ??
    sessionStorage.getItem(RESET_PASSWORD_IDENTIFIER_KEY) ??
    "";

  // Protect OTP page - only allow access if user came from login with pending OTP
  useEffect(() => {
    const hasRouteStateExpiresIn = !!(
      location.state as { expiresIn?: number } | null
    )?.expiresIn;

    if (flow === "reset_password") {
      const hasPendingFlag =
        sessionStorage.getItem(RESET_OTP_PENDING_KEY) === "true";

      if (!hasRouteStateExpiresIn && !hasPendingFlag) {
        navigate(ROUTES.FORGET_PASSWORD, { replace: true });
        return;
      }

      if (hasRouteStateExpiresIn) {
        sessionStorage.setItem(RESET_OTP_PENDING_KEY, "true");
      }
      return;
    }

    // Default: login OTP flow
    const token = getAccessToken();
    const hasPendingFlag = sessionStorage.getItem(OTP_PENDING_KEY) === "true";

    // No token at all - redirect to login
    if (!token) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    // Has token but no pending OTP (already fully authenticated) - redirect to dashboard
    if (!hasRouteStateExpiresIn && !hasPendingFlag) {
      navigate(ROUTES.DASHBOARD, { replace: true });
      return;
    }

    // Set pending flag if route state exists (for page refresh scenario)
    if (hasRouteStateExpiresIn) {
      sessionStorage.setItem(OTP_PENDING_KEY, "true");
    }
  }, [navigate, location.state, flow]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-blue-600 p-4 sm:p-6 lg:p-12">
      {/* Main Container */}
      <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Illustration */}
          <div className="relative hidden lg:block lg:w-1/2">
            <img
              src="/login.svg"
              alt="RSUD R.T. Notopuro Sidoarjo"
              className="h-full w-full object-cover"
            />
            {/* Logos overlay */}
            <div className="absolute top-6 left-1/2 flex -translate-x-1/2 items-center gap-3">
              <img
                src="/logo-indonesia.png"
                alt="Indonesia"
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <img
                src="/logo-rsud.png"
                alt="RSUD"
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <img
                src="/logo-sidoarjo.png"
                alt="Sidoarjo"
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Right side - OTP form */}
          <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-12 lg:py-16">
            {/* Page Title */}
            <div className="mb-8 text-center">
              <h1 className="text-xl font-bold text-balance text-gray-900 sm:text-2xl">
                Single Sign-On (SSO)
              </h1>
              <p className="mt-1 text-lg font-semibold text-pretty text-gray-900 sm:text-xl">
                RSUD R.T. Notopuro Sidoarjo
              </p>
            </div>

            {/* OTP Form */}
            <OtpForm
              expiresIn={expiresIn}
              mode={flow}
              identifier={flow === "reset_password" ? identifier : undefined}
              onSuccess={() => {
                if (flow === "reset_password") {
                  const resetToken =
                    sessionStorage.getItem(RESET_PASSWORD_TOKEN_KEY) ?? "";
                  if (!resetToken) {
                    navigate(ROUTES.FORGET_PASSWORD, { replace: true });
                    return;
                  }
                  navigate(
                    `${ROUTES.RESET_PASSWORD}?token=${encodeURIComponent(resetToken)}`,
                    { replace: true }
                  );
                  return;
                }

                navigate(ROUTES.DASHBOARD);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
