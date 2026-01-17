import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "../ui/toggle";

describe("Toggle", () => {
  it("renders toggle input", () => {
    render(<Toggle />);
    const toggleInput = screen.getByRole("checkbox");
    expect(toggleInput).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Toggle label="Enable notifications" />);
    expect(screen.getByText("Enable notifications")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(<Toggle label="Dark mode" helperText="Toggle theme" />);
    expect(screen.getByText("Toggle theme")).toBeInTheDocument();
  });

  it("handles toggle on/off", async () => {
    const user = userEvent.setup();
    render(<Toggle label="Toggle" />);
    const toggleInput = screen.getByRole("checkbox");

    expect(toggleInput).not.toBeChecked();
    await user.click(toggleInput);
    expect(toggleInput).toBeChecked();
    await user.click(toggleInput);
    expect(toggleInput).not.toBeChecked();
  });

  it("calls onCheckedChange when toggled", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Toggle label="Toggle" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("respects controlled checked state", () => {
    const { rerender } = render(<Toggle checked={false} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    rerender(<Toggle checked={true} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("disables toggle when disabled prop is true", () => {
    render(<Toggle label="Disabled" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("renders label on the right by default", () => {
    render(<Toggle label="Test label" />);
    const labelElement = screen.getByText("Test label");
    const toggleInput = screen.getByRole("checkbox");

    const parent = labelElement.parentElement;
    const toggleParent = toggleInput.closest("label")?.parentElement;

    expect(parent).toBe(toggleParent);
    const children = Array.from(parent?.children || []);
    const toggleIndex = children.findIndex((child) =>
      child.contains(toggleInput)
    );
    const labelIndex = children.findIndex((child) => child === labelElement);

    expect(labelIndex).toBeGreaterThan(toggleIndex);
  });

  it("renders label on the left when labelPosition is left", () => {
    render(<Toggle label="Left label" labelPosition="left" />);
    const labelElement = screen.getByText("Left label");
    const toggleInput = screen.getByRole("checkbox");
    const parent = labelElement.parentElement;
    const toggleParent = toggleInput.closest("label")?.parentElement;
    expect(parent).toBe(toggleParent);
    const children = Array.from(parent?.children || []);
    const toggleIndex = children.findIndex((child) =>
      child.contains(toggleInput)
    );
    const labelIndex = children.findIndex((child) => child === labelElement);
    expect(labelIndex).toBeLessThan(toggleIndex);
  });

  it("renders dual labels when leftLabel and rightLabel are provided", () => {
    render(<Toggle leftLabel="Light" rightLabel="Dark" />);
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("highlights left label when unchecked in dual label mode", () => {
    render(<Toggle leftLabel="Light" rightLabel="Dark" checked={false} />);
    const leftLabel = screen.getByText("Light");
    const rightLabel = screen.getByText("Dark");
    expect(leftLabel).toHaveClass("font-semibold", "text-gray-900");
    expect(rightLabel).toHaveClass("text-gray-600");
    expect(rightLabel).not.toHaveClass("font-semibold");
  });

  it("highlights right label when checked in dual label mode", () => {
    render(<Toggle leftLabel="Light" rightLabel="Dark" checked={true} />);
    const leftLabel = screen.getByText("Light");
    const rightLabel = screen.getByText("Dark");
    expect(rightLabel).toHaveClass("font-semibold", "text-gray-900");
    expect(leftLabel).toHaveClass("text-gray-600");
    expect(leftLabel).not.toHaveClass("font-semibold");
  });

  it("handles toggle in dual label mode", async () => {
    const user = userEvent.setup();
    render(<Toggle leftLabel="Light" rightLabel="Dark" />);
    const toggleInput = screen.getByRole("checkbox");
    const leftLabel = screen.getByText("Light");
    const rightLabel = screen.getByText("Dark");

    expect(toggleInput).not.toBeChecked();
    expect(leftLabel).toHaveClass("font-semibold");
    expect(rightLabel).not.toHaveClass("font-semibold");

    await user.click(toggleInput);
    expect(toggleInput).toBeChecked();
    expect(rightLabel).toHaveClass("font-semibold");
    expect(leftLabel).not.toHaveClass("font-semibold");
  });

  it("disables dual label toggle when disabled prop is true", () => {
    render(<Toggle leftLabel="Light" rightLabel="Dark" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
    const leftLabel = screen.getByText("Light");
    const rightLabel = screen.getByText("Dark");
    expect(leftLabel).toHaveClass("text-gray-400");
    expect(rightLabel).toHaveClass("text-gray-400");
  });
});
