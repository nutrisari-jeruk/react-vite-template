import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/features/auth/components";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#2563EB] p-4 sm:p-6 lg:p-12">
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

          {/* Right side - Login form */}
          <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-12 lg:py-16">
            {/* Page Title */}
            <div className="mb-8 text-center">
              <h1 className="text-xl font-bold text-[#111827] sm:text-2xl">
                Single Sign-On (SSO)
              </h1>
              <p className="mt-1 text-lg font-semibold text-[#111827] sm:text-xl">
                RSUD R.T. Notopuro Sidoarjo
              </p>
            </div>

            {/* Login Form */}
            <LoginForm onSuccess={() => navigate("/dashboard")} />
          </div>
        </div>
      </div>
    </div>
  );
}
