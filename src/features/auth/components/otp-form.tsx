import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "@/components/ui";
import { getFieldErrors, getErrorMessage } from "@/lib/api-error";
import { verifyOtp, resendOtp } from "../api/auth-api";
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
  onSuccess?: () => void;
}

export function OtpForm({ expiresIn, onSuccess }: OtpFormProps) {
  const countdownStorageKey = "otp_countdown_remaining";
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

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (response) => {
      if (response.token) {
        setAccessToken(response.token);
        // Remove OTP pending flag
        sessionStorage.removeItem("otp_pending");
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

  const resendOtpMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: (response) => {
      setInitialExpiresIn(response.expiresIn);
      reset(response.expiresIn);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      setError("otp", { type: "server", message });
    },
  });

  const onSubmit = async (data: OtpInput) => {
    verifyOtpMutation.mutate({ otp: data.otp });
  };

  const handleResend = () => {
    resendOtpMutation.mutate();
  };

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
      <div className="mb-8 text-center">
        <span className="text-sm text-pretty text-gray-600 sm:text-base">
          Belum mendapatkan kode OTP?{" "}
        </span>
        {isActive ? (
          <span className="text-sm font-bold text-pretty text-gray-600 sm:text-base">
            Tunggu {formatTime(minutes, seconds)}
          </span>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleResend}
            loading={resendOtpMutation.isPending}
            className="bg-transparent px-0 py-0 text-blue-600 hover:bg-transparent hover:text-blue-700 hover:underline"
          >
            {resendOtpMutation.isPending ? "Mengirim ulang..." : "Kirim ulang"}
          </Button>
        )}
      </div>

      {/* Validate Button */}
      <Button
        type="submit"
        disabled={verifyOtpMutation.isPending}
        loading={verifyOtpMutation.isPending}
        className="w-full"
      >
        {verifyOtpMutation.isPending ? "Memproses..." : "Validasi Kode OTP"}
      </Button>
    </form>
  );
}
