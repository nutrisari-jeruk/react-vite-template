import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "error" | "success";
  inputSize?: "sm" | "md" | "lg";
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function Input({
  variant = "default",
  inputSize = "md",
  label,
  error,
  helperText,
  iconLeft,
  iconRight,
  className = "",
  id,
  disabled,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const effectiveVariant = error ? "error" : variant;

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const iconSizeStyles = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  const variantStyles = {
    default:
      "border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50",
    success:
      "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50",
  };

  const baseStyles =
    "w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60";

  const paddingWithIcon = iconLeft ? "pl-10" : iconRight ? "pr-10" : "";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500",
              iconSizeStyles[inputSize]
            )}
          >
            {iconLeft}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            baseStyles,
            sizeStyles[inputSize],
            variantStyles[effectiveVariant],
            paddingWithIcon
          )}
          disabled={disabled}
          aria-invalid={effectiveVariant === "error"}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />
        {iconRight && (
          <div
            className={cn(
              "absolute top-1/2 right-3 -translate-y-1/2 text-gray-500",
              iconSizeStyles[inputSize]
            )}
          >
            {iconRight}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
