import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "../ui/switch";

const SunIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

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

  it("handles switch on/off", async () => {
    const user = userEvent.setup();
    render(<Switch label="Switch" />);
    const switchInput = screen.getByRole("checkbox");

    expect(switchInput).not.toBeChecked();
    await user.click(switchInput);
    expect(switchInput).toBeChecked();
    await user.click(switchInput);
    expect(switchInput).not.toBeChecked();
  });

  it("calls onCheckedChange when switched", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch label="Switch" onCheckedChange={onCheckedChange} />);

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

  it("renders label on the right by default", () => {
    render(<Switch label="Test label" />);
    const labelElement = screen.getByText("Test label");
    const switchInput = screen.getByRole("checkbox");

    const parent = labelElement.parentElement;
    const switchParent = switchInput.closest("label")?.parentElement;

    expect(parent).toBe(switchParent);
    const children = Array.from(parent?.children || []);
    const switchIndex = children.findIndex((child) =>
      child.contains(switchInput)
    );
    const labelIndex = children.findIndex((child) => child === labelElement);

    expect(labelIndex).toBeGreaterThan(switchIndex);
  });

  it("renders label on the left when labelPosition is left", () => {
    render(<Switch label="Left label" labelPosition="left" />);
    const labelElement = screen.getByText("Left label");
    const switchInput = screen.getByRole("checkbox");
    const parent = labelElement.parentElement;
    const switchParent = switchInput.closest("label")?.parentElement;
    expect(parent).toBe(switchParent);
    const children = Array.from(parent?.children || []);
    const switchIndex = children.findIndex((child) =>
      child.contains(switchInput)
    );
    const labelIndex = children.findIndex((child) => child === labelElement);
    expect(labelIndex).toBeLessThan(switchIndex);
  });

  it("renders icons when leftIcon and rightIcon are provided", () => {
    render(<Switch leftIcon={<SunIcon />} rightIcon={<MoonIcon />} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    const container = screen.getByRole("checkbox").closest("label");
    expect(container).toBeInTheDocument();
  });

  it("highlights left icon when unchecked in icon mode", () => {
    render(
      <Switch leftIcon={<SunIcon />} rightIcon={<MoonIcon />} checked={false} />
    );
    const switchInput = screen.getByRole("checkbox");
    const label = switchInput.closest("label");
    const container = label?.querySelector("div");
    const leftIconContainer = container?.firstElementChild as HTMLElement;
    expect(leftIconContainer).toHaveClass("bg-blue-600");
  });

  it("highlights right icon when checked in icon mode", () => {
    render(
      <Switch leftIcon={<SunIcon />} rightIcon={<MoonIcon />} checked={true} />
    );
    const switchInput = screen.getByRole("checkbox");
    const label = switchInput.closest("label");
    const container = label?.querySelector("div");
    const rightIconContainer = container?.lastElementChild as HTMLElement;
    expect(rightIconContainer).toHaveClass("bg-blue-600");
  });

  it("handles switch in icon mode", async () => {
    const user = userEvent.setup();
    render(<Switch leftIcon={<SunIcon />} rightIcon={<MoonIcon />} />);
    const switchInput = screen.getByRole("checkbox");
    const label = switchInput.closest("label");
    const container = label?.querySelector("div");
    const leftIconContainer = container?.firstElementChild as HTMLElement;
    const rightIconContainer = container?.lastElementChild as HTMLElement;

    expect(switchInput).not.toBeChecked();
    expect(leftIconContainer).toHaveClass("bg-blue-600");
    expect(rightIconContainer).not.toHaveClass("bg-blue-600");

    await user.click(switchInput);
    expect(switchInput).toBeChecked();
    expect(rightIconContainer).toHaveClass("bg-blue-600");
    expect(leftIconContainer).not.toHaveClass("bg-blue-600");
  });

  it("disables icon switch when disabled prop is true", () => {
    render(<Switch leftIcon={<SunIcon />} rightIcon={<MoonIcon />} disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
