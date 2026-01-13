import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  helperText?: string;
  error?: string;
}

export default function Checkbox({
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
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={checkboxId}
          className="mt-0.5 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p id={`${checkboxId}-error`} className="text-sm text-red-600 ml-7">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${checkboxId}-helper`} className="text-sm text-gray-600 ml-7">
          {helperText}
        </p>
      )}
    </div>
  );
}
