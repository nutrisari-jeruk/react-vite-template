import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountdown } from "../use-countdown";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with initial seconds", () => {
    const { result } = renderHook(() => useCountdown(60));

    expect(result.current.totalSeconds).toBe(60);
    expect(result.current.minutes).toBe(1);
    expect(result.current.seconds).toBe(0);
    expect(result.current.isActive).toBe(true);
  });

  it("does not start when initial seconds is 0", () => {
    const { result } = renderHook(() => useCountdown(0));

    expect(result.current.isActive).toBe(false);
    expect(result.current.totalSeconds).toBe(0);
  });

  it("decrements over time", () => {
    const { result } = renderHook(() => useCountdown(3));

    expect(result.current.totalSeconds).toBe(3);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.totalSeconds).toBe(2);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.totalSeconds).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.totalSeconds).toBe(0);
    expect(result.current.isActive).toBe(false);
  });

  it("reset restores countdown", () => {
    const { result } = renderHook(() => useCountdown(10));

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.totalSeconds).toBe(7);

    act(() => {
      result.current.reset();
    });
    expect(result.current.totalSeconds).toBe(10);
    expect(result.current.isActive).toBe(true);
  });

  it("reset with new value uses provided seconds", () => {
    const { result } = renderHook(() => useCountdown(10));

    act(() => {
      result.current.reset(30);
    });
    expect(result.current.totalSeconds).toBe(30);
  });

  it("persists to sessionStorage when storageKey is provided", () => {
    const { result } = renderHook(() =>
      useCountdown(5, { storageKey: "countdown-test" })
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.totalSeconds).toBe(3);
    expect(sessionStorage.getItem("countdown-test")).toBe("3");
  });

  it("restores from sessionStorage when storageKey has persisted value", () => {
    sessionStorage.setItem("countdown-restore", "15");

    const { result } = renderHook(() =>
      useCountdown(60, { storageKey: "countdown-restore" })
    );

    expect(result.current.totalSeconds).toBe(15);
  });
});
