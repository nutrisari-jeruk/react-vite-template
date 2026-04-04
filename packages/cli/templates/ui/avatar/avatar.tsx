import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type AvatarShape = "circle" | "square";
type StatusPosition = "top-right" | "bottom-right" | "top-left" | "bottom-left";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  shape?: AvatarShape;
  src?: string;
  alt?: string;
  initials?: string;
  status?: boolean;
  statusColor?: "green" | "red" | "yellow" | "gray";
  statusPosition?: StatusPosition;
  backgroundColor?:
    | "blue"
    | "gray"
    | "red"
    | "green"
    | "yellow"
    | "purple"
    | "pink";
}

export function Avatar({
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
  const sizeStyles: Record<AvatarSize, string> = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-12 text-base",
    xl: "size-16 text-lg",
    "2xl": "size-20 text-xl",
  };

  const statusSizes: Record<AvatarSize, string> = {
    xs: "size-1.5",
    sm: "size-2",
    md: "size-2.5",
    lg: "size-3",
    xl: "size-3.5",
    "2xl": "size-4",
  };

  const shapeStyles: Record<AvatarShape, string> = {
    circle: "rounded-full",
    square: "rounded-lg",
  };

  const bgColors = {
    blue: "bg-blue-500",
    gray: "bg-gray-500",
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
  };

  const statusColors = {
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    gray: "bg-gray-400",
  };

  const statusPositions: Record<StatusPosition, string> = {
    "top-right": "top-0 right-0",
    "bottom-right": "bottom-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-left": "bottom-0 left-0",
  };

  return (
    <div className={cn("relative inline-block shrink-0", className)} {...props}>
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
            className="size-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="uppercase">{initials || "?"}</span>
        )}
      </div>

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

export default Avatar;
