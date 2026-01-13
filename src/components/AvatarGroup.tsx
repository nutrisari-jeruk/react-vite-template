import { cn } from "@/utils/cn";
import type { ReactElement } from "react";

type AvatarGroupSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarGroupProps {
  /**
   * Avatar components to display in the group
   */
  children: ReactElement | ReactElement[];

  /**
   * Maximum number of avatars to display before showing "+X" indicator
   * @default undefined (show all)
   */
  max?: number;

  /**
   * Size of the avatars
   * @default "md"
   */
  size?: AvatarGroupSize;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Spacing between avatars (negative margin)
   * @default "default"
   */
  spacing?: "tight" | "default" | "loose";
}

export default function AvatarGroup({
  children,
  max,
  size = "md",
  className,
  spacing = "default",
}: AvatarGroupProps) {
  const childrenArray = Array.isArray(children) ? children : [children];

  // Spacing styles (negative margin-left for overlap)
  const spacingStyles = {
    tight: "-space-x-4",
    default: "-space-x-3",
    loose: "-space-x-2",
  };

  // Size styles for the "+X" indicator
  const sizeStyles: Record<AvatarGroupSize, string> = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    "2xl": "w-20 h-20 text-xl",
  };

  const visibleAvatars = max ? childrenArray.slice(0, max) : childrenArray;
  const remainingCount = max ? childrenArray.length - max : 0;

  return (
    <div className={cn("flex items-center", spacingStyles[spacing], className)}>
      {visibleAvatars.map((child, index) => (
        <div
          key={index}
          className="ring-2 ring-white"
          style={{ zIndex: visibleAvatars.length - index }}
        >
          {child}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-gray-300 font-semibold text-gray-700 ring-2 ring-white",
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
