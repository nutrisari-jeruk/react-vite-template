import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function Checkbox({
  label,
  helperText,
  error,
  className = "",
  id,
  disabled,
  ...props
}: CheckboxProps) {
  const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={checkboxId}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${checkboxId}-error`
              : helperText
                ? `${checkboxId}-helper`
                : undefined
          }
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="cursor-pointer text-sm font-medium text-gray-700 select-none"
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p id={`${checkboxId}-error`} className="ml-7 text-sm text-red-600">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${checkboxId}-helper`} className="ml-7 text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Checkbox;
