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
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
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
  const shouldReduceMotion = useReducedMotion();

  const backdropAnimation = shouldReduceMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      };

  const contentAnimation = shouldReduceMotion
    ? {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.2 },
      };

  return (
    <BaseDialog.Portal>
      <AnimatePresence>
        <BaseDialog.Backdrop
          render={(props) => {
            const { onClick, onPointerDown, "aria-hidden": ariaHidden } = props;
            return (
              <motion.div
                onClick={onClick}
                onPointerDown={onPointerDown}
                aria-hidden={ariaHidden}
                {...backdropAnimation}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              />
            );
          }}
        />
        <BaseDialog.Popup
          render={(props, state) => {
            if (!state.open) return <></>;
            return (
              <div
                {...props}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  {...contentAnimation}
                  className={cn(
                    "relative w-full rounded-lg bg-white shadow-xl",
                    sizeClasses[size],
                    className
                  )}
                  onClick={(e) => e.stopPropagation()}
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
                </motion.div>
              </div>
            );
          }}
        />
      </AnimatePresence>
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
