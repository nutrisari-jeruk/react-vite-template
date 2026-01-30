import { Link as RouterLink } from "react-router-dom";
import type { LinkProps as RouterLinkProps } from "react-router-dom";
import { cn } from "@/utils";

export interface LinkProps extends RouterLinkProps {
  variant?: "default" | "primary" | "muted";
}

export function Link({
  to,
  className,
  variant = "default",
  children,
  ...props
}: LinkProps) {
  const variantStyles = {
    default: "text-gray-900 hover:text-gray-700",
    primary: "text-blue-600 hover:text-blue-700",
    muted: "text-gray-500 hover:text-gray-700",
  };

  return (
    <RouterLink
      to={to}
      className={cn("transition-colors", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </RouterLink>
  );
}
