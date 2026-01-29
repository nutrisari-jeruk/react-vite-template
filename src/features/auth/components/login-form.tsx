import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@/components/ui";
import { getFieldErrors, getErrorMessage } from "@/lib/api-error";
import { loginInputSchema } from "../lib/auth-provider";
import { loginWithEmailAndPassword } from "../api/auth-api";
import { setAccessToken } from "../lib/token-storage";
import { ROUTES } from "@/config/constants";

interface LoginFormProps {
  onSuccess?: (requiresOtp: boolean, expiresIn?: number) => void;
  defaultUsername?: string;
  defaultPassword?: string;
}

export function LoginForm({
  onSuccess,
  defaultUsername = "",
  defaultPassword = "",
}: LoginFormProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      username: defaultUsername,
      password: defaultPassword,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setFormError(null);
      clearErrors();
      const authResponse = await loginWithEmailAndPassword(data);

      // Store token
      setAccessToken(authResponse.token);

      // Check if OTP is required
      if (authResponse.otp.isRequired) {
        // Set OTP pending flag in sessionStorage
        sessionStorage.setItem("otp_pending", "true");
        // Redirect to OTP page with expiresIn
        navigate(ROUTES.OTP, {
          state: { expiresIn: authResponse.otp.expiresIn },
        });
        onSuccess?.(true, authResponse.otp.expiresIn);
      } else {
        // Redirect to dashboard
        navigate(ROUTES.DASHBOARD);
        onSuccess?.(false);
      }
    } catch (error) {
      // Try to get field-level errors from API response
      const fieldErrors = getFieldErrors(error);

      if (fieldErrors) {
        // Map API field errors to form fields
        Object.entries(fieldErrors).forEach(([field, message]) => {
          if (field === "username" || field === "password") {
            setError(field, { type: "server", message });
          }
        });
      } else {
        // Show form-level error for non-field-specific errors
        setFormError(getErrorMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-md">
      {/* Form-level error */}
      {formError && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {formError}
        </div>
      )}

      {/* NIP / NIK Input */}
      <Input
        id="username"
        label="NIP / NIK Pegawai"
        placeholder="Contoh: 14029808221"
        autoComplete="username"
        error={errors.username?.message}
        className="mb-5"
        {...register("username")}
      />

      {/* Password Input */}
      <Input
        id="password"
        label="Kata Sandi"
        type={showPassword ? "text" : "password"}
        placeholder="********"
        autoComplete="current-password"
        error={errors.password?.message}
        className="mb-8"
        iconRight={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                focusable="false"
                aria-hidden="true"
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
                focusable="false"
                aria-hidden="true"
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
        }
        {...register("password")}
      />

      {/* Login Button */}
      <Button
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        className="w-full"
      >
        {isLoading ? "Memproses..." : "Login"}
      </Button>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-sm text-gray-400">atau</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Forgot Password Link */}
      <p className="text-center text-sm text-pretty text-gray-900 sm:text-base">
        Lupa Kata Sandi ?{" "}
        <button
          type="button"
          onClick={() => navigate(ROUTES.FORGET_PASSWORD)}
          className="font-medium text-blue-600 hover:underline"
        >
          Klik Disini
        </button>
      </p>
    </form>
  );
}

type LoginInput = typeof loginInputSchema._input;
