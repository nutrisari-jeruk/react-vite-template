/**
 * Checkbox Component
 *
 * A checkbox input with label, helper text, and error support.
 *
 * @example
 * ```tsx
 * // Basic checkbox
 * <Checkbox label="Accept terms" />
 *
 * // With helper text
 * <Checkbox label="Subscribe" helperText="Get weekly updates" />
 *
 * // With error
 * <Checkbox label="Required field" error="This field is required" />
 *
 * // Controlled
 * const [checked, setChecked] = useState(false);
 * <Checkbox
 *   label="Subscribe"
 *   checked={checked}
 *   onChange={(e) => setChecked(e.target.checked)}
 * />
 * ```
 */

import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/**
 * Checkbox component props
 *
 * @property label - Label text displayed next to checkbox
 * @property helperText - Helper text shown below checkbox
 * @property error - Error message (automatically applies error styling)
 */
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
