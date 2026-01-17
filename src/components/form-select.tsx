import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={props.id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <select
          ref={ref}
          className={cn(
            "px-4 py-2 border rounded-lg transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            error
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-gray-400",
            className
          )}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
