import { useState, useId, type InputHTMLAttributes } from "react";

interface ToggleProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  helperText?: string;
  labelPosition?: "left" | "right";
  onCheckedChange?: (checked: boolean) => void;
}

export function Toggle({
  label,
  leftLabel,
  rightLabel,
  helperText,
  labelPosition = "right",
  className = "",
  id,
  disabled,
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  onChange,
  ...props
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked || false
  );
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;
  const uniqueId = useId();

  const hasDualLabels = leftLabel !== undefined && rightLabel !== undefined;
  const toggleId = id || uniqueId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
    onChange?.(e);
  };

  const isLabelLeft = labelPosition === "left";

  if (hasDualLabels) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium transition-colors select-none ${
              disabled
                ? "text-gray-400"
                : !isChecked
                  ? "font-semibold text-gray-900"
                  : "text-gray-600"
            }`}
          >
            {leftLabel}
          </span>
          <label
            htmlFor={toggleId}
            className="relative inline-flex cursor-pointer items-center"
          >
            <input
              type="checkbox"
              id={toggleId}
              className="peer sr-only"
              disabled={disabled}
              checked={isChecked}
              onChange={handleChange}
              aria-describedby={helperText ? `${toggleId}-helper` : undefined}
              {...props}
            />
            <div
              className={`peer h-6 w-11 rounded-full peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5 ${
                disabled
                  ? "cursor-not-allowed bg-gray-300"
                  : isChecked
                    ? "bg-gray-900"
                    : "bg-gray-300 peer-hover:bg-gray-400"
              } `}
            />
          </label>
          <span
            className={`text-sm font-medium transition-colors select-none ${
              disabled
                ? "text-gray-400"
                : isChecked
                  ? "font-semibold text-gray-900"
                  : "text-gray-600"
            }`}
          >
            {rightLabel}
          </span>
        </div>
        {helperText && (
          <p id={`${toggleId}-helper`} className="text-sm text-gray-600">
            {helperText}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-3">
        {label && isLabelLeft && (
          <span className="text-sm font-medium text-gray-700 select-none">
            {label}
          </span>
        )}
        <label
          htmlFor={toggleId}
          className="relative inline-flex cursor-pointer items-center"
        >
          <input
            type="checkbox"
            id={toggleId}
            className="peer sr-only"
            disabled={disabled}
            checked={isChecked}
            onChange={handleChange}
            aria-describedby={helperText ? `${toggleId}-helper` : undefined}
            {...props}
          />
          <div
            className={`peer h-6 w-11 rounded-full peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5 ${
              disabled
                ? "cursor-not-allowed bg-gray-300"
                : isChecked
                  ? "bg-blue-600"
                  : "bg-gray-300 peer-hover:bg-gray-400"
            } `}
          />
        </label>
        {label && !isLabelLeft && (
          <span className="text-sm font-medium text-gray-700 select-none">
            {label}
          </span>
        )}
      </div>
      {helperText && (
        <p
          id={`${toggleId}-helper`}
          className={`text-sm text-gray-600 ${isLabelLeft ? "ml-0" : "ml-14"}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Toggle;
