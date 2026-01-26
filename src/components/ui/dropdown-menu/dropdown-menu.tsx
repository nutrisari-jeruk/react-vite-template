/**
 * DropdownMenu Component
 *
 * An accessible dropdown menu component built on Base UI.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger>
 *     <Button>Options</Button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem onSelect={() => console.log('Edit')}>
 *       Edit
 *     </DropdownMenuItem>
 *     <DropdownMenuItem onSelect={() => console.log('Delete')}>
 *       Delete
 *     </DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */

import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { cn } from "@/utils/cn";

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  className?: string;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownMenu({
  children,
  open,
  onOpenChange,
}: DropdownMenuProps) {
  return (
    <Menu.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Menu.Root>
  );
}

export function DropdownMenuTrigger({
  children,
}: {
  children: React.ReactElement;
}) {
  return <Menu.Trigger render={children} />;
}

export function DropdownMenuContent({
  children,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  className,
}: DropdownMenuContentProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner side={side} sideOffset={sideOffset} align={align}>
        <Menu.Popup
          className={cn(
            "z-50 min-w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg",
            "data-starting-style:animate-in data-starting-style:fade-in data-starting-style:zoom-in-95",
            "data-ending-style:animate-out data-ending-style:fade-out data-ending-style:zoom-out-95",
            className
          )}
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export function DropdownMenuItem({
  children,
  onSelect,
  disabled = false,
  destructive = false,
  className,
}: DropdownMenuItemProps) {
  return (
    <Menu.Item
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors outline-none select-none",
        "focus:bg-gray-100 focus:text-gray-900",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        destructive
          ? "text-red-600 focus:bg-red-50 focus:text-red-700"
          : "text-gray-700",
        className
      )}
    >
      {children}
    </Menu.Item>
  );
}

export function DropdownMenuCheckboxItem({
  children,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Menu.CheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 py-2 pr-3 pl-8 text-sm transition-colors outline-none select-none",
        "focus:bg-gray-100 focus:text-gray-900",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <Menu.CheckboxItemIndicator>
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </Menu.CheckboxItemIndicator>
      </span>
      {children}
    </Menu.CheckboxItem>
  );
}

export function DropdownMenuRadioGroup({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Menu.RadioGroup value={value} onValueChange={onValueChange}>
      {children}
    </Menu.RadioGroup>
  );
}

export function DropdownMenuRadioItem({
  children,
  value,
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Menu.RadioItem
      value={value}
      disabled={disabled}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 py-2 pr-3 pl-8 text-sm transition-colors outline-none select-none",
        "focus:bg-gray-100 focus:text-gray-900",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <Menu.RadioItemIndicator>
          <svg className="size-2 fill-current" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="4" />
          </svg>
        </Menu.RadioItemIndicator>
      </span>
      {children}
    </Menu.RadioItem>
  );
}

export function DropdownMenuSeparator({
  className,
}: DropdownMenuSeparatorProps) {
  return (
    <Menu.Separator className={cn("-mx-1 my-1 h-px bg-gray-200", className)} />
  );
}

export function DropdownMenuLabel({
  children,
  className,
}: DropdownMenuLabelProps) {
  return (
    <div
      className={cn(
        "px-3 py-1.5 text-xs font-semibold text-gray-500",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <div className="py-1">{children}</div>;
}

export default DropdownMenu;
