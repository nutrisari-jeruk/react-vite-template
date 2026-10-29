/**
 * Dialog Component
 *
 * An accessible modal dialog component built on Base UI.
 *
 * @example
 * ```tsx
 * <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *   <DialogTrigger>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent title="Dialog Title">
 *     <p>Dialog content goes here</p>
 *   </DialogContent>
 * </Dialog>
 * ```
 */

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "@/utils/cn";

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

interface DialogContentProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
  className?: string;
  onClose?: () => void;
}

interface DialogTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full mx-4",
};

export function Dialog({
  children,
  open,
  onOpenChange,
  defaultOpen,
}: DialogProps) {
  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
    >
      {children}
    </BaseDialog.Root>
  );
}

export function DialogTrigger({
  children,
  asChild = true,
}: DialogTriggerProps) {
  return (
    <BaseDialog.Trigger render={asChild ? children : undefined}>
      {!asChild && children}
    </BaseDialog.Trigger>
  );
}

export function DialogContent({
  children,
  title,
  description,
  size = "md",
  showClose = true,
  className,
  onClose,
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-[var(--z-modal)] bg-black/50 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
      <BaseDialog.Viewport className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
        <BaseDialog.Popup
          className={cn(
            "relative w-full rounded-lg bg-white shadow-xl transition-all duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 motion-reduce:transition-none",
            sizeClasses[size],
            className
          )}
        >
          {/* Header */}
          {(title || description || showClose) && (
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex-1">
                {title && (
                  <BaseDialog.Title className="text-lg font-semibold text-balance text-gray-900">
                    {title}
                  </BaseDialog.Title>
                )}
                {description && (
                  <BaseDialog.Description className="mt-1 text-sm text-pretty text-gray-600">
                    {description}
                  </BaseDialog.Description>
                )}
              </div>
              {showClose && (
                <BaseDialog.Close
                  className="ml-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label="Close dialog"
                  onClick={onClose}
                >
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </BaseDialog.Close>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">{children}</div>
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

export function DialogFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-gray-200 px-6 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogClose({ children }: { children: React.ReactElement }) {
  return <BaseDialog.Close render={children} />;
}

export default Dialog;
