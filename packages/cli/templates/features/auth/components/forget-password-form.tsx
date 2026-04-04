import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Alert, Link } from "@/components/ui";
import { getFieldErrors, getErrorMessage } from "@/lib/api-error";
import { resetPassword } from "@/features/auth";
import { ROUTES } from "@/config/constants";
import { z } from "zod";

const forgetPasswordInputSchema = z.object({
  nipNik: z.string().min(1, "NIP / NIK wajib diisi"),
});

type ForgetPasswordInput = z.infer<typeof forgetPasswordInputSchema>;

const ALERT_TIMEOUT_MS = 3000;

const RESET_OTP_PENDING_KEY = "reset_otp_pending";
const RESET_PASSWORD_TOKEN_KEY = "reset_password_token";
const RESET_PASSWORD_IDENTIFIER_KEY = "reset_password_identifier";

export function ForgetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgetPasswordInput>({
    resolver: zodResolver(forgetPasswordInputSchema),
    defaultValues: {
      nipNik: "",
    },
  });

  const onSubmit = async (data: ForgetPasswordInput) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      const response = await resetPassword({ username: data.nipNik });
      const message = response.otp.isRequired
        ? "Kode OTP telah dikirim ke WhatsApp Anda. Silakan periksa pesan WhatsApp Anda."
        : "Silakan masukkan kata sandi baru Anda.";
      setSuccessMessage(message);

      // Always force OTP step first (even before user can set a new password)
      if (response.otp.isRequired) {
        // Clear any previous reset-token so we don't accidentally reuse it
        sessionStorage.removeItem(RESET_PASSWORD_TOKEN_KEY);
        // Store identifier (username/NIP/NIK) for resend OTP functionality
        sessionStorage.setItem(RESET_PASSWORD_IDENTIFIER_KEY, data.nipNik);
        // Mark reset-password OTP as pending (for refresh scenario)
        sessionStorage.setItem(RESET_OTP_PENDING_KEY, "true");

        navigate(ROUTES.OTP, {
          state: {
            flow: "reset_password",
            expiresIn: response.otp.expiresIn,
            identifier: data.nipNik,
          },
        });
        return;
      }

      // Fallback (if backend ever disables OTP): go directly to reset password page if token exists
      if (response.resetToken) {
        navigate(
          `${ROUTES.RESET_PASSWORD}?token=${encodeURIComponent(response.resetToken)}`
        );
      }
    } catch (error) {
      const fieldErrors = getFieldErrors(error);

      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          if (field === "username" || field === "nipNik") {
            setError("nipNik", { type: "server", message });
          }
        });
      } else {
        const errorMessage = getErrorMessage(error);
        setError("nipNik", {
          type: "server",
          message: errorMessage || "Terjadi kesalahan saat reset kata sandi",
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-md"
      >
        {/* Instruction Text */}
        <p className="mb-6 text-center text-sm text-pretty text-gray-600 sm:text-base">
          Silahkan masukkan NIP / NIK untuk melanjutkan proses reset kata sandi
          Anda.
        </p>

        {/* NIP / NIK Input */}
        <Input
          id="nipNik"
          label="NIP / NIK Pegawai"
          placeholder="Masukkan NIP / NIK Anda"
          autoComplete="username"
          error={errors.nipNik?.message}
          className="mb-8"
          {...register("nipNik")}
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
        <p className="text-center text-sm text-pretty text-gray-900 sm:text-base">
          Kembali ke Halaman Login ?{" "}
          <Link
            to={ROUTES.LOGIN}
            variant="primary"
            className="font-medium hover:underline"
          >
            Klik Disini
          </Link>
        </p>
      </form>
    </>
  );
}
