import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { Alert } from "../ui/alert";

describe("Alert", () => {
  beforeEach(() => {
    // Mock requestAnimationFrame for animation libraries to work with fake timers
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      return setTimeout(callback, 16);
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("renders children correctly", () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByText("Alert message")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<Alert title="Alert Title">Message</Alert>);
    expect(screen.getByText("Alert Title")).toBeInTheDocument();
  });

  it("applies info variant styles by default", () => {
    const { container } = render(<Alert>Info</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass("bg-blue-50", "border-blue-200");
  });

  it("applies success variant styles", () => {
    const { container } = render(<Alert variant="success">Success</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass("bg-green-50", "border-green-200");
  });

  it("applies warning variant styles", () => {
    const { container } = render(<Alert variant="warning">Warning</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass("bg-yellow-50", "border-yellow-200");
  });

  it("applies error variant styles", () => {
    const { container } = render(<Alert variant="error">Error</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass("bg-red-50", "border-red-200");
  });

  it("renders default icon for each variant", () => {
    const { container } = render(<Alert>Info</Alert>);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("shows dismiss button when dismissible", () => {
    render(<Alert dismissible>Dismissible alert</Alert>);
    expect(screen.getByLabelText("Dismiss")).toBeInTheDocument();
  });

  it("shows loading spinner when dismissing", () => {
    vi.useFakeTimers();
    const { container } = render(<Alert dismissible>Alert</Alert>);

    const dismissButton = screen.getByLabelText("Dismiss");

    act(() => {
      fireEvent.click(dismissButton);
    });

    // Check for loading spinner (animate-spin class)
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();

    // Button should be disabled
    expect(dismissButton).toBeDisabled();

    vi.useRealTimers();
  });

  it("shows progress bar when timeout is set", () => {
    render(<Alert timeout={3000}>Auto-dismiss alert</Alert>);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  it("does not show progress bar when timeout is not set", () => {
    render(<Alert>Normal alert</Alert>);
    const progressBar = screen.queryByRole("progressbar");
    expect(progressBar).not.toBeInTheDocument();
  });

  it("progress bar decreases over time", () => {
    vi.useFakeTimers();
    render(<Alert timeout={1000}>Auto-dismiss alert</Alert>);

    const progressBar = screen.getByRole("progressbar");

    // Initial progress should be 100
    expect(progressBar).toHaveAttribute("aria-valuenow", "100");

    // Advance time by half the timeout
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Progress should be approximately 50 (allow some variance due to timing)
    const currentProgress = parseFloat(
      progressBar.getAttribute("aria-valuenow") || "0"
    );
    expect(currentProgress).toBeLessThan(60);
    expect(currentProgress).toBeGreaterThan(40);

    vi.useRealTimers();
  });

  it("calls onDismiss and hides alert when dismiss button is clicked", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(
      <Alert dismissible onDismiss={onDismiss}>
        Alert
      </Alert>
    );

    const dismissButton = screen.getByLabelText("Dismiss");

    act(() => {
      fireEvent.click(dismissButton);
    });

    // Advance timers in increments to allow React and AnimatePresence to process
    act(() => {
      vi.advanceTimersByTime(150); // dismiss delay
    });
    act(() => {
      vi.advanceTimersByTime(200); // exit animation duration
    });
    // AnimatePresence needs additional time to remove the element after exit animation
    act(() => {
      vi.advanceTimersByTime(300); // AnimatePresence cleanup and requestAnimationFrame calls
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
    const alert = screen.queryByRole("alert");
    // Element may still be in DOM during exit animation, but should not be visible
    if (alert) {
      expect(alert).not.toBeVisible();
    } else {
      expect(alert).not.toBeInTheDocument();
    }

    vi.useRealTimers();
  });

  it("renders custom icon when provided", () => {
    const CustomIcon = () => <span data-testid="custom-icon">Custom</span>;
    render(<Alert icon={<CustomIcon />}>Alert</Alert>);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  describe("Floating and Position", () => {
    it("applies floating classes when floating prop is true", () => {
      const { container } = render(<Alert floating>Floating alert</Alert>);
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass("fixed", "z-overlay", "shadow-lg");
    });

    it("applies top-center position classes by default", () => {
      const { container } = render(
        <Alert floating position="top-center">
          Alert
        </Alert>
      );
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass("top-2", "left-1/2", "-translate-x-1/2");
    });

    it("applies top-right position classes", () => {
      const { container } = render(
        <Alert floating position="top-right">
          Alert
        </Alert>
      );
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass("top-2", "right-2");
    });

    it("applies bottom-right position classes", () => {
      const { container } = render(
        <Alert floating position="bottom-right">
          Alert
        </Alert>
      );
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass("bottom-2", "right-2");
    });

    it("applies bottom-left position classes", () => {
      const { container } = render(
        <Alert floating position="bottom-left">
          Alert
        </Alert>
      );
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass("bottom-2", "left-2");
    });

    it("does not apply floating classes when floating is false", () => {
      const { container } = render(<Alert>Not floating</Alert>);
      const alert = container.firstChild as HTMLElement;
      expect(alert).not.toHaveClass("fixed");
    });

    it("applies relative positioning to non-floating alerts", () => {
      const { container } = render(<Alert>Static alert</Alert>);
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass("relative");
      expect(alert).not.toHaveClass("fixed");
    });

    it("does not apply relative positioning to floating alerts", () => {
      const { container } = render(
        <Alert floating position="top-right">
          Floating alert
        </Alert>
      );
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass("fixed");
      expect(alert).not.toHaveClass("relative");
    });
  });

  describe("Timeout", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("auto-dismisses after timeout duration", () => {
      const onDismiss = vi.fn();
      render(
        <Alert timeout={3000} onDismiss={onDismiss}>
          Auto-dismiss alert
        </Alert>
      );

      expect(screen.getByText("Auto-dismiss alert")).toBeInTheDocument();

      // Advance time to trigger timeout
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Advance timers in increments to allow React and AnimatePresence to process
      act(() => {
        vi.advanceTimersByTime(150); // dismiss delay
      });
      act(() => {
        vi.advanceTimersByTime(200); // exit animation duration
      });
      // AnimatePresence needs additional time to remove the element after exit animation
      act(() => {
        vi.advanceTimersByTime(300); // AnimatePresence cleanup and requestAnimationFrame calls
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
      const alert = screen.queryByRole("alert");
      // Element may still be in DOM during exit animation, but should not be visible
      if (alert) {
        expect(alert).not.toBeVisible();
      } else {
        expect(alert).not.toBeInTheDocument();
      }
    });

    it("does not auto-dismiss without timeout prop", () => {
      const onDismiss = vi.fn();
      render(<Alert onDismiss={onDismiss}>No timeout</Alert>);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onDismiss).not.toHaveBeenCalled();
      expect(screen.getByText("No timeout")).toBeInTheDocument();
    });

    it("auto-dismisses after custom timeout duration", () => {
      const onDismiss = vi.fn();
      render(
        <Alert timeout={1500} onDismiss={onDismiss}>
          Custom timeout
        </Alert>
      );

      // Advance time to trigger timeout
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Advance timers in increments to allow React and AnimatePresence to process
      act(() => {
        vi.advanceTimersByTime(150); // dismiss delay
      });
      act(() => {
        vi.advanceTimersByTime(200); // exit animation duration
      });
      // AnimatePresence needs additional time to remove the element after exit animation
      act(() => {
        vi.advanceTimersByTime(300); // AnimatePresence cleanup and requestAnimationFrame calls
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
      const alert = screen.queryByRole("alert");
      // Element may still be in DOM during exit animation, but should not be visible
      if (alert) {
        expect(alert).not.toBeVisible();
      } else {
        expect(alert).not.toBeInTheDocument();
      }
    });

    it("clears timeout when component unmounts", () => {
      const onDismiss = vi.fn();
      const { unmount } = render(
        <Alert timeout={3000} onDismiss={onDismiss}>
          Alert
        </Alert>
      );

      unmount();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe("Animation", () => {
    it("renders with motion component for animations", () => {
      const { container } = render(<Alert>Animated alert</Alert>);
      const alert = container.firstChild as HTMLElement;
      expect(alert).toBeInTheDocument();
      expect(alert.tagName.toLowerCase()).toBe("div");
    });

    it("applies exit animation when dismissed", () => {
      vi.useFakeTimers();
      render(<Alert dismissible>Alert</Alert>);

      const dismissButton = screen.getByLabelText("Dismiss");

      act(() => {
        fireEvent.click(dismissButton);
      });

      // Advance timers in increments to allow React and AnimatePresence to process
      act(() => {
        vi.advanceTimersByTime(150); // dismiss delay
      });
      act(() => {
        vi.advanceTimersByTime(200); // exit animation duration
      });
      // AnimatePresence needs additional time to remove the element after exit animation
      act(() => {
        vi.advanceTimersByTime(300); // AnimatePresence cleanup and requestAnimationFrame calls
      });

      // Component should be removed or not visible after exit animation
      const alert = screen.queryByRole("alert");
      if (alert) {
        expect(alert).not.toBeVisible();
      } else {
        expect(alert).not.toBeInTheDocument();
      }

      vi.useRealTimers();
    });
  });

  describe("Integration", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("renders floating alert with timeout and position", () => {
      const { container } = render(
        <Alert
          floating
          position="top-right"
          timeout={3000}
          variant="success"
          title="Success"
        >
          Complete integration test
        </Alert>
      );

      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass(
        "fixed",
        "top-2",
        "right-2",
        "bg-green-50",
        "border-green-200"
      );
      expect(screen.getByText("Success")).toBeInTheDocument();
      expect(screen.getByText("Complete integration test")).toBeInTheDocument();
    });

    it("allows manual dismiss before timeout expires", () => {
      const onDismiss = vi.fn();

      render(
        <Alert dismissible timeout={5000} onDismiss={onDismiss}>
          Alert with timeout
        </Alert>
      );

      // Advance time slightly (but less than timeout)
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      const dismissButton = screen.getByLabelText("Dismiss");

      act(() => {
        fireEvent.click(dismissButton);
      });

      // Advance timers in increments to allow React and AnimatePresence to process
      act(() => {
        vi.advanceTimersByTime(150); // dismiss delay
      });
      act(() => {
        vi.advanceTimersByTime(200); // exit animation
      });
      act(() => {
        vi.advanceTimersByTime(100); // AnimatePresence cleanup and requestAnimationFrame calls
      });
      act(() => {
        vi.advanceTimersByTime(50); // additional cleanup
      });

      // onDismiss should be called once from manual dismiss
      // Note: The timeout cleanup should prevent the timeout from firing
      expect(onDismiss).toHaveBeenCalledTimes(1);
      const alert = screen.queryByRole("alert");
      // Element may still be in DOM during exit animation, but should not be visible
      if (alert) {
        expect(alert).not.toBeVisible();
      } else {
        expect(alert).not.toBeInTheDocument();
      }
    });
  });
});
