/**
 * Toast Component
 *
 * A global toast notification system with imperative API.
 *
 * @example
 * ```tsx
 * // In app root
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * // In components
 * const { toast } = useToast()
 * toast({ title: "Success!", message: "Saved successfully", variant: "success" })
 * ```
 */

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/utils/cn";

// ============================================================================
// Types
// ============================================================================

export type ToastVariant = "info" | "success" | "warning" | "error";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastOptions {
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  dismissible?: boolean;
  position?: ToastPosition;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastItem extends ToastOptions {
  id: string;
  timestamp: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// ============================================================================
// Context & Provider
// ============================================================================

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const toastsRef = React.useRef<ToastItem[]>([]);
  const timeoutRefs = React.useRef<Map<string, number>>(new Map());

  // Keep ref in sync
  React.useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    timeoutRefs.current.clear();
  }, []);

  const toast = React.useCallback(
    (options: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newItem: ToastItem = {
        id,
        timestamp: Date.now(),
        variant: "info",
        duration: 5000,
        dismissible: true,
        position: "top-right",
        ...options,
      };

      setToasts((prev) => {
        // Position-specific stacking: group by position and limit to 3
        const positionGroup = prev.filter(
          (t) => t.position === newItem.position
        );
        const otherPositions = prev.filter(
          (t) => t.position !== newItem.position
        );

        if (positionGroup.length >= 3) {
          // Remove oldest from this position
          const oldest = positionGroup[0];
          const timeout = timeoutRefs.current.get(oldest.id);
          if (timeout) {
            clearTimeout(timeout);
            timeoutRefs.current.delete(oldest.id);
          }
          return [...otherPositions, ...positionGroup.slice(1), newItem];
        }

        return [...prev, newItem];
      });

      // Auto-dismiss
      if (newItem.duration && newItem.duration > 0) {
        const timeout = setTimeout(() => {
          dismiss(id);
        }, newItem.duration);
        timeoutRefs.current.set(id, timeout);
      }

      return id;
    },
    [dismiss]
  );

  const contextValue = React.useMemo<ToastContextValue>(
    () => ({ toast, dismiss, dismissAll }),
    [toast, dismiss, dismissAll]
  );

  // Position groups for rendering
  const topLeftToasts = toasts.filter((t) => t.position === "top-left");
  const topCenterToasts = toasts.filter((t) => t.position === "top-center");
  const topRightToasts = toasts.filter((t) => t.position === "top-right");
  const bottomLeftToasts = toasts.filter((t) => t.position === "bottom-left");
  const bottomCenterToasts = toasts.filter(
    (t) => t.position === "bottom-center"
  );
  const bottomRightToasts = toasts.filter((t) => t.position === "bottom-right");

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport
        position="top-left"
        toasts={topLeftToasts}
        onDismiss={dismiss}
      />
      <ToastViewport
        position="top-center"
        toasts={topCenterToasts}
        onDismiss={dismiss}
      />
      <ToastViewport
        position="top-right"
        toasts={topRightToasts}
        onDismiss={dismiss}
      />
      <ToastViewport
        position="bottom-left"
        toasts={bottomLeftToasts}
        onDismiss={dismiss}
      />
      <ToastViewport
        position="bottom-center"
        toasts={bottomCenterToasts}
        onDismiss={dismiss}
      />
      <ToastViewport
        position="bottom-right"
        toasts={bottomRightToasts}
        onDismiss={dismiss}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// ============================================================================
// Toast Viewport (Position Container)
// ============================================================================

interface ToastViewportProps {
  position: ToastPosition;
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

function ToastViewport({ position, toasts, onDismiss }: ToastViewportProps) {
  const prefersReducedMotion = useReducedMotion();

  const positionClasses: Record<ToastPosition, string> = {
    "top-left": "top-2 left-2",
    "top-center": "top-2 left-1/2 -translate-x-1/2",
    "top-right": "top-2 right-2",
    "bottom-left": "bottom-2 left-2",
    "bottom-center": "bottom-2 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-2 right-2",
  };

  const stackDirection = position.startsWith("top")
    ? "flex-col"
    : "flex-col-reverse";

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[var(--z-toast)] flex w-full max-w-md gap-2 p-2",
        positionClasses[position],
        stackDirection
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode={prefersReducedMotion ? "wait" : "popLayout"}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Toast Item (Individual Toast)
// ============================================================================

interface ToastItemProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isDismissing, setIsDismissing] = React.useState(false);

  const handleDismiss = React.useCallback(() => {
    setIsDismissing(true);
    const delay = prefersReducedMotion ? 0 : 150;
    setTimeout(() => onDismiss(toast.id), delay);
  }, [toast.id, onDismiss, prefersReducedMotion]);

  const animationConfig = prefersReducedMotion
    ? {
        initial: { opacity: 1, x: 0 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: {
          opacity: 0,
          x: toast.position?.startsWith("right")
            ? 100
            : toast.position?.startsWith("left")
              ? -100
              : 0,
          y: toast.position?.startsWith("top") ? -50 : 50,
        },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: {
          opacity: 0,
          scale: 0.9,
          x: toast.position?.startsWith("right")
            ? 100
            : toast.position?.startsWith("left")
              ? -100
              : 0,
        },
        transition: { duration: 0.15, ease: "easeOut" as const },
      };

  const variantStyles: Record<ToastVariant, string> = {
    info: "bg-white border-blue-200 text-gray-900",
    success: "bg-white border-green-200 text-gray-900",
    warning: "bg-white border-yellow-200 text-gray-900",
    error: "bg-white border-red-200 text-gray-900",
  };

  const iconColors: Record<ToastVariant, string> = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  };

  const defaultIcons: Record<ToastVariant, React.ReactNode> = {
    info: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    success: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <motion.div
      className={cn(
        "pointer-events-auto relative w-full overflow-hidden rounded-lg border shadow-lg",
        variantStyles[toast.variant || "info"]
      )}
      role="alert"
      aria-labelledby={`${toast.id}-title`}
      aria-describedby={`${toast.id}-message`}
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      exit={animationConfig.exit}
      transition={animationConfig.transition}
    >
      <div className="flex gap-3 p-4">
        {/* Icon */}
        <div className={cn("shrink-0", iconColors[toast.variant || "info"])}>
          {defaultIcons[toast.variant || "info"]}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {toast.title && (
            <h4
              id={`${toast.id}-title`}
              className="mb-1 text-sm font-semibold text-balance"
            >
              {toast.title}
            </h4>
          )}
          <p
            id={`${toast.id}-message`}
            className="text-sm text-pretty text-gray-700"
          >
            {toast.message}
          </p>
          {toast.action && (
            <button
              type="button"
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Dismiss button */}
        {toast.dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            disabled={isDismissing}
            className={cn(
              "-mt-1 -mr-1 ml-auto shrink-0 rounded-lg p-1.5 transition-colors duration-150 hover:bg-gray-100",
              iconColors[toast.variant || "info"],
              isDismissing && "cursor-not-allowed opacity-70"
            )}
            aria-label="Dismiss notification"
          >
            {isDismissing ? (
              <svg
                className="size-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default ToastProvider;
