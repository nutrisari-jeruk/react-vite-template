import {
  useState,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
  labelPosition?: "left" | "right";
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({
  label,
  leftIcon,
  rightIcon,
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
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked || false
  );
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;
  const uniqueId = useId();

  const hasIcons = leftIcon !== undefined && rightIcon !== undefined;
  const switchId = id || uniqueId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
    onChange?.(e);
  };

  const isLabelLeft = labelPosition === "left";

  if (hasIcons) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {label && (
          <span className="text-sm font-medium text-gray-700 select-none">
            {label}
          </span>
        )}
        <label
          htmlFor={switchId}
          className="relative inline-flex items-center cursor-pointer"
        >
          <input
            type="checkbox"
            id={switchId}
            className="sr-only peer"
            disabled={disabled}
            checked={isChecked}
            onChange={handleChange}
            aria-describedby={helperText ? `${switchId}-helper` : undefined}
            {...props}
          />
          <div
            className={`
              relative flex items-center gap-1 p-0.5 rounded-lg
              peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2
              transition-colors
              ${
                disabled
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-200 peer-hover:bg-gray-300"
              }
            `}
          >
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-md transition-all
                ${
                  disabled
                    ? "opacity-50"
                    : !isChecked
                      ? "bg-blue-600"
                      : "bg-transparent"
                }
              `}
            >
              <span
                className={`
                  transition-colors
                  ${
                    disabled
                      ? "text-gray-400"
                      : !isChecked
                        ? "text-white"
                        : "text-gray-500"
                  }
                `}
              >
                {leftIcon}
              </span>
            </div>
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-md transition-all
                ${
                  disabled
                    ? "opacity-50"
                    : isChecked
                      ? "bg-blue-600"
                      : "bg-transparent"
                }
              `}
            >
              <span
                className={`
                  transition-colors
                  ${
                    disabled
                      ? "text-gray-400"
                      : isChecked
                        ? "text-white"
                        : "text-gray-500"
                  }
                `}
              >
                {rightIcon}
              </span>
            </div>
          </div>
        </label>
        {helperText && (
          <p id={`${switchId}-helper`} className="text-sm text-gray-600">
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
          htmlFor={switchId}
          className="relative inline-flex items-center cursor-pointer"
        >
          <input
            type="checkbox"
            id={switchId}
            className="sr-only peer"
            disabled={disabled}
            checked={isChecked}
            onChange={handleChange}
            aria-describedby={helperText ? `${switchId}-helper` : undefined}
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
          id={`${switchId}-helper`}
          className={`text-sm text-gray-600 ${isLabelLeft ? "ml-0" : "ml-14"}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Switch;
