import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Alert } from "@/components";
import { cn } from "@/utils/cn";
import { useLogin, loginInputSchema } from "../lib/auth-provider";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login.mutateAsync(data);
      onSuccess?.();
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-md">
      {login.error ? (
        <div className="mb-6">
          <Alert variant="danger">
            <span>
              {login.error instanceof Error
                ? login.error.message
                : "Login gagal. Silakan periksa kredensial Anda."}
            </span>
          </Alert>
        </div>
      ) : null}

      {/* NIP / NIK Input */}
      <div className="mb-5">
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-medium text-[#111928] sm:text-base"
        >
          NIP / NIK Pegawai
        </label>
        <input
          id="username"
          type="text"
          placeholder="Contoh: 14029808221"
          autoComplete="username"
          className={cn(
            "h-12 w-full rounded-md border border-[#DFE4EA] bg-white px-4 text-base text-[#111928] transition-colors placeholder:text-[#9CA3AF] focus:border-[#3758F9] focus:ring-1 focus:ring-[#3758F9] focus:outline-none",
            errors.username &&
              "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
          {...register("username")}
        />
        {errors.username && (
          <p className="mt-1.5 text-sm text-red-600">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="mb-8">
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-[#111928] sm:text-base"
        >
          Kata Sandi
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            autoComplete="current-password"
            className={cn(
              "h-12 w-full rounded-md border border-[#DFE4EA] bg-white px-4 pr-12 text-base text-[#111928] transition-colors placeholder:text-[#9CA3AF] focus:border-[#3758F9] focus:ring-1 focus:ring-[#3758F9] focus:outline-none",
              errors.password &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={login.isPending}
        className="h-12 w-full rounded-full bg-[#3758F9] text-base font-medium text-white transition-colors hover:bg-[#2d47d9] focus:ring-2 focus:ring-[#3758F9] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {login.isPending ? "Memproses..." : "Login"}
      </button>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#DFE4EA]" />
        <span className="text-sm text-[#9CA3AF]">atau</span>
        <div className="h-px flex-1 bg-[#DFE4EA]" />
      </div>

      {/* Forgot Password Link */}
      <p className="text-center text-sm text-[#111827] sm:text-base">
        Lupa Kata Sandi ?{" "}
        <a href="#" className="font-medium text-[#3758F9] hover:underline">
          Klik Disini
        </a>
      </p>
    </form>
  );
}

type LoginInput = typeof loginInputSchema._input;
