import { LoginForm } from "@/features/auth/components";
import { AuthBranding } from "@/components/ui/auth-branding";

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh md:grid-cols-2">
      <aside className="flex items-center justify-center bg-gray-100 p-12">
        <AuthBranding title="Welcome" subtitle="Sign in to your account" />
      </aside>
      <section className="mx-auto flex w-full max-w-md flex-col justify-center rounded-lg bg-white p-8">
        <AuthBranding title="Sign in" />
        <LoginForm />
      </section>
    </main>
  );
}
