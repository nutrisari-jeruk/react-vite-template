import { forwardRef, type TextareaHTMLAttributes } from "react";
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        label={label}
        error={error}
        className={className}
        {...props}
      />
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
