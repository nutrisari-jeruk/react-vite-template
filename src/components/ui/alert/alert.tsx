import {
  useState,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/utils/cn";

interface AlertProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  children: ReactNode;
  floating?: boolean;
  position?: "top-center" | "top-right" | "bottom-right" | "bottom-left";
  timeout?: number;
}

export function Alert({
  variant = "info",
  title,
  icon,
  dismissible = false,
  onDismiss,
  children,
  className = "",
  floating = false,
  position = "top-center",
  timeout,
  ...props
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);
  const [progress, setProgress] = useState(100);
  const prefersReducedMotion = useReducedMotion();

  const handleDismiss = useCallback(() => {
    setIsDismissing(true);
    const dismissDelay = prefersReducedMotion ? 0 : 150;

    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, dismissDelay);
  }, [onDismiss, prefersReducedMotion]);

  useEffect(() => {
    if (timeout && timeout > 0) {
      const startTime = Date.now();
      const updateInterval = 50;

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / timeout) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          clearInterval(progressInterval);
        }
      }, updateInterval);

      const timer = setTimeout(() => {
        handleDismiss();
      }, timeout);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [timeout, handleDismiss]);

  const variantStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    error: "bg-red-50 border-red-200 text-red-900",
  };

  const iconColors = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  };

  const defaultIcons = {
    info: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    success: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  const displayIcon = icon || defaultIcons[variant];

  const positionClasses = {
    "top-center":
      "fixed top-2 left-1/2 -translate-x-1/2 z-overlay w-full max-w-md shadow-lg safe-top-0",
    "top-right":
      "fixed top-2 right-2 z-overlay w-full max-w-md shadow-lg safe-top-0 safe-right-0",
    "bottom-right":
      "fixed bottom-2 right-2 z-overlay w-full max-w-md shadow-lg safe-bottom-0 safe-right-0",
    "bottom-left":
      "fixed bottom-2 left-2 z-overlay w-full max-w-md shadow-lg safe-bottom-0 safe-left-0",
  };

  const floatingClasses = floating ? positionClasses[position] : "";
  const positionClass = floating ? "" : "relative";

  const progressBarColors = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  const animationConfig = prefersReducedMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: {
          duration: 0.2,
          ease: "easeOut" as const,
        },
      };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={cn(
            positionClass,
            "relative flex flex-col overflow-hidden rounded-lg border",
            variantStyles[variant],
            floatingClasses,
            className
          )}
          role="alert"
          initial={animationConfig.initial}
          animate={animationConfig.animate}
          exit={animationConfig.exit}
          transition={animationConfig.transition}
          {...props}
        >
          <div className="flex gap-3 p-4">
            <div className={`shrink-0 ${iconColors[variant]}`}>
              {displayIcon}
            </div>
            <div className="min-w-0 flex-1">
              {title && (
                <h4 className="mb-1 text-sm font-semibold text-balance">
                  {title}
                </h4>
              )}
              <div className="text-sm text-pretty">{children}</div>
            </div>
            {dismissible && (
              <button
                type="button"
                onClick={handleDismiss}
                disabled={isDismissing}
                className={cn(
                  "-mt-1 -mr-1 ml-auto shrink-0 rounded-lg p-1.5 transition-colors duration-150 hover:bg-black/5",
                  iconColors[variant],
                  isDismissing && "cursor-not-allowed opacity-70"
                )}
                aria-label="Dismiss"
              >
                {isDismissing ? (
                  <svg
                    className="size-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <svg
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
          {timeout && timeout > 0 && (
            <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-b-lg bg-black/10">
              <div
                className={`h-full ${progressBarColors[variant]} transition-all ease-linear`}
                style={{
                  width: `${progress}%`,
                  transitionDuration: "50ms",
                }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Alert;
