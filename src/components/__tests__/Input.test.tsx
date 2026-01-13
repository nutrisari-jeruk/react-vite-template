import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../Input";

const TestIcon = () => <span data-testid="test-icon">Icon</span>;

describe("Input", () => {
  it("renders input correctly", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("associates label with input", () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<Input label="Username" error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(<Input label="Password" helperText="At least 8 characters" />);
    expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
  });

  it("renders left icon", () => {
    render(<Input iconLeft={<TestIcon />} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders right icon", () => {
    render(<Input iconRight={<TestIcon />} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("applies error variant styles", () => {
    render(<Input error="Error message" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-red-500");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("applies success variant styles", () => {
    render(<Input variant="success" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-green-500");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here");

    await user.type(input, "Hello");
    expect(input).toHaveValue("Hello");
  });

  it("disables input when disabled prop is true", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
