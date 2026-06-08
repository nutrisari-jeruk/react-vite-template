/**
 * Spinner Component
 *
 * Loading indicator with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Spinner size="md" variant="spinner" />
 * <Spinner size="lg" variant="dots" label="Loading data..." />
 * ```
 */

import * as React from "react";
import { cn } from "@/utils/cn";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "spinner" | "dots" | "bars";

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

const dotSizeClasses: Record<SpinnerSize, string> = {
  xs: "h-1 w-1",
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
  xl: "h-3 w-3",
};

const barSizeClasses: Record<SpinnerSize, { container: string; bar: string }> =
  {
    xs: { container: "h-3 w-4 gap-0.5", bar: "w-0.5" },
    sm: { container: "h-4 w-5 gap-0.5", bar: "w-0.5" },
    md: { container: "h-5 w-6 gap-1", bar: "w-1" },
    lg: { container: "h-6 w-7 gap-1", bar: "w-1" },
    xl: { container: "h-8 w-10 gap-1.5", bar: "w-1.5" },
  };

export function Spinner({
  size = "md",
  variant = "spinner",
  label,
  className = "",
}: SpinnerProps) {
  const prefersReducedMotion = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  if (variant === "spinner") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={cn("inline-flex items-center", className)}
      >
        <svg
          className={cn(
            "animate-spin",
            sizeClasses[size],
            !prefersReducedMotion && "text-gray-400"
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
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
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }

  if (variant === "dots") {
    const dotDelay = [0, 200, 400];

    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={cn("inline-flex items-center gap-1", className)}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-current",
              dotSizeClasses[size],
              !prefersReducedMotion && "animate-pulse"
            )}
            style={
              !prefersReducedMotion
                ? { animationDelay: `${dotDelay[i]}ms` }
                : undefined
            }
            aria-hidden="true"
          />
        ))}
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }

  if (variant === "bars") {
    const barDelay = [0, 200, 400];

    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={cn(
          "inline-flex items-center",
          barSizeClasses[size].container,
          className
        )}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-current",
              barSizeClasses[size].bar,
              !prefersReducedMotion && "animate-pulse"
            )}
            style={
              !prefersReducedMotion
                ? { animationDelay: `${barDelay[i]}ms` }
                : undefined
            }
            aria-hidden="true"
          />
        ))}
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }

  return null;
}

Spinner.defaultProps = {
  size: "md",
  variant: "spinner",
};

export default Spinner;
