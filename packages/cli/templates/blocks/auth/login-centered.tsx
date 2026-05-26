import { LoginForm } from "@/features/auth/components";
import { AuthBranding } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <AuthBranding subtitle="RSUD R.T. Notopuro Sidoarjo" />
        <LoginForm />
      </div>
    </div>
  );
}
