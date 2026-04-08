import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Hook for countdown timer functionality
 * @param initialSeconds - Initial countdown time in seconds
 * @returns Object with remaining time, active state, and reset function
 */
export function useCountdown(
  initialSeconds: number,
  options?: { storageKey?: string }
) {
  const storageKey = options?.storageKey;

  const persistedSeconds = useMemo(() => {
    if (!storageKey || typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = Number(raw);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    } catch {
      return null;
    }
  }, [storageKey]);

  const [seconds, setSeconds] = useState(persistedSeconds ?? initialSeconds);
  const [isActive, setIsActive] = useState(
    (persistedSeconds ?? initialSeconds) > 0
  );

  // If initialSeconds changes and there's no persisted value, update state.
  useEffect(() => {
    if (persistedSeconds !== null) return;
    setSeconds(initialSeconds);
    setIsActive(initialSeconds > 0);
  }, [initialSeconds, persistedSeconds]);

  useEffect(() => {
    if (!isActive || seconds <= 0) {
      setIsActive(false);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // Persist remaining seconds (optional)
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      if (seconds > 0) {
        sessionStorage.setItem(storageKey, String(seconds));
      } else {
        sessionStorage.removeItem(storageKey);
      }
    } catch {
      // ignore storage failures
    }
  }, [seconds, storageKey]);

  const reset = useCallback(
    (newSeconds?: number) => {
      const resetValue = newSeconds ?? initialSeconds;
      setSeconds(resetValue);
      setIsActive(resetValue > 0);
    },
    [initialSeconds]
  );

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return {
    minutes,
    seconds: remainingSeconds,
    totalSeconds: seconds,
    isActive,
    reset,
  };
}
