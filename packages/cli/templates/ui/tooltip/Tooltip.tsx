import * as React from "react";
import { Tooltip as BaseTooltipNamespace } from "@base-ui/react/tooltip";
import { cn } from "@/utils/cn";

// Type assertion for Base UI Tooltip namespace structure
const BaseTooltip = BaseTooltipNamespace as typeof BaseTooltipNamespace & {
  Provider: React.ElementType<Record<string, unknown>>;
  Root: React.ElementType<Record<string, unknown>>;
  Trigger: React.ElementType<Record<string, unknown>>;
  Portal: React.ElementType<Record<string, unknown>>;
  Positioner: React.ElementType<Record<string, unknown>>;
  Popup: React.ElementType<Record<string, unknown>>;
  Arrow: React.ElementType<Record<string, unknown>>;
};

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  variant?: "dark" | "light";
  placement?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export function Tooltip({
  children,
  content,
  variant = "dark",
  placement = "top",
  sideOffset = 8,
  disabled = false,
  className,
  triggerClassName,
}: TooltipProps) {
  const variantStyles = {
    dark: "bg-gray-900 text-white",
    light: "bg-white text-gray-900",
  };

  const baseStyles =
    "rounded-md px-3 py-1.5 text-sm font-medium leading-none z-[var(--z-tooltip)] max-w-xs";

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root disabled={disabled}>
        <BaseTooltip.Trigger
          className={cn("inline-flex", triggerClassName)}
          render={
            React.isValidElement(children)
              ? children
              : ({ ...props }) => <span {...props}>{children}</span>
          }
        />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner
            side={placement}
            sideOffset={sideOffset}
            arrowPadding={6}
          >
            <BaseTooltip.Popup
              className={cn(baseStyles, variantStyles[variant], className)}
              data-tooltip-variant={variant}
            >
              {content}
              <BaseTooltip.Arrow
                className="tooltip-arrow"
                data-tooltip-variant={variant}
              />
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

export default Tooltip;
