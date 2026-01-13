import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Switch from "../Switch";

describe("Switch", () => {
  it("renders switch input", () => {
    render(<Switch />);
    const switchInput = screen.getByRole("checkbox");
    expect(switchInput).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Switch label="Enable notifications" />);
    expect(screen.getByText("Enable notifications")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(<Switch label="Dark mode" helperText="Toggle theme" />);
    expect(screen.getByText("Toggle theme")).toBeInTheDocument();
  });

  it("handles toggle on/off", async () => {
    const user = userEvent.setup();
    render(<Switch label="Toggle" />);
    const switchInput = screen.getByRole("checkbox");

    expect(switchInput).not.toBeChecked();
    await user.click(switchInput);
    expect(switchInput).toBeChecked();
    await user.click(switchInput);
    expect(switchInput).not.toBeChecked();
  });

  it("calls onCheckedChange when toggled", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch label="Toggle" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("respects controlled checked state", () => {
    const { rerender } = render(<Switch checked={false} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    rerender(<Switch checked={true} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("disables switch when disabled prop is true", () => {
    render(<Switch label="Disabled" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
