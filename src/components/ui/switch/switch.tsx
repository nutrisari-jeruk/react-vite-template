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
          className="relative inline-flex cursor-pointer items-center"
        >
          <input
            type="checkbox"
            id={switchId}
            className="peer sr-only"
            disabled={disabled}
            checked={isChecked}
            onChange={handleChange}
            aria-describedby={helperText ? `${switchId}-helper` : undefined}
            {...props}
          />
          <div
            className={`peer relative flex items-center gap-1 rounded-lg p-0.5 transition-colors peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 ${
              disabled
                ? "cursor-not-allowed bg-gray-200"
                : "bg-gray-200 peer-hover:bg-gray-300"
            } `}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-all ${
                disabled
                  ? "opacity-50"
                  : !isChecked
                    ? "bg-blue-600"
                    : "bg-transparent"
              } `}
            >
              <span
                className={`transition-colors ${
                  disabled
                    ? "text-gray-400"
                    : !isChecked
                      ? "text-white"
                      : "text-gray-500"
                } `}
              >
                {leftIcon}
              </span>
            </div>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-all ${
                disabled
                  ? "opacity-50"
                  : isChecked
                    ? "bg-blue-600"
                    : "bg-transparent"
              } `}
            >
              <span
                className={`transition-colors ${
                  disabled
                    ? "text-gray-400"
                    : isChecked
                      ? "text-white"
                      : "text-gray-500"
                } `}
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
          className="relative inline-flex cursor-pointer items-center"
        >
          <input
            type="checkbox"
            id={switchId}
            className="peer sr-only"
            disabled={disabled}
            checked={isChecked}
            onChange={handleChange}
            aria-describedby={helperText ? `${switchId}-helper` : undefined}
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
