/**
 * Badge Component
 *
 * Small count and labeling component with multiple variants.
 *
 * @example
 * ```tsx
 * // Basic badge
 * <Badge>New</Badge>
 *
 * // Different variants
 * <Badge variant="primary">Primary</Badge>
 * <Badge variant="success">Success</Badge>
 * <Badge variant="danger">Error</Badge>
 *
 * // With dot indicator
 * <Badge dot>Online</Badge>
 *
 * // Pill shape
 * <Badge pill>Rounded</Badge>
 * ```
 */

import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/**
 * Badge component props
 *
 * @property variant - Visual style variant
 * @property dot - Shows a dot indicator
 * @property pill - Uses pill/rounded shape
 */
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  pill?: boolean;
  dot?: boolean;
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  size = "md",
  pill = false,
  dot = false,
  children,
  className = "",
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const variantStyles = {
    default: "bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-600/20",
    primary: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10",
    success: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
    warning:
      "bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20",
    danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
    info: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-600/20",
  };

  const dotColors = {
    default: "bg-gray-500",
    primary: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    info: "bg-cyan-500",
  };

  const baseStyles =
    "inline-flex items-center gap-1.5 font-medium leading-none transition-colors";
  const roundedStyle = pill ? "rounded-full" : "rounded-md";

  return (
    <span
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        roundedStyle,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("size-2 rounded-full", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
