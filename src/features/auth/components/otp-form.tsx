import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "@/components/ui";
import { getFieldErrors, getErrorMessage } from "@/lib/api-error";
import {
  verifyOtp,
  resendOtp,
  resendResetPasswordOtp,
  validateResetPasswordOtp,
} from "../api/auth-api";
import { useCountdown } from "@/hooks";
import { setAccessToken } from "../lib/token-storage";
import { QUERY_KEYS } from "@/config/constants";
import { z } from "zod";

const otpInputSchema = z.object({
  otp: z
    .string()
    .min(1, "Kode OTP wajib diisi")
    .regex(/^\d{6}$/, "Kode OTP harus 6 digit angka"),
});

type OtpInput = z.infer<typeof otpInputSchema>;

interface OtpFormProps {
  expiresIn: number; // Initial countdown time in seconds
  mode?: "login" | "reset_password";
  identifier?: string; // Username/NIP/NIK for reset-password resend OTP
  onSuccess?: () => void;
}

const OTP_PENDING_KEY = "otp_pending";
const RESET_OTP_PENDING_KEY = "reset_otp_pending";
const RESET_PASSWORD_TOKEN_KEY = "reset_password_token";

export function OtpForm({
  expiresIn,
  mode = "login",
  identifier,
  onSuccess,
}: OtpFormProps) {
  const countdownStorageKey =
    mode === "reset_password"
      ? "reset_otp_countdown_remaining"
      : "otp_countdown_remaining";
  const queryClient = useQueryClient();
  const [initialExpiresIn, setInitialExpiresIn] = useState(expiresIn);
  const { minutes, seconds, isActive, reset } = useCountdown(initialExpiresIn, {
    storageKey: countdownStorageKey,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpInputSchema),
    defaultValues: {
      otp: "",
    },
  });

  const verifyLoginOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (response) => {
      if (response.token) {
        setAccessToken(response.token);
        // Remove OTP pending flag
        sessionStorage.removeItem(OTP_PENDING_KEY);
        sessionStorage.removeItem(countdownStorageKey);
        // Invalidate user query to refetch user data
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });
      }
      onSuccess?.();
    },
    onError: (error) => {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors?.otp) {
        setError("otp", { type: "server", message: fieldErrors.otp });
      } else {
        const message = getErrorMessage(error);
        setError("otp", { type: "server", message });
      }
    },
  });

  const verifyResetPasswordOtpMutation = useMutation({
    mutationFn: (payload: { otp: string }) => {
      if (!identifier) {
        throw new Error("Missing identifier for reset password OTP validation");
      }
      return validateResetPasswordOtp({
        otp: payload.otp,
        purpose: "password_reset",
        identifier,
      });
    },
    onSuccess: (response) => {
      // reset token comes back as `data.identifier`
      if (response.identifier) {
        sessionStorage.setItem(RESET_PASSWORD_TOKEN_KEY, response.identifier);
      }
      sessionStorage.removeItem(RESET_OTP_PENDING_KEY);
      sessionStorage.removeItem(countdownStorageKey);
      // Keep identifier in sessionStorage for potential resend, will be cleared after successful password reset
      onSuccess?.();
    },
    onError: (error) => {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors?.otp) {
        setError("otp", { type: "server", message: fieldErrors.otp });
      } else {
        const message = getErrorMessage(error);
        setError("otp", { type: "server", message });
      }
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: () => resendOtp(),
    onSuccess: (response) => {
      setInitialExpiresIn(response.expiresIn);
      reset(response.expiresIn);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      setError("otp", { type: "server", message });
    },
  });

  const resendResetPasswordOtpMutation = useMutation({
    mutationFn: () =>
      resendResetPasswordOtp({
        purpose: "password_reset",
        identifier: identifier!,
      }),
    onSuccess: (response) => {
      setInitialExpiresIn(response.otp.expiresIn);
      reset(response.otp.expiresIn);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      setError("otp", { type: "server", message });
    },
  });

  const onSubmit = async (data: OtpInput) => {
    if (mode === "reset_password") {
      verifyResetPasswordOtpMutation.mutate({ otp: data.otp });
    } else {
      verifyLoginOtpMutation.mutate({ otp: data.otp });
    }
  };

  const handleResend = () => {
    if (mode === "reset_password" && identifier) {
      resendResetPasswordOtpMutation.mutate();
    } else {
      resendOtpMutation.mutate();
    }
  };

  const isResendPending =
    mode === "reset_password" && identifier
      ? resendResetPasswordOtpMutation.isPending
      : resendOtpMutation.isPending;

  const formatTime = (mins: number, secs: number): string => {
    if (mins === 0 && secs === 0) {
      return "";
    }
    if (mins === 0) {
      return `${secs} detik`;
    }
    if (secs === 0) {
      return `${mins} menit`;
    }
    return `${mins} menit ${secs} detik`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-md">
      {/* Instructions */}
      <p className="mb-6 text-center text-sm text-pretty text-gray-600 sm:text-base">
        Silahkan masukkan kode OTP yang telah dikirimkan ke perangkat Anda untuk
        melanjutkan.
      </p>

      {/* OTP Input */}
      <Input
        id="otp"
        label="Kode OTP"
        placeholder="Masukkan Kode OTP"
        autoComplete="one-time-code"
        error={errors.otp?.message}
        className="mb-6"
        maxLength={6}
        inputMode="numeric"
        {...register("otp")}
      />

      {/* Resend Timer / Resend Link */}
      <div className="mb-4 text-center">
        <span className="text-sm text-pretty text-gray-600">
          Belum mendapatkan kode OTP?{" "}
        </span>
        {isActive ? (
          <span className="text-sm font-bold text-pretty text-gray-600">
            Tunggu {formatTime(minutes, seconds)}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResendPending}
            className="text-sm font-medium text-blue-600 hover:underline disabled:no-underline disabled:opacity-60"
          >
            {isResendPending ? "Mengirim ulang..." : "Kirim ulang"}
          </button>
        )}
      </div>

      {/* Validate Button */}
      <Button
        type="submit"
        disabled={
          mode === "reset_password"
            ? verifyResetPasswordOtpMutation.isPending
            : verifyLoginOtpMutation.isPending
        }
        loading={
          mode === "reset_password"
            ? verifyResetPasswordOtpMutation.isPending
            : verifyLoginOtpMutation.isPending
        }
        className="w-full"
      >
        {mode === "reset_password"
          ? verifyResetPasswordOtpMutation.isPending
            ? "Memproses..."
            : "Validasi Kode OTP"
          : verifyLoginOtpMutation.isPending
            ? "Memproses..."
            : "Validasi Kode OTP"}
      </Button>
    </form>
  );
}
