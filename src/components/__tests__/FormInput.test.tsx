import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormInput from "../FormInput";

describe("FormInput", () => {
  it("renders label and input correctly", () => {
    render(<FormInput label="Username" id="username" />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toHaveAttribute("id", "username");
  });

  it("displays error message when provided", () => {
    render(
      <FormInput label="Email" id="email" error="Invalid email address" />
    );
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("applies error styles when error is present", () => {
    render(<FormInput label="Email" id="email" error="Invalid email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveClass("border-red-500");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<FormInput label="Test" id="test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("passes through additional props", () => {
    render(
      <FormInput
        label="Password"
        id="password"
        type="password"
        placeholder="Enter password"
      />
    );
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("placeholder", "Enter password");
  });
});
