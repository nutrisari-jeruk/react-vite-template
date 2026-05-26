import { LoginForm } from "@/features/auth/components";
import { AuthBranding } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh">
      <div className="hidden flex-col justify-between bg-blue-600 p-12 text-white lg:flex lg:w-1/2">
        <div />
        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-balance">
            Hospital Information System
          </h1>
          <p className="mt-4 text-lg text-pretty text-blue-100">
            Sistem informasi manajemen rumah sakit terintegrasi untuk layanan
            kesehatan yang lebih baik.
          </p>
        </div>
        <p className="text-sm text-blue-200">
          &copy; {new Date().getFullYear()} RSUD R.T. Notopuro Sidoarjo
        </p>
      </div>
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <AuthBranding subtitle="RSUD R.T. Notopuro Sidoarjo" />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
