import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Alert from "../Alert";

describe("Alert", () => {
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

  it("calls onDismiss and hides alert when dismiss button is clicked", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(
      <Alert dismissible onDismiss={onDismiss}>
        Alert
      </Alert>
    );

    const dismissButton = screen.getByLabelText("Dismiss");
    await user.click(dismissButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Alert")).not.toBeInTheDocument();
  });

  it("renders custom icon when provided", () => {
    const CustomIcon = () => <span data-testid="custom-icon">Custom</span>;
    render(<Alert icon={<CustomIcon />}>Alert</Alert>);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
