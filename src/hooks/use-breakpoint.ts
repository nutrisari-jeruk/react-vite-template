/**
 * useBreakpoint Hook
 *
 * Tracks the current Tailwind CSS breakpoint.
 *
 * @returns Object with boolean flags for each breakpoint
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isMobile, isTablet, isDesktop, current } = useBreakpoint();
 *
 *   return (
 *     <div>
 *       Current breakpoint: {current}
 *       {isMobile && <MobileView />}
 *       {isDesktop && <DesktopView />}
 *     </div>
 *   );
 * }
 * ```
 */

import { useMediaQuery } from "./use-media-query";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface BreakpointState {
  /** Extra small devices (< 640px) */
  isXs: boolean;
  /** Small devices (≥ 640px) */
  isSm: boolean;
  /** Medium devices (≥ 768px) */
  isMd: boolean;
  /** Large devices (≥ 1024px) */
  isLg: boolean;
  /** Extra large devices (≥ 1280px) */
  isXl: boolean;
  /** 2x extra large devices (≥ 1536px) */
  is2xl: boolean;
  /** Convenience flag for mobile devices (< 768px) */
  isMobile: boolean;
  /** Convenience flag for tablet devices (≥ 768px and < 1024px) */
  isTablet: boolean;
  /** Convenience flag for desktop devices (≥ 1024px) */
  isDesktop: boolean;
  /** Current active breakpoint */
  current: Breakpoint;
}

export function useBreakpoint(): BreakpointState {
  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");
  const is2xl = useMediaQuery("(min-width: 1536px)");

  const isXs = !isSm;
  const isMobile = !isMd;
  const isTablet = isMd && !isLg;
  const isDesktop = isLg;

  let current: Breakpoint = "xs";
  if (is2xl) current = "2xl";
  else if (isXl) current = "xl";
  else if (isLg) current = "lg";
  else if (isMd) current = "md";
  else if (isSm) current = "sm";

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isMobile,
    isTablet,
    isDesktop,
    current,
  };
}

export default useBreakpoint;
