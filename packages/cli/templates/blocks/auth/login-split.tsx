import { LoginForm } from "@/features/auth/components";
import { AuthBranding, AuthIllustration } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-blue-600 p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none">
        <div className="flex flex-col lg:flex-row">
          <AuthIllustration />
          <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-12 lg:py-16">
            <AuthBranding subtitle="RSUD R.T. Notopuro Sidoarjo" />
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
