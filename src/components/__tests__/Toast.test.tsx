import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "../ui/toast";
import { Button } from "../ui/button";

function TestComponent() {
  const { toast } = useToast();

  return (
    <div>
      <Button onClick={() => toast.success("Success message")}>
        Show Success
      </Button>
      <Button onClick={() => toast.error("Error message", "Error Title")}>
        Show Error
      </Button>
      <Button onClick={() => toast.warning("Warning message")}>
        Show Warning
      </Button>
      <Button onClick={() => toast.info("Info message")}>Show Info</Button>
    </div>
  );
}

describe("Toast", () => {
  it("shows success toast", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Show Success" }));
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  it("shows error toast with title", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Show Error" }));
    expect(screen.getByText("Error Title")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("dismisses toast when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Show Warning" }));
    expect(screen.getByText("Warning message")).toBeInTheDocument();

    const dismissButton = screen.getByRole("button", {
      name: "Dismiss notification",
    });
    await user.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByText("Warning message")).not.toBeInTheDocument();
    });
  });

  it("shows multiple toasts", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Show Success" }));
    await user.click(screen.getByRole("button", { name: "Show Info" }));

    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });
});
