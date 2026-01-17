import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "outlined" | "elevated" | "flat";
  title?: string;
  description?: string;
}

const variantStyles = {
  default: "bg-white shadow-md",
  outlined: "bg-white border-2 border-gray-200",
  elevated: "bg-white shadow-lg shadow-gray-300/50",
  flat: "bg-gray-50 shadow-none",
};

export function Card({
  children,
  variant = "default",
  title,
  description,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={cn("rounded-lg p-6", variantStyles[variant], className)}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="mb-2 text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
