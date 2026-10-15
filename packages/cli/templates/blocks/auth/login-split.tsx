import { LoginForm } from "@/features/auth/components";
import { AuthBranding } from "@/components/ui/auth-branding";
import { AuthIllustration } from "@/components/ui/auth-illustration";

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh bg-blue-600 p-6 lg:grid-cols-2">
      <AuthIllustration className="hidden lg:block" />
      <section className="mx-auto flex w-full max-w-md flex-col justify-center rounded-lg bg-white p-8">
        <AuthBranding title="Sign in" />
        <LoginForm />
      </section>
    </main>
  );
}
