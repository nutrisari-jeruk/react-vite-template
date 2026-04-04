import { LoginForm } from "@/features/auth/components";
import { ImageWithFallback } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-blue-600 p-4 sm:p-6 lg:p-12">
      {/* Main Container */}
      <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Illustration */}
          <div className="relative hidden lg:block lg:w-1/2">
            <ImageWithFallback
              src="/login.svg"
              alt="Ilustrasi login medis"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right side - Login form */}
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

            {/* Login Form */}
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
