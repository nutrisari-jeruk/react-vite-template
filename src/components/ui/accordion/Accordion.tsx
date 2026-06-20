/**
 * Accordion Component
 *
 * Collapsible content sections built on Base UI.
 *
 * @example
 * ```tsx
 * <Accordion>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionPanel>Content 1</AccordionPanel>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */

import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/utils/cn";

// ============================================================================
// Types
// ============================================================================

interface AccordionProps {
  children: React.ReactNode;
  value?: string | string[] | null;
  onValueChange?: (value: string | string[] | null) => void;
  defaultValue?: string | string[] | null;
  className?: string;
}

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionPanelProps {
  children: React.ReactNode;
  className?: string;
}

// ============================================================================
// Root Component
// ============================================================================

export function Accordion({
  children,
  value,
  onValueChange,
  defaultValue,
  className = "",
}: AccordionProps) {
  // Base UI requires value/defaultValue to always be (any | null)[]
  // Preserve undefined so Base UI treats missing props as uncontrolled
  const toArray = (
    v: string | string[] | null | undefined
  ): (string | null)[] | undefined => {
    if (v === undefined) return undefined;
    if (v === null) return [];
    return Array.isArray(v) ? v : [v];
  };

  const handleChange = onValueChange
    ? (newValue: (string | null)[]) => {
        const single = newValue.length <= 1 ? (newValue[0] ?? null) : newValue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onValueChange(single as any);
      }
    : undefined;

  return (
    <BaseAccordion.Root
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={toArray(value) as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onValueChange={handleChange as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValue={toArray(defaultValue) as any}
      className={cn("space-y-2", className)}
    >
      {children}
    </BaseAccordion.Root>
  );
}

// ============================================================================
// Accordion Item
// ============================================================================

export function AccordionItem({
  children,
  value,
  className = "",
}: AccordionItemProps) {
  return (
    <BaseAccordion.Item
      value={value}
      className={cn("rounded-lg border border-gray-200 bg-white", className)}
    >
      {children}
    </BaseAccordion.Item>
  );
}

// ============================================================================
// Accordion Trigger
// ============================================================================

export function AccordionTrigger({
  children,
  className = "",
}: AccordionTriggerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <BaseAccordion.Trigger
      render={(props, triggerState) => {
        const open = triggerState.open;

        return (
          <button
            {...props}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-medium transition-colors",
              "hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none",
              open && "bg-gray-50",
              className
            )}
          >
            {children}
            <svg
              className={cn(
                "size-4 shrink-0 transition-transform duration-200",
                !prefersReducedMotion && open && "rotate-180"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        );
      }}
    />
  );
}

// ============================================================================
// Accordion Panel
// ============================================================================

export function AccordionPanel({
  children,
  className = "",
}: AccordionPanelProps) {
  const prefersReducedMotion = useReducedMotion();

  const animationConfig = prefersReducedMotion
    ? {
        initial: { height: 0, opacity: 1 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 1 },
        transition: { duration: 0 },
      }
    : {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: 0.2, ease: "easeOut" as const },
      };

  return (
    <BaseAccordion.Panel
      render={(props, panelState) => {
        const { id } = props;
        const open = panelState.open;

        return (
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={id}
                initial={animationConfig.initial}
                animate={animationConfig.animate}
                exit={animationConfig.exit}
                transition={animationConfig.transition}
                className="overflow-hidden"
              >
                <div className={cn("px-4 pt-0 pb-4", className)}>
                  {children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        );
      }}
    />
  );
}

Accordion.defaultProps = {
  className: "",
};

AccordionItem.defaultProps = {
  className: "",
};

AccordionTrigger.defaultProps = {
  className: "",
};

AccordionPanel.defaultProps = {
  className: "",
};

export default Accordion;
