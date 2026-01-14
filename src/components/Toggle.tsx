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

export default function Toggle({
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
            className={`text-sm font-medium select-none transition-colors ${
              disabled
                ? "text-gray-400"
                : !isChecked
                  ? "text-gray-900 font-semibold"
                  : "text-gray-600"
            }`}
          >
            {leftLabel}
          </span>
          <label
            htmlFor={toggleId}
            className="relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              id={toggleId}
              className="sr-only peer"
              disabled={disabled}
              checked={isChecked}
              onChange={handleChange}
              aria-describedby={helperText ? `${toggleId}-helper` : undefined}
              {...props}
            />
            <div
              className={`
                w-11 h-6 rounded-full
                peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2
                peer-checked:after:translate-x-5
                after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                after:bg-white after:rounded-full after:h-5 after:w-5
                after:transition-all
                ${
                  disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : isChecked
                      ? "bg-gray-900"
                      : "bg-gray-300 peer-hover:bg-gray-400"
                }
              `}
            />
          </label>
          <span
            className={`text-sm font-medium select-none transition-colors ${
              disabled
                ? "text-gray-400"
                : isChecked
                  ? "text-gray-900 font-semibold"
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
          className="relative inline-flex items-center cursor-pointer"
        >
          <input
            type="checkbox"
            id={toggleId}
            className="sr-only peer"
            disabled={disabled}
            checked={isChecked}
            onChange={handleChange}
            aria-describedby={helperText ? `${toggleId}-helper` : undefined}
            {...props}
          />
          <div
            className={`
              w-11 h-6 rounded-full
              peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2
              peer-checked:after:translate-x-5
              after:content-[''] after:absolute after:top-0.5 after:left-[2px]
              after:bg-white after:rounded-full after:h-5 after:w-5
              after:transition-all
              ${
                disabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : isChecked
                    ? "bg-blue-600"
                    : "bg-gray-300 peer-hover:bg-gray-400"
              }
            `}
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
