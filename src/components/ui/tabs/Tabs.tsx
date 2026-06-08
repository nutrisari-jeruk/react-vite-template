/**
 * Tabs Component
 *
 * Accessible tab component built on Base UI.
 *
 * @example
 * ```tsx
 * <Tabs value={value} onValueChange={setValue}>
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * ```
 */

import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/utils/cn";

// ============================================================================
// Types
// ============================================================================

interface TabsProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

// ============================================================================
// Root Component
// ============================================================================

export function Tabs({
  children,
  value,
  onValueChange,
  defaultValue,
  className = "",
}: TabsProps) {
  return (
    <BaseTabs.Root
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      className={cn(className)}
    >
      {children}
    </BaseTabs.Root>
  );
}

// ============================================================================
// Tabs List (Tab Navigation)
// ============================================================================

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <BaseTabs.List
      render={(props) => (
        <div
          {...props}
          role="tablist"
          className={cn(
            "relative inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1",
            className
          )}
        >
          {children}
        </div>
      )}
    />
  );
}

// ============================================================================
// Tabs Trigger (Tab Button)
// ============================================================================

export function TabsTrigger({
  children,
  value,
  disabled = false,
  className = "",
}: TabsTriggerProps) {
  return (
    <BaseTabs.Tab
      value={value}
      disabled={disabled}
      render={(props) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { selected, ...buttonProps } = props as any;

        return (
          <button
            {...buttonProps}
            className={cn(
              "relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none",
              "disabled:pointer-events-none disabled:opacity-50",
              selected
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900",
              className
            )}
          >
            {children}
          </button>
        );
      }}
    />
  );
}

// ============================================================================
// Tabs Content (Tab Panel)
// ============================================================================

export function TabsContent({
  children,
  value,
  className = "",
}: TabsContentProps) {
  const prefersReducedMotion = useReducedMotion();

  const animationConfig = prefersReducedMotion
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
        transition: { duration: 0.15 },
      };

  return (
    <BaseTabs.Panel
      value={value}
      render={(props) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { hidden, id } = props as any;

        return (
          <AnimatePresence mode="wait">
            {!hidden && (
              <motion.div
                id={id}
                role="tabpanel"
                initial={animationConfig.initial}
                animate={animationConfig.animate}
                exit={animationConfig.exit}
                transition={animationConfig.transition}
                className={cn("mt-4", className)}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        );
      }}
    />
  );
}

Tabs.defaultProps = {
  className: "",
};

TabsList.defaultProps = {
  className: "",
};

TabsTrigger.defaultProps = {
  disabled: false,
  className: "",
};

TabsContent.defaultProps = {
  className: "",
};

export default Tabs;
