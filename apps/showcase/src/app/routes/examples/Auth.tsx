import { useUser, useLogout, LoginForm } from "@/features/auth";
import { Button } from "@/components/ui";

export default function AuthExample() {
  const { data: user, isLoading } = useUser();
  const logout = useLogout();
  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Authentication Example</h1>
      {isLoading ? (
        <p role="status">Loading session...</p>
      ) : user ? (
        <>
          <p className="mb-4">Welcome back, {user.name}!</p>
          <Button
            loading={logout.isPending}
            onClick={() => logout.mutate(undefined)}
          >
            Sign Out
          </Button>
          {logout.error && (
            <p role="alert">
              Server logout failed. Your local session has been cleared.
            </p>
          )}
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
