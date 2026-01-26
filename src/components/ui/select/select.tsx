import React from "react";
import type { ReactNode } from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { Field } from "@base-ui/react/field";
import { cn } from "@/utils/cn";

interface SelectOption {
  value: string;
  label: string;
}

/**
 * Select component props
 *
 * @property label - Label text
 * @property error - Error message (automatically applies error styling)
 * @property helperText - Helper text shown below select
 * @property selectSize - Size of the select
 * @property children - Option elements to render
 * @property value - Controlled value
 * @property defaultValue - Default uncontrolled value
 * @property onChange - Value change handler
 * @property disabled - Whether the select is disabled
 */
interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  selectSize?: "sm" | "md" | "lg";
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Select({
  label,
  error,
  helperText,
  selectSize = "md",
  className = "",
  id,
  disabled,
  children,
  value: controlledValue,
  defaultValue,
  onChange,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const options: SelectOption[] = [];
  if (children) {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === "option") {
        const props = child.props as { value?: string; children?: ReactNode };
        options.push({
          value: props.value || "",
          label: props.children?.toString() || "",
        });
      }
    });
  }

  const items = options.map((opt) => ({ value: opt.value, label: opt.label }));

  const isControlled = controlledValue !== undefined;

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const baseStyles =
    "w-full rounded border transition-colors focus:outline-none bg-white cursor-pointer";

  const labelStyle = disabled ? "text-gray-500" : "text-gray-900";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Field.Root>
        {label && (
          <Field.Label className={cn("block text-sm font-medium", labelStyle)}>
            {label}
          </Field.Label>
        )}
        <BaseSelect.Root
          value={isControlled ? (controlledValue ?? null) : undefined}
          defaultValue={defaultValue ?? (options[0]?.value || null)}
          onValueChange={(newValue) => {
            onChange?.(newValue as string);
          }}
          disabled={disabled}
          items={items.length > 0 ? items : undefined}
          id={selectId}
          {...props}
        >
          <BaseSelect.Trigger
            className={(state) =>
              cn(
                baseStyles,
                sizeStyles[selectSize],
                "relative",
                error
                  ? "border-red-500"
                  : disabled
                    ? "border-gray-200 bg-gray-100"
                    : state.open
                      ? "border-2 border-blue-600"
                      : "border-gray-300",
                disabled
                  ? "text-gray-500"
                  : error
                    ? "text-gray-900"
                    : "text-gray-700",
                "pr-10 text-left disabled:cursor-not-allowed"
              )
            }
          >
            <BaseSelect.Value>
              {(value: string | null) => {
                if (!value || value === "") {
                  return options[0]?.label || "";
                }
                const selectedOption = options.find(
                  (opt) => opt.value === value
                );
                return selectedOption?.label || value;
              }}
            </BaseSelect.Value>
            <BaseSelect.Icon
              className={(state) =>
                cn(
                  "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
                  disabled ? "text-gray-500" : "text-gray-700",
                  state.open && "rotate-180"
                )
              }
            >
              <svg
                className="h-5 w-5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </BaseSelect.Icon>
          </BaseSelect.Trigger>
          <BaseSelect.Portal>
            <BaseSelect.Positioner alignItemWithTrigger>
              <BaseSelect.Popup
                className="z-[var(--z-dropdown)]"
                style={{ width: "var(--anchor-width)" }}
              >
                <BaseSelect.List className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                  {options.map((option) => (
                    <BaseSelect.Item
                      key={option.value}
                      value={option.value}
                      className={(state) =>
                        cn(
                          "cursor-pointer px-4 py-2 transition-colors outline-none",
                          state.selected
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                          state.highlighted &&
                            !state.selected &&
                            "bg-blue-50 text-blue-600"
                        )
                      }
                    >
                      <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                    </BaseSelect.Item>
                  ))}
                </BaseSelect.List>
              </BaseSelect.Popup>
            </BaseSelect.Positioner>
          </BaseSelect.Portal>
        </BaseSelect.Root>
      </Field.Root>
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${selectId}-helper`} className="text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Select;
