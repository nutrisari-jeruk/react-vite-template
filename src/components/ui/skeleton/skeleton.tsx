/**
 * Skeleton Component
 *
 * Loading placeholder component that displays animated shimmer effect.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Skeleton className="h-4 w-32" />
 *
 * // Card skeleton
 * <Card>
 *   <Skeleton className="h-48 w-full" />
 *   <div className="space-y-2 p-4">
 *     <Skeleton className="h-4 w-3/4" />
 *     <Skeleton className="h-4 w-1/2" />
 *   </div>
 * </Card>
 * ```
 */

import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "text" | "circular" | "rectangular";
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  variant = "default",
  animation = "pulse",
  className,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    default: "rounded-md",
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-none",
  };

  const animationStyles = {
    pulse: "animate-pulse",
    wave: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
    none: "",
  };

  return (
    <div
      className={cn(
        "bg-gray-200",
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={cn(
            "h-4",
            index === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-gray-200 p-4", className)}>
      <Skeleton className="mb-4 h-48 w-full" />
      <Skeleton className="mb-2 h-6 w-3/4" />
      <SkeletonText lines={2} />
    </div>
  );
}

export default Skeleton;
