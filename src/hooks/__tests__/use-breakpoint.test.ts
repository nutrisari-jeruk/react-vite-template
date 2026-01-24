import { renderHook } from "@testing-library/react";
import { useBreakpoint } from "../use-breakpoint";

const createMatchMedia = (width: number) => {
  return vi.fn().mockImplementation((query: string) => {
    const minWidth = query.match(/min-width:\s*(\d+)px/);
    const matches = minWidth ? width >= parseInt(minWidth[1]) : false;

    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
};

describe("useBreakpoint", () => {
  it("detects mobile breakpoint (< 768px)", () => {
    window.matchMedia = createMatchMedia(375);

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.current).toBe("xs");
  });

  it("detects tablet breakpoint (768px - 1023px)", () => {
    window.matchMedia = createMatchMedia(800);

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isTablet).toBe(true);
    expect(result.current.isMd).toBe(true);
    expect(result.current.isLg).toBe(false);
    expect(result.current.current).toBe("md");
  });

  it("detects desktop breakpoint (≥ 1024px)", () => {
    window.matchMedia = createMatchMedia(1280);

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.current).toBe("xl");
  });

  it("detects 2xl breakpoint (≥ 1536px)", () => {
    window.matchMedia = createMatchMedia(1600);

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.is2xl).toBe(true);
    expect(result.current.current).toBe("2xl");
  });
});
