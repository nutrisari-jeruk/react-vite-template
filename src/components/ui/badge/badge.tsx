import type { HTMLAttributes } from "react";

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
    default: "bg-gray-200 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-cyan-100 text-cyan-800",
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
    "inline-flex items-center gap-1.5 font-medium leading-none";
  const roundedStyle = pill ? "rounded-full" : "rounded-md";

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${roundedStyle} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-2 h-2 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
