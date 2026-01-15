import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  textareaSize?: "sm" | "md" | "lg";
}

export function Textarea({
  label,
  error,
  helperText,
  textareaSize = "md",
  className = "",
  id,
  disabled,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const baseStyles =
    "w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 resize-y min-h-[100px]";

  const borderStyle = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`${baseStyles} ${sizeStyles[textareaSize]} ${borderStyle}`}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${textareaId}-error`
            : helperText
              ? `${textareaId}-helper`
              : undefined
        }
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${textareaId}-helper`} className="text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Textarea;
