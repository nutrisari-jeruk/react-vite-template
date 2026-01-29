import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button, Input, Alert } from "@/components/ui";
import { getFieldErrors, getErrorMessage } from "@/lib/api-error";
import { setNewPassword } from "@/features/auth";
import { cn } from "@/utils/cn";
import { z } from "zod";
import { useSearchParams, useNavigate } from "react-router-dom";

const resetPasswordInputSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Minimal 8 karakter")
      .regex(/[A-Z]/, "Mengandung huruf besar")
      .regex(/[a-z]/, "Mengandung huruf kecil")
      .regex(/[0-9]/, "Mengandung angka")
      .regex(/[^A-Za-z0-9]/, "Mengandung karakter spesial"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

const ALERT_TIMEOUT_MS = 3000;
const NAVIGATE_DELAY_MS = 2000;
const RESET_PASSWORD_TOKEN_KEY = "reset_password_token";
const RESET_PASSWORD_IDENTIFIER_KEY = "reset_password_identifier";

interface ResetPasswordFormProps {
  onBackToLogin?: () => void;
}

export function ResetPasswordForm({ onBackToLogin }: ResetPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const resetToken = searchParams.get("token");

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordInputSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword") ?? "";
  const hasTyped = newPasswordValue.length > 0;

  const requirements = [
    {
      label: "Minimal 8 karakter",
      met: newPasswordValue.length >= 8,
    },
    {
      label: "Mengandung huruf besar & kecil",
      met: /[A-Z]/.test(newPasswordValue) && /[a-z]/.test(newPasswordValue),
    },
    {
      label: "Mengandung angka",
      met: /[0-9]/.test(newPasswordValue),
    },
    {
      label: "Mengandung karakter spesial",
      met: /[^A-Za-z0-9]/.test(newPasswordValue),
    },
  ];

  const onSubmit = async (data: ResetPasswordInput) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!resetToken) {
      setErrorMessage(
        "Token reset tidak ditemukan. Silakan ulangi proses reset kata sandi."
      );
      setTimeout(() => navigate("/forget-password"), NAVIGATE_DELAY_MS);
      return;
    }

    setIsSubmitting(true);
    try {
      await setNewPassword({
        resetToken,
        password: data.newPassword,
        passwordConfirmation: data.confirmPassword,
      });

      setSuccessMessage(
        "Kata sandi berhasil direset. Silakan login dengan kata sandi baru Anda."
      );
      // Clean up reset password session storage
      sessionStorage.removeItem(RESET_PASSWORD_TOKEN_KEY);
      sessionStorage.removeItem(RESET_PASSWORD_IDENTIFIER_KEY);
      setTimeout(() => navigate("/login"), NAVIGATE_DELAY_MS);
    } catch (error) {
      const fieldErrors = getFieldErrors(error);

      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          if (field === "password") {
            setError("newPassword", { type: "server", message });
          } else if (field === "passwordConfirmation") {
            setError("confirmPassword", { type: "server", message });
          }
        });
      } else {
        const msg = getErrorMessage(error);
        setError("newPassword", {
          type: "server",
          message: msg || "Terjadi kesalahan saat reset kata sandi",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {successMessage && (
        <Alert
          variant="success"
          title="Reset Kata Sandi"
          dismissible
          onDismiss={() => setSuccessMessage(null)}
          floating
          position="top-right"
          timeout={ALERT_TIMEOUT_MS}
          className="mb-6"
        >
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          variant="error"
          title="Reset Kata Sandi"
          dismissible
          onDismiss={() => setErrorMessage(null)}
          floating
          position="top-right"
          timeout={ALERT_TIMEOUT_MS}
          className="mb-6"
        >
          {errorMessage}
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-md"
      >
        {/* Instruction Text */}
        <p className="mb-6 text-center text-sm text-pretty text-gray-600 sm:text-base">
          Silahkan masukkan kata sandi baru Anda dengan ketentuan sebagai
          berikut:
        </p>

        {/* Password Requirements */}
        <ul className="mb-6 space-y-2 text-sm text-gray-700" role="list">
          {requirements.map(({ label, met }) => {
            const showBullet = !hasTyped;
            const showCheck = hasTyped && met;
            const showCross = hasTyped && !met;

            return (
              <li
                key={label}
                className={cn(
                  "flex items-start gap-2 transition-colors",
                  showCheck && "text-green-700",
                  showCross && "text-red-700",
                  showBullet && "text-gray-600"
                )}
              >
                {showBullet && (
                  <span
                    className="mt-0.5 shrink-0 text-blue-600"
                    aria-hidden="true"
                  >
                    •
                  </span>
                )}
                {showCheck && (
                  <span
                    className="mt-0.5 shrink-0 text-green-600"
                    aria-hidden="true"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
                {showCross && (
                  <span
                    className="mt-0.5 shrink-0 text-red-600"
                    aria-hidden="true"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                )}
                <span className={cn(showCheck && "font-medium")}>{label}</span>
              </li>
            );
          })}
        </ul>

        {/* New Password Input */}
        <Input
          id="newPassword"
          label="Kata Sandi Baru"
          type={showNewPassword ? "text" : "password"}
          placeholder="Masukkan Kata Sandi Baru Anda"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          className="mb-5"
          iconRight={
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="text-gray-400 transition-colors hover:text-gray-600"
              aria-label={
                showNewPassword
                  ? "Sembunyikan kata sandi"
                  : "Tampilkan kata sandi"
              }
            >
              {showNewPassword ? (
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
          }
          {...register("newPassword")}
        />

        {/* Confirm Password Input */}
        <Input
          id="confirmPassword"
          label="Konfirmasi Kata Sandi Baru"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Masukkan Ulang Kata Sandi Baru Anda"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          className="mb-8"
          iconRight={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 transition-colors hover:text-gray-600"
              aria-label={
                showConfirmPassword
                  ? "Sembunyikan kata sandi"
                  : "Tampilkan kata sandi"
              }
            >
              {showConfirmPassword ? (
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
          }
          {...register("confirmPassword")}
        />

        {/* Reset Password Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Memproses..." : "Reset Kata Sandi"}
        </Button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">atau</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Back to Login Link */}
        {onBackToLogin && (
          <p className="text-center text-sm text-pretty text-gray-900 sm:text-base">
            Kembali ke Halaman Login ?{" "}
            <button
              type="button"
              onClick={onBackToLogin}
              className="font-medium text-blue-600 hover:underline"
            >
              Klik Disini
            </button>
          </p>
        )}
      </form>
    </>
  );
}
