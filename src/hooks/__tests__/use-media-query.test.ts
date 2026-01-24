import { renderHook } from "@testing-library/react";
import { useMediaQuery } from "../use-media-query";

// Mock matchMedia
const createMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe("useMediaQuery", () => {
  it("returns true when media query matches", () => {
    window.matchMedia = createMatchMedia(true);

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(true);
  });

  it("returns false when media query does not match", () => {
    window.matchMedia = createMatchMedia(false);

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(false);
  });

  it("accepts different media query strings", () => {
    window.matchMedia = createMatchMedia(true);

    const { result } = renderHook(() =>
      useMediaQuery("(prefers-color-scheme: dark)")
    );

    expect(result.current).toBe(true);
  });
});
