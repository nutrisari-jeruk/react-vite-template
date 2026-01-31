import { renderHook, act } from "@testing-library/react";
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

  it("updates when media query change event fires", () => {
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;
    const addEventListener = vi.fn(
      (_event: string, handler: (e: MediaQueryListEvent) => void) => {
        changeHandler = handler;
      }
    );
    const removeEventListener = vi.fn();

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener,
      removeEventListener,
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(false);

    act(() => {
      changeHandler?.({
        matches: true,
        media: "(min-width: 768px)",
      } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });

  it("uses legacy addListener when addEventListener is not available", () => {
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;
    const addListener = vi.fn((handler: (e: MediaQueryListEvent) => void) => {
      changeHandler = handler;
    });
    const removeListener = vi.fn();

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener,
      removeListener,
      addEventListener: undefined,
      removeEventListener: undefined,
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(false);
    expect(addListener).toHaveBeenCalled();

    act(() => {
      changeHandler?.({
        matches: true,
        media: "(min-width: 768px)",
      } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });
});
