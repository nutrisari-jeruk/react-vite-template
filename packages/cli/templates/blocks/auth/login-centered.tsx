import { LoginForm } from "@/features/auth/components";
import { AuthBranding } from "@/components/ui/auth-branding";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-50 p-6">
      <section className="mx-auto flex w-full max-w-md flex-col justify-center rounded-lg bg-white p-8">
        <AuthBranding title="Sign in" />
        <LoginForm />
      </section>
    </main>
  );
}
