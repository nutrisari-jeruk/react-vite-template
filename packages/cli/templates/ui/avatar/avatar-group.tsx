import { cn } from "@/utils/cn";
import type { ReactElement } from "react";

type AvatarGroupSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarGroupProps {
  children: ReactElement | ReactElement[];
  max?: number;
  size?: AvatarGroupSize;
  className?: string;
  spacing?: "tight" | "default" | "loose";
}

export function AvatarGroup({
  children,
  max,
  size = "md",
  className,
  spacing = "default",
}: AvatarGroupProps) {
  const childrenArray = Array.isArray(children) ? children : [children];

  const spacingStyles = {
    tight: "-space-x-4",
    default: "-space-x-3",
    loose: "-space-x-2",
  };

  const sizeStyles: Record<AvatarGroupSize, string> = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-12 text-base",
    xl: "size-16 text-lg",
    "2xl": "size-20 text-xl",
  };

  const visibleAvatars = max ? childrenArray.slice(0, max) : childrenArray;
  const remainingCount = max ? childrenArray.length - max : 0;

  return (
    <div className={cn("flex items-center", spacingStyles[spacing], className)}>
      {visibleAvatars.map((child, index) => (
        <div key={index} style={{ zIndex: visibleAvatars.length - index }}>
          {child}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-gray-300 font-semibold text-gray-700",
            sizeStyles[size]
          )}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

export default AvatarGroup;
