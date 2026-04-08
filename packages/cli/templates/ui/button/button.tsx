/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and states.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variant and size
 * <Button variant="primary" size="lg">Large Primary</Button>
 *
 * // White variant (for dark/colored backgrounds)
 * <Button variant="white">White Button</Button>
 * <Button variant="outline-white">Outline White</Button>
 *
 * // Loading state
 * <Button loading>Saving...</Button>
 *
 * // With icons
 * <Button iconLeft={<SaveIcon />}>Save</Button>
 * <Button iconOnly={<EditIcon />} ariaLabel="Edit" />
 *
 * // Link-style buttons (for actions, not navigation)
 * <Button variant="link">Cancel</Button>
 * <Button variant="link-primary">Learn more</Button>
 * <Button variant="link-muted">Dismiss</Button>
 * ```
 */

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/**
 * Button component props
 *
 * @property variant - Visual style variant (link variants for actions that look like links)
 * @property size - Button size
 * @property loading - Shows loading spinner and disables button
 * @property iconLeft - Icon to display on the left
 * @property iconRight - Icon to display on the right
 * @property iconOnly - Icon-only button (no text)
 * @property ariaLabel - Accessible label (required for iconOnly buttons)
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "outline-primary"
    | "outline-secondary"
    | "outline-danger"
    | "white"
    | "outline-white"
    | "link"
    | "link-primary"
    | "link-muted";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?: React.ReactNode;
  ariaLabel?: string;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  iconRight,
  iconOnly,
  ariaLabel,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isLinkVariant = variant?.startsWith("link");

  const baseStyles = isLinkVariant
    ? "font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2"
    : "rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2";

  const sizeStyles = isLinkVariant
    ? {
        sm: "text-sm",
        md: "",
        lg: "text-lg",
      }
    : {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-2",
        lg: "px-8 py-3 text-lg",
      };

  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    "outline-primary":
      "border-2 border-blue-500 text-blue-500 hover:bg-blue-50",
    "outline-secondary":
      "border-2 border-gray-400 text-gray-700 hover:bg-gray-50",
    "outline-danger": "border-2 border-red-500 text-red-500 hover:bg-red-50",
    white: "bg-white text-indigo-600 hover:bg-gray-50",
    "outline-white": "border-2 border-white text-white hover:bg-white/10",
    link: "text-gray-900 hover:text-gray-700 hover:underline",
    "link-primary": "text-blue-600 hover:text-blue-700 hover:underline",
    "link-muted": "text-gray-500 hover:text-gray-700 hover:underline",
  };

  const iconOnlyStyles = iconOnly ? "p-2" : "";

  const LoadingSpinner = () => (
    <svg
      className="h-5 w-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      className={cn(
        baseStyles,
        iconOnly ? iconOnlyStyles : sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={disabled || loading}
      aria-label={
        iconOnly
          ? ariaLabel || props["aria-label"] || "Button"
          : props["aria-label"]
      }
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && iconLeft && iconLeft}
      {iconOnly || children}
      {!loading && iconRight && iconRight}
    </button>
  );
}

export default Button;
