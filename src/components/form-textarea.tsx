import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={props.id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <textarea
          ref={ref}
          className={cn(
            "resize-none rounded-lg border px-4 py-2 transition-colors",
            "focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
            error
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-gray-400",
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
