import { useState, useRef, useEffect, type ReactNode } from "react";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  comboboxSize?: "sm" | "md" | "lg";
  iconLeft?: ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export default function Combobox({
  options,
  value,
  onChange,
  label,
  placeholder = "Search...",
  error,
  helperText,
  comboboxSize = "md",
  iconLeft,
  disabled = false,
  className = "",
  id,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const comboboxId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const listId = `${comboboxId}-list`;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = isOpen ? searchQuery : selectedOption?.label || "";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const iconSizeStyles = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const baseStyles =
    "w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60";

  const borderStyle = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  const paddingWithIcon = iconLeft ? "pl-10" : "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleOptionClick = (option: ComboboxOption) => {
    onChange?.(option.value);
    setSearchQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement && highlightedElement.scrollIntoView) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={comboboxId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none ${iconSizeStyles[comboboxSize]}`}
          >
            {iconLeft}
          </div>
        )}
        <input
          ref={inputRef}
          id={comboboxId}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseStyles} ${sizeStyles[comboboxSize]} ${borderStyle} ${paddingWithIcon} pr-10`}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-activedescendant={
            highlightedIndex >= 0
              ? `${comboboxId}-option-${highlightedIndex}`
              : undefined
          }
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${comboboxId}-error`
              : helperText
                ? `${comboboxId}-helper`
                : undefined
          }
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <svg
            className={`transition-transform ${iconSizeStyles[comboboxSize]} ${isOpen ? "rotate-180" : ""}`}
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

        {isOpen && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`${comboboxId}-option-${index}`}
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleOptionClick(option)}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    index === highlightedIndex
                      ? "bg-blue-100"
                      : option.value === value
                        ? "bg-blue-50"
                        : "hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 text-center">
                No results found
              </li>
            )}
          </ul>
        )}
      </div>
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
