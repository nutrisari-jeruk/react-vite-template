import React, { useId, type ReactNode } from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { Field } from "@base-ui/react/field";
import { cn } from "@/utils/cn";

interface SwitchProps {
  label?: string;
  helperText?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

export function Switch({
  label,
  helperText,
  leftLabel,
  rightLabel,
  leftIcon,
  rightIcon,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  id,
  "aria-label": ariaLabel,
}: SwitchProps) {
  const uniqueId = useId();
  const switchId = id || uniqueId;
  const hasLabels = leftLabel !== undefined && rightLabel !== undefined;
  const hasIcons = leftIcon !== undefined && rightIcon !== undefined;

  const hasContent = hasLabels || hasIcons;
  if (!hasContent) {
    console.warn(
      "Switch requires either leftLabel/rightLabel or leftIcon/rightIcon"
    );
  }

  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked ?? false
  );
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleToggle = (newChecked: boolean) => {
    if (!disabled) {
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Field.Root>
        {label && (
          <Field.Label className="block text-sm font-medium text-gray-700 select-none">
            {label}
          </Field.Label>
        )}
        <BaseSwitch.Root
          id={switchId}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-label={ariaLabel || label || "Segmented control"}
          className="group"
        >
          <div
            className={cn(
              "relative inline-flex items-center gap-1 rounded-lg bg-gray-100 p-0.5",
              "ring-1 ring-gray-200 ring-inset",
              "transition-colors",
              disabled && "cursor-not-allowed opacity-50",
              !disabled &&
                "group-hover:bg-gray-50 group-focus-visible:ring-2 group-focus-visible:ring-blue-500 group-focus-visible:ring-offset-2"
            )}
          >
            {hasLabels && (
              <>
                <button
                  type="button"
                  onClick={() => handleToggle(false)}
                  disabled={disabled}
                  aria-pressed={!isChecked}
                  aria-label={leftLabel}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    disabled ? "cursor-not-allowed" : "cursor-pointer",
                    !isChecked
                      ? "bg-white text-blue-600 shadow-sm"
                      : "bg-transparent text-gray-500",
                    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  )}
                >
                  {leftIcon && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-4",
                        !isChecked ? "text-blue-600" : "text-gray-500"
                      )}
                    >
                      {leftIcon}
                    </span>
                  )}
                  {leftLabel}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(true)}
                  disabled={disabled}
                  aria-pressed={isChecked}
                  aria-label={rightLabel}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    disabled ? "cursor-not-allowed" : "cursor-pointer",
                    isChecked
                      ? "bg-white text-blue-600 shadow-sm"
                      : "bg-transparent text-gray-500",
                    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  )}
                >
                  {rightIcon && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-4",
                        isChecked ? "text-blue-600" : "text-gray-500"
                      )}
                    >
                      {rightIcon}
                    </span>
                  )}
                  {rightLabel}
                </button>
              </>
            )}
            {hasIcons && !hasLabels && (
              <>
                <button
                  type="button"
                  onClick={() => handleToggle(false)}
                  disabled={disabled}
                  aria-pressed={!isChecked}
                  aria-label="Previous option"
                  className={cn(
                    "relative flex size-8 items-center justify-center rounded-md transition-colors",
                    disabled ? "cursor-not-allowed" : "cursor-pointer",
                    !isChecked
                      ? "bg-white text-blue-600 shadow-sm"
                      : "bg-transparent text-gray-500",
                    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  )}
                >
                  <span aria-hidden="true" className="size-5">
                    {leftIcon}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(true)}
                  disabled={disabled}
                  aria-pressed={isChecked}
                  aria-label="Next option"
                  className={cn(
                    "relative flex size-8 items-center justify-center rounded-md transition-colors",
                    disabled ? "cursor-not-allowed" : "cursor-pointer",
                    isChecked
                      ? "bg-white text-blue-600 shadow-sm"
                      : "bg-transparent text-gray-500",
                    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  )}
                >
                  <span aria-hidden="true" className="size-5">
                    {rightIcon}
                  </span>
                </button>
              </>
            )}
          </div>
        </BaseSwitch.Root>
      </Field.Root>
      {helperText && (
        <p id={`${switchId}-helper`} className="text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Switch;
