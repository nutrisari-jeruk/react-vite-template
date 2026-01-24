import { forwardRef, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        label={label}
        error={error}
        className={className}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
