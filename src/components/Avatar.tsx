import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type AvatarShape = "circle" | "square";
type StatusPosition = "top-right" | "bottom-right" | "top-left" | "bottom-left";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the avatar
   * @default "md"
   */
  size?: AvatarSize;

  /**
   * The shape of the avatar
   * @default "circle"
   */
  shape?: AvatarShape;

  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alt text for the image
   */
  alt?: string;

  /**
   * Initials to display when no image is provided (max 2 characters recommended)
   */
  initials?: string;

  /**
   * Show status indicator
   */
  status?: boolean;

  /**
   * Status indicator color
   * @default "green"
   */
  statusColor?: "green" | "red" | "yellow" | "gray";

  /**
   * Position of status indicator
   * @default "bottom-right"
   */
  statusPosition?: StatusPosition;

  /**
   * Background color for avatar with initials
   * @default "blue"
   */
  backgroundColor?:
    | "blue"
    | "gray"
    | "red"
    | "green"
    | "yellow"
    | "purple"
    | "pink";
}

export default function Avatar({
  size = "md",
  shape = "circle",
  src,
  alt = "Avatar",
  initials,
  status = false,
  statusColor = "green",
  statusPosition = "bottom-right",
  backgroundColor = "blue",
  className,
  ...props
}: AvatarProps) {
  // Size styles
  const sizeStyles: Record<AvatarSize, string> = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    "2xl": "w-20 h-20 text-xl",
  };

  // Status indicator sizes
  const statusSizes: Record<AvatarSize, string> = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
    "2xl": "w-4 h-4",
  };

  // Shape styles
  const shapeStyles: Record<AvatarShape, string> = {
    circle: "rounded-full",
    square: "rounded-lg",
  };

  // Background colors
  const bgColors = {
    blue: "bg-blue-500",
    gray: "bg-gray-500",
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
  };

  // Status colors
  const statusColors = {
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    gray: "bg-gray-400",
  };

  // Status positions
  const statusPositions: Record<StatusPosition, string> = {
    "top-right": "top-0 right-0",
    "bottom-right": "bottom-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-left": "bottom-0 left-0",
  };

  return (
    <div
      className={cn("relative inline-block flex-shrink-0", className)}
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden font-semibold text-white",
          sizeStyles[size],
          shapeStyles[shape],
          !src && bgColors[backgroundColor]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="uppercase">{initials || "?"}</span>
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <span
          className={cn(
            "absolute rounded-full border-2 border-white",
            statusSizes[size],
            statusColors[statusColor],
            statusPositions[statusPosition]
          )}
        />
      )}
    </div>
  );
}
