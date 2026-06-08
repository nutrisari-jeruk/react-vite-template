/**
 * Progress Component
 *
 * Progress indicator built on Base UI.
 *
 * @example
 * ```tsx
 * <Progress value={60} max={100} variant="linear" />
 * <Progress value={30} max={100} variant="circular" showValue />
 * ```
 */

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "@/utils/cn";

// ============================================================================
// Types
// ============================================================================

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressVariant = "linear" | "circular";

interface ProgressProps {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  label?: string;
  showValue?: boolean;
  className?: string;
}

// ============================================================================
// Linear Progress
// ============================================================================

const sizeClasses: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const circularSizeClasses: Record<
  ProgressSize,
  { container: string; svg: string }
> = {
  sm: { container: "size-8", svg: "size-8" },
  md: { container: "size-12", svg: "size-12" },
  lg: { container: "size-16", svg: "size-16" },
};

function calculatePercentage(value: number | undefined, max: number): number {
  if (value === undefined || value === null) return 0;
  return Math.min(Math.max((value / max) * 100, 0), 100);
}

function CircularProgress({
  value,
  max,
  size,
  showValue,
}: {
  value: number | undefined;
  max: number;
  size: ProgressSize;
  showValue?: boolean;
}) {
  const percentage = calculatePercentage(value, max);
  const radius = size === "sm" ? 14 : size === "md" ? 22 : 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative inline-flex items-center justify-center",
        circularSizeClasses[size].container
      )}
    >
      <svg
        className={cn(circularSizeClasses[size].svg, "rotate-[-90deg]")}
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-blue-500 transition-all duration-300 ease-out"
        />
      </svg>
      {showValue && (
        <span className="absolute text-xs font-medium text-gray-700 tabular-nums">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Main Progress Component
// ============================================================================

export function Progress({
  value,
  max = 100,
  variant = "linear",
  size = "md",
  label,
  showValue = false,
  className = "",
}: ProgressProps) {
  if (variant === "circular") {
    return (
      <div className={cn("inline-flex", className)}>
        <CircularProgress
          value={value}
          max={max}
          size={size}
          showValue={showValue}
        />
      </div>
    );
  }

  // Linear progress
  const percentage = calculatePercentage(value, max);
  const clampedValue =
    value === undefined ? 0 : Math.min(Math.max(value, 0), max);

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-gray-700 tabular-nums">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <BaseProgress.Root
        value={value ?? 0}
        max={max}
        render={(props) => {
          const { ...restProps } = props as any; // eslint-disable-line @typescript-eslint/no-explicit-any

          return (
            <div
              {...restProps}
              role="progressbar"
              aria-valuenow={clampedValue}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-label={label}
              className={cn(
                "w-full overflow-hidden rounded-full bg-gray-200",
                sizeClasses[size]
              )}
            >
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          );
        }}
      />
    </div>
  );
}

Progress.defaultProps = {
  max: 100,
  variant: "linear",
  size: "md",
  showValue: false,
};

export default Progress;
