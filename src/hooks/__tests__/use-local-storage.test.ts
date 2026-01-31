import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../use-local-storage";

describe("useLocalStorage", () => {
  const originalConsoleError = console.error;
  const mockConsoleError = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    console.error = mockConsoleError;
  });

  afterEach(() => {
    console.error = originalConsoleError;
    vi.restoreAllMocks();
  });

  it("returns initial value when key is not in storage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    expect(result.current[0]).toBe("initial");
  });

  it("returns stored value when key exists in storage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored"));

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    expect(result.current[0]).toBe("stored");
  });

  it("persists value when setValue is called", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(localStorage.getItem("test-key")).toBe(JSON.stringify("new-value"));
  });

  it("handles functional setValue update", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(localStorage.getItem("counter")).toBe("1");

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it("handles JSON serialization for objects", () => {
    const { result } = renderHook(() =>
      useLocalStorage("obj-key", { foo: "bar" })
    );

    act(() => {
      result.current[1]({ foo: "baz", nested: { a: 1 } });
    });

    expect(result.current[0]).toEqual({ foo: "baz", nested: { a: 1 } });
    expect(localStorage.getItem("obj-key")).toBe(
      JSON.stringify({ foo: "baz", nested: { a: 1 } })
    );
  });

  it("returns initial value when localStorage.getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage error");
    });

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "fallback")
    );

    expect(result.current[0]).toBe("fallback");
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Storage error" })
    );
  });

  it("catches setItem error and logs without throwing", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "QuotaExceededError" })
    );
  });
});
