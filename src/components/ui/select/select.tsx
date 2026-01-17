import React, { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

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
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
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
    "w-full rounded border transition-all focus:outline-none bg-white cursor-pointer";

  const borderStyle = error
    ? "border-red-500"
    : disabled
      ? "border-gray-200 bg-gray-100"
      : isOpen
        ? "border-blue-600 border-2"
        : "border-gray-300";

  const textStyle = disabled
    ? "text-gray-500"
    : error
      ? "text-gray-900"
      : "text-gray-700";

  const labelStyle = disabled ? "text-gray-500" : "text-gray-900";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && listboxRef.current && focusedIndex >= 0) {
      const options = listboxRef.current.querySelectorAll('[role="option"]');
      const focusedOption = options[focusedIndex] as HTMLElement;
      focusedOption?.focus();
    }
  }, [isOpen, focusedIndex]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setFocusedIndex(0);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          const direction = event.key === "ArrowDown" ? 1 : -1;
          const newIndex = Math.max(
            0,
            Math.min(options.length - 1, focusedIndex + direction)
          );
          setFocusedIndex(newIndex);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        } else {
          setIsOpen(true);
          setFocusedIndex(0);
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "Home":
        event.preventDefault();
        if (isOpen) {
          setFocusedIndex(0);
        }
        break;
      case "End":
        event.preventDefault();
        if (isOpen) {
          setFocusedIndex(options.length - 1);
        }
        break;
    }
  };

  const handleSelect = (optionValue: string) => {
    if (!isControlled) {
      setInternalValue(optionValue);
    }
    onChange?.(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)} ref={containerRef}>
      {label && (
        <label
          id={`${selectId}-label`}
          htmlFor={selectId}
          className={cn("text-sm font-medium", labelStyle)}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={selectId}
          ref={buttonRef}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            baseStyles,
            sizeStyles[selectSize],
            borderStyle,
            textStyle,
            "pr-10 text-left disabled:cursor-not-allowed"
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-activedescendant={
            isOpen && focusedIndex >= 0
              ? `${selectId}-option-${focusedIndex}`
              : undefined
          }
          {...props}
        >
          {displayText}
        </button>
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
            disabled ? "text-gray-500" : "text-gray-700"
          )}
        >
          <svg
            className={cn(
              "h-5 w-5 transition-transform",
              isOpen && "rotate-180"
            )}
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
            ref={listboxRef}
            role="listbox"
            tabIndex={-1}
            className="z-dropdown absolute mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isFocused = index === focusedIndex;
              return (
                <li
                  key={option.value}
                  role="option"
                  id={`${selectId}-option-${index}`}
                  aria-selected={isSelected}
                  tabIndex={isFocused ? 0 : -1}
                  onClick={() => handleSelect(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(option.value);
                    }
                  }}
                  className={cn(
                    "cursor-pointer px-4 py-2 transition-colors outline-none",
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                    isFocused && !isSelected && "bg-blue-50 text-blue-600"
                  )}
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
