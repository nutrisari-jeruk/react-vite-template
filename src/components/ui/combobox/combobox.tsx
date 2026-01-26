import type { ReactNode } from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Field } from "@base-ui/react/field";
import { cn } from "@/utils/cn";

/**
 * Combobox option type
 */
export interface ComboboxOption {
  value: string;
  label: string;
}

/**
 * Combobox component props
 *
 * @property options - Array of selectable options
 * @property value - Controlled value
 * @property onChange - Value change handler
 * @property placeholder - Placeholder text
 * @property label - Label text
 * @property error - Error message (automatically applies error styling)
 * @property helperText - Helper text shown below combobox
 * @property disabled - Whether combobox is disabled
 * @property iconLeft - Icon to display on the left
 * @property comboboxSize - Size of the combobox
 */
interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  iconLeft?: ReactNode;
  className?: string;
  id?: string;
  comboboxSize?: "sm" | "md" | "lg";
}

const SIZE_STYLES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
} as const;

const ICON_SIZE_STYLES = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

export function Combobox({
  options,
  value: controlledValue,
  onChange,
  placeholder = "Select...",
  label,
  error,
  helperText,
  disabled = false,
  iconLeft,
  className,
  id,
  comboboxSize = "md",
}: ComboboxProps) {
  const comboboxId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  const isControlled = controlledValue !== undefined;

  const itemToStringLabel = (x: ComboboxOption | string | null): string => {
    if (x == null) return "";
    if (typeof x === "string") {
      return options.find((o) => o.value === x)?.label ?? x;
    }
    if (typeof x === "object" && "label" in x) {
      return x.label ?? "";
    }
    return "";
  };

  const isItemEqualToValue = (
    a: ComboboxOption | string,
    b: string | ComboboxOption | null
  ): boolean => {
    if (b == null) return false;

    const aVal =
      typeof a === "object" && a != null && "value" in a ? a.value : String(a);
    const bVal =
      typeof b === "object" && b != null && "value" in b ? b.value : String(b);

    return aVal === bVal;
  };

  const baseStyles =
    "w-full rounded border bg-white transition-colors focus:outline-none focus:ring-2";

  const variantStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : disabled
      ? "border-gray-200 bg-gray-100"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20";

  const textStyles = disabled
    ? "text-gray-500"
    : error
      ? "text-gray-900"
      : "text-gray-700";
  const labelStyle = disabled ? "text-gray-500" : "text-gray-900";
  const paddingWithIcon = iconLeft ? "pl-10" : "";
  const paddingRight = "pr-10";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Field.Root>
        {label && (
          <Field.Label className={cn("block text-sm font-medium", labelStyle)}>
            {label}
          </Field.Label>
        )}
        <BaseCombobox.Root
          value={isControlled ? (controlledValue ?? null) : undefined}
          onValueChange={(v) => onChange?.(v as string)}
          disabled={disabled}
          items={options}
          itemToStringLabel={itemToStringLabel}
          isItemEqualToValue={isItemEqualToValue}
          id={comboboxId}
        >
          <div className="relative">
            {iconLeft && (
              <div
                className={cn(
                  "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500",
                  ICON_SIZE_STYLES[comboboxSize]
                )}
              >
                {iconLeft}
              </div>
            )}
            <BaseCombobox.Input
              className={(state) =>
                cn(
                  baseStyles,
                  SIZE_STYLES[comboboxSize],
                  variantStyles,
                  textStyles,
                  paddingWithIcon,
                  paddingRight,
                  disabled && "cursor-not-allowed opacity-60",
                  state.focused && !disabled && !error && "border-blue-500"
                )
              }
              placeholder={placeholder}
              aria-invalid={!!error}
              aria-describedby={
                error
                  ? `${comboboxId}-error`
                  : helperText
                    ? `${comboboxId}-helper`
                    : undefined
              }
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
              <BaseCombobox.Clear
                className="rounded p-0.5 text-gray-400 ring-2 ring-transparent transition-colors hover:bg-gray-100 hover:text-gray-600 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none disabled:pointer-events-none"
                aria-label="Clear selection"
              >
                <svg
                  className={ICON_SIZE_STYLES[comboboxSize]}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </BaseCombobox.Clear>
              <div className="pointer-events-none text-gray-400" aria-hidden>
                <svg
                  className={ICON_SIZE_STYLES[comboboxSize]}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <BaseCombobox.Portal>
            <BaseCombobox.Positioner>
              <BaseCombobox.Popup
                className="z-50"
                style={{ width: "var(--anchor-width)" }}
              >
                <BaseCombobox.Empty className="px-4 py-2 text-sm text-gray-500">
                  No results found
                </BaseCombobox.Empty>
                <BaseCombobox.List className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white py-1 shadow-lg">
                  {(item: ComboboxOption) => (
                    <BaseCombobox.Item
                      key={item.value}
                      value={item.value}
                      className={(state) =>
                        cn(
                          "cursor-pointer px-4 py-2 text-sm transition-colors outline-none",
                          state.selected
                            ? "bg-blue-600 font-medium text-white"
                            : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                          state.highlighted &&
                            !state.selected &&
                            "bg-blue-50 text-blue-600"
                        )
                      }
                    >
                      {item.label}
                    </BaseCombobox.Item>
                  )}
                </BaseCombobox.List>
              </BaseCombobox.Popup>
            </BaseCombobox.Positioner>
          </BaseCombobox.Portal>
        </BaseCombobox.Root>
      </Field.Root>
      {error && (
        <p id={`${comboboxId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${comboboxId}-helper`} className="text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Combobox;
