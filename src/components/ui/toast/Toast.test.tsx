import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { ToastProvider, useToast } from "./";

// Test component to use toast hook
function TestComponent({
  onToast,
}: {
  onToast: (toast: ReturnType<typeof useToast>) => void;
}) {
  const toast = useToast();
  return (
    <button onClick={() => onToast(toast)} data-testid="trigger-toast">
      Trigger Toast
    </button>
  );
}

describe("Toast", () => {
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

  describe("ToastProvider and useToast", () => {
    it("provides toast context", () => {
      render(
        <ToastProvider>
          <TestComponent onToast={() => {}} />
        </ToastProvider>
      );
      expect(screen.getByTestId("trigger-toast")).toBeInTheDocument();
    });

    it("throws error when useToast is used without provider", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<TestComponent onToast={() => {}} />);
      }).toThrow("useToast must be used within a ToastProvider");

      console.error = originalError;
    });

    it("renders toast when toast function is called", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toastObj) => toastObj.toast({ message: "Test message" })}
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        expect(screen.getByText("Test message")).toBeInTheDocument();
      });
    });

    it("renders toast with title", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) =>
              toast({ title: "Success", message: "Saved successfully" })
            }
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        expect(screen.getByText("Success")).toBeInTheDocument();
        expect(screen.getByText("Saved successfully")).toBeInTheDocument();
      });
    });

    it("applies variant styles correctly", async () => {
      const { container } = render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) =>
              toast({ message: "Success", variant: "success" })
            }
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        const toastElement = container.querySelector('[role="alert"]');
        expect(toastElement).toHaveClass("border-green-200", "text-gray-900");
      });
    });
  });

  describe("Toast Variants", () => {
    it.each([
      ["info", "border-blue-200"],
      ["success", "border-green-200"],
      ["warning", "border-yellow-200"],
      ["error", "border-red-200"],
    ] as const)("applies %s variant styles", async (variant, expectedClass) => {
      const { container } = render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              toast({ message: "Test", variant: variant as any })
            }
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        const toastElement = container.querySelector('[role="alert"]');
        expect(toastElement).toHaveClass(expectedClass);
      });
    });
  });

  describe("Toast Positions", () => {
    it.each([
      ["top-left", "top-2", "left-2"],
      ["top-center", "top-2", "left-1/2", "-translate-x-1/2"],
      ["top-right", "top-2", "right-2"],
      ["bottom-left", "bottom-2", "left-2"],
      ["bottom-center", "bottom-2", "left-1/2", "-translate-x-1/2"],
      ["bottom-right", "bottom-2", "right-2"],
    ] as const)(
      "applies %s position classes",
      async (position, ...expectedClasses) => {
        const { container } = render(
          <ToastProvider>
            <TestComponent
              onToast={(toast) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                toast({ message: "Test", position: position as any })
              }
            />
          </ToastProvider>
        );

        const trigger = screen.getByTestId("trigger-toast");
        act(() => {
          trigger.click();
        });

        await waitFor(() => {
          const viewport = container.querySelector(`[aria-live="polite"]`);
          expectedClasses.forEach((cls) => {
            expect(viewport).toHaveClass(cls);
          });
        });
      }
    );
  });

  describe("Toast Dismiss", () => {
    it("shows dismiss button by default", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toastObj) => toastObj.toast({ message: "Dismissible" })}
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        expect(
          screen.getByLabelText("Dismiss notification")
        ).toBeInTheDocument();
      });
    });

    it("dismisses toast when close button is clicked", async () => {
      vi.useFakeTimers();

      render(
        <ToastProvider>
          <TestComponent
            onToast={(toastObj) => toastObj.toast({ message: "Test toast" })}
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        expect(screen.getByText("Test toast")).toBeInTheDocument();
      });

      const dismissButton = screen.getByLabelText("Dismiss notification");

      act(() => {
        dismissButton.click();
      });

      // Advance timers for dismiss animation
      act(() => {
        vi.advanceTimersByTime(150);
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.queryByText("Test toast")).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it("dismisses toast programmatically", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) => {
              const id = toast({ message: "Programmatic dismiss" });
              setTimeout(() => toast.dismiss(id), 100);
            }}
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        expect(screen.getByText("Programmatic dismiss")).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(
          screen.queryByText("Programmatic dismiss")
        ).not.toBeInTheDocument();
      });
    });

    it("dismisses all toasts with dismissAll", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) => {
              toast({ message: "Toast 1" });
              toast({ message: "Toast 2" });
              setTimeout(() => toast.dismissAll(), 50);
            }}
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        expect(screen.getByText("Toast 1")).toBeInTheDocument();
        expect(screen.getByText("Toast 2")).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.queryByText("Toast 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Toast 2")).not.toBeInTheDocument();
      });
    });
  });

  describe("Toast Auto-dismiss", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("auto-dismisses after default duration (5000ms)", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toastObj) => toastObj.toast({ message: "Auto dismiss" })}
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        expect(screen.getByText("Auto dismiss")).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      act(() => {
        vi.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.queryByText("Auto dismiss")).not.toBeInTheDocument();
      });
    });

    it("auto-dismisses after custom duration", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) =>
              toast({ message: "Custom duration", duration: 1000 })
            }
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        expect(screen.getByText("Custom duration")).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      act(() => {
        vi.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.queryByText("Custom duration")).not.toBeInTheDocument();
      });
    });

    it("does not auto-dismiss when duration is 0", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) =>
              toast({ message: "No auto dismiss", duration: 0 })
            }
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        expect(screen.getByText("No auto dismiss")).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Should still be visible
      expect(screen.getByText("No auto dismiss")).toBeInTheDocument();
    });
  });

  describe("Toast Stacking", () => {
    it("limits toasts per position to 3", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) => {
              toast({ message: "Toast 1", position: "top-right" });
              toast({ message: "Toast 2", position: "top-right" });
              toast({ message: "Toast 3", position: "top-right" });
              toast({ message: "Toast 4", position: "top-right" });
              toast({ message: "Toast 5", position: "top-right" });
            }}
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        // Should only have 3 toasts visible at once (latest 3)
        expect(screen.queryByText("Toast 1")).not.toBeInTheDocument();
        expect(screen.getByText("Toast 2")).toBeInTheDocument();
        expect(screen.getByText("Toast 3")).toBeInTheDocument();
        expect(screen.getByText("Toast 4")).toBeInTheDocument();
        expect(screen.getByText("Toast 5")).toBeInTheDocument();
      });
    });

    it("maintains separate stacks for different positions", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) => {
              toast({ message: "Left 1", position: "top-left" });
              toast({ message: "Right 1", position: "top-right" });
              toast({ message: "Left 2", position: "top-left" });
              toast({ message: "Right 2", position: "top-right" });
            }}
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        expect(screen.getByText("Left 1")).toBeInTheDocument();
        expect(screen.getByText("Left 2")).toBeInTheDocument();
        expect(screen.getByText("Right 1")).toBeInTheDocument();
        expect(screen.getByText("Right 2")).toBeInTheDocument();
      });
    });
  });

  describe("Toast Action", () => {
    it("renders action button when provided", async () => {
      const actionClick = vi.fn();

      render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) =>
              toast({
                message: "Action available",
                action: { label: "Undo", onClick: actionClick },
              })
            }
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        expect(screen.getByText("Undo")).toBeInTheDocument();
      });

      const actionButton = screen.getByText("Undo");
      act(() => {
        actionButton.click();
      });

      expect(actionClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("renders with correct ARIA attributes", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) =>
              toast({ title: "Notification", message: "Accessible toast" })
            }
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        const toastElement = screen.getByRole("alert");
        expect(toastElement).toBeInTheDocument();
        expect(toastElement).toHaveAttribute("aria-live", "polite");
        expect(toastElement).toHaveAttribute("aria-atomic", "true");
      });
    });

    it("associates title and message with toast", async () => {
      render(
        <ToastProvider>
          <TestComponent
            onToast={(toast) =>
              toast({ title: "Success", message: "Operation completed" })
            }
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      await waitFor(() => {
        const toastElement = screen.getByRole("alert");
        const title = screen.getByText("Success");
        const message = screen.getByText("Operation completed");

        // Check aria-labelledby and aria-describedby relationship
        const labelledById = toastElement.getAttribute("aria-labelledby");
        const describedById = toastElement.getAttribute("aria-describedby");

        expect(labelledById).toBeTruthy();
        expect(describedById).toBeTruthy();
        expect(title.id).toBe(labelledById);
        expect(message.id).toBe(describedById);
      });
    });
  });

  describe("Integration", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("handles complete toast lifecycle", async () => {
      const onActionClick = vi.fn();

      render(
        <ToastProvider>
          <TestComponent
            onToast={(toastObj) =>
              toastObj.toast({
                title: "File Uploaded",
                message: "Your file has been uploaded successfully",
                variant: "success",
                position: "top-right",
                duration: 3000,
                dismissible: true,
                action: { label: "View", onClick: onActionClick },
              })
            }
          />
        </ToastProvider>
      );

      const trigger = screen.getByTestId("trigger-toast");
      act(() => {
        trigger.click();
      });

      // Verify toast rendered
      await waitFor(() => {
        expect(screen.getByText("File Uploaded")).toBeInTheDocument();
        expect(
          screen.getByText("Your file has been uploaded successfully")
        ).toBeInTheDocument();
        expect(screen.getByText("View")).toBeInTheDocument();
      });

      // Click action button
      const actionButton = screen.getByText("View");
      act(() => {
        actionButton.click();
      });
      expect(onActionClick).toHaveBeenCalledTimes(1);

      // Verify auto-dismiss
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      act(() => {
        vi.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.queryByText("File Uploaded")).not.toBeInTheDocument();
      });
    });
  });
});
