import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Alert, Button, Input } from "@/components";
import { cn } from "@/utils/cn";
import { useRegister, registerInputSchema } from "../lib/auth-provider";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerMutation.mutateAsync(data);
      onSuccess?.();
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {registerMutation.error ? (
        <Alert variant="error">
          <span>
            {registerMutation.error instanceof Error
              ? registerMutation.error.message
              : "Registration failed. Please try again."}
          </span>
        </Alert>
      ) : null}

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Full Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          className={cn(errors.name && "border-red-500")}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className={cn(errors.email && "border-red-500")}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          className={cn(errors.password && "border-red-500")}
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Must be at least 6 characters.
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

type RegisterInput = typeof registerInputSchema._input;
