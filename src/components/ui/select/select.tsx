import React, { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
}

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
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

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

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || options[0]?.label || "";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const baseStyles =
    "w-full rounded-[5.5px] border border-[1px] transition-all focus:outline-none bg-white cursor-pointer";

  const borderStyle = error
    ? "border-red-500"
    : disabled
      ? "border-[#F3F4F6] bg-[#E5E7EB]"
      : isOpen
        ? "border-[#3758F9] border-[1.5px] rounded-[5.25px]"
        : "border-[#DFE4EA]";

  const textStyle = disabled
    ? "text-[#6B7280]"
    : error
      ? "text-gray-900"
      : "text-[#637381]";

  const labelStyle = disabled ? "text-[#6B7280]" : "text-[#111928]";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    if (!isControlled) {
      setInternalValue(optionValue);
    }
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={selectId}
          className={`text-sm font-medium ${labelStyle}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={selectId}
          onClick={handleToggle}
          disabled={disabled}
          className={`${baseStyles} ${sizeStyles[selectSize]} ${borderStyle} ${textStyle} pr-10 text-left disabled:cursor-not-allowed`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          {...props}
        >
          {displayText}
        </button>
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
            disabled ? "text-[#6B7280]" : "text-primary-text"
          }`}
        >
          <svg
            className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
        </div>

        {isOpen && !disabled && (
          <ul
            role="listbox"
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-[6px] border border-[#DFE4EA] bg-white shadow-lg"
            style={{
              boxShadow:
                "0px 1px 3px 0px rgba(166, 175, 195, 0.4), 0px 1px 2px 0px rgba(166, 175, 195, 0.4)",
            }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`cursor-pointer px-4 py-2 transition-colors ${
                    isSelected
                      ? "bg-[#3758F9] text-white"
                      : "text-primary-text bg-white hover:bg-blue-50 hover:text-[#3758F9]"
                  }`}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
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
