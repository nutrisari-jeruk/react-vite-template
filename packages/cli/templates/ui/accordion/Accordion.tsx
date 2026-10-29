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

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cn } from "@/utils/cn";

// ============================================================================
// Types
// ============================================================================

type AccordionValue = (string | null)[];

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

function toArray(
  v: string | string[] | null | undefined
): AccordionValue | undefined {
  if (v === undefined) return undefined;
  if (v === null) return [];
  return Array.isArray(v) ? v : [v];
}

function fromArray(newValue: readonly unknown[]): string | string[] | null {
  const strings = newValue.filter(
    (item): item is string => typeof item === "string"
  );
  if (strings.length === 0) return null;
  if (strings.length === 1) return strings[0];
  return strings;
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
  return (
    <BaseAccordion.Root
      value={toArray(value)}
      onValueChange={(nextValue) => {
        onValueChange?.(fromArray(nextValue));
      }}
      defaultValue={toArray(defaultValue)}
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
  return (
    <BaseAccordion.Header className="flex">
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
                  "size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
                  open && "rotate-180"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
    </BaseAccordion.Header>
  );
}

// ============================================================================
// Accordion Panel
// ============================================================================

export function AccordionPanel({
  children,
  className = "",
}: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel
      className={cn(
        "h-[var(--accordion-panel-height)] overflow-hidden text-sm transition-[height,opacity] duration-200 ease-out data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0 motion-reduce:transition-none",
        className
      )}
    >
      <div className="px-4 pt-0 pb-4">{children}</div>
    </BaseAccordion.Panel>
  );
}

export default Accordion;
