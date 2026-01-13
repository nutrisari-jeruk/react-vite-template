import { useState, type InputHTMLAttributes } from "react";

interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  helperText?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export default function Switch({
  label,
  helperText,
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

  const switchId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
    onChange?.(e);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-3">
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
        {label && (
          <span className="text-sm font-medium text-gray-700 select-none">
            {label}
          </span>
        )}
      </div>
      {helperText && (
        <p id={`${switchId}-helper`} className="text-sm text-gray-600 ml-14">
          {helperText}
        </p>
      )}
    </div>
  );
}
