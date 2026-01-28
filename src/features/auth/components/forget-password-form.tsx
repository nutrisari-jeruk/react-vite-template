import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Alert } from "@/components/ui";
import { getFieldErrors, getErrorMessage } from "@/lib/api-error";
import { resetPassword } from "@/features/auth";
import { z } from "zod";

const forgetPasswordInputSchema = z.object({
  nipNik: z.string().min(1, "NIP / NIK wajib diisi"),
});

type ForgetPasswordInput = z.infer<typeof forgetPasswordInputSchema>;

const ALERT_TIMEOUT_MS = 3000;
const NAVIGATE_DELAY_MS = 1500;

interface ForgetPasswordFormProps {
  onBackToLogin?: () => void;
}

export function ForgetPasswordForm({ onBackToLogin }: ForgetPasswordFormProps) {
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

      const token = response.resetToken;
      if (token) {
        setTimeout(() => {
          navigate(`/reset-password?token=${encodeURIComponent(token)}`);
        }, NAVIGATE_DELAY_MS);
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
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-medium text-blue-600 hover:underline"
          >
            Klik Disini
          </button>
        </p>
      </form>
    </>
  );
}
