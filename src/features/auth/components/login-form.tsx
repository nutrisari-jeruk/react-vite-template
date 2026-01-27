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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {login.error ? (
        <div className="mb-6">
          <Alert variant="error">
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
          className="mb-2.5 block text-base leading-6 font-medium text-[#111928]"
        >
          NIP / NIK Pegawai
        </label>
        <div className="relative">
          <input
            id="username"
            type="text"
            placeholder="Contoh: 14029808221"
            autoComplete="username"
            className={cn(
              "h-[46px] w-full rounded-[6px] border border-[#DFE4EA] bg-white px-5 py-3 text-base text-[#111928] placeholder:text-[#9CA3AF] focus:border-[#3758F9] focus:ring-1 focus:ring-[#3758F9] focus:outline-none",
              errors.username &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            {...register("username")}
          />
        </div>
        {errors.username && (
          <p className="mt-1.5 text-sm text-red-600">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <label
          htmlFor="password"
          className="mb-2.5 block text-base leading-6 font-medium text-[#111928]"
        >
          Kata Sandi
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            className={cn(
              "h-[46px] w-full rounded-[6px] border border-[#DFE4EA] bg-white px-5 py-3 pr-12 text-base text-[#111928] placeholder:text-[#9CA3AF] focus:border-[#3758F9] focus:ring-1 focus:ring-[#3758F9] focus:outline-none",
              errors.password &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[#6B7280] hover:text-gray-600"
          >
            {showPassword ? (
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
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

      {/* Login Button - Pill shape from Figma */}
      <div className="mb-6">
        <button
          type="submit"
          disabled={login.isPending}
          className="h-[50px] w-full rounded-full bg-[#3758F9] px-7 text-base leading-6 font-medium text-white hover:bg-[#2d47d9] focus:ring-2 focus:ring-[#3758F9] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {login.isPending ? "Memproses..." : "Login"}
        </button>
      </div>

      {/* Forgot Password Link */}
      <div className="text-center">
        <a
          href="#"
          className="text-base leading-6 font-normal text-[#111827] hover:text-[#3758F9] hover:underline"
        >
          Lupa Kata Sandi ? Klik Disini
        </a>
      </div>
    </form>
  );
}

type LoginInput = typeof loginInputSchema._input;
