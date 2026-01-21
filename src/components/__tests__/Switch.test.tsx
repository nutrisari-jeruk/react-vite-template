import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "../ui/switch";

const SunIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    className="h-5 w-5"
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
    className="h-5 w-5"
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
  it("renders segmented control with labels", () => {
    render(<Switch leftLabel="Light mode" rightLabel="Dark mode" />);
    expect(screen.getByText("Light mode")).toBeInTheDocument();
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });

  it("renders segmented control with icons", () => {
    render(<Switch leftIcon={<SunIcon />} rightIcon={<MoonIcon />} />);
    const switchInput = screen.getByRole("switch");
    expect(switchInput).toBeInTheDocument();
  });

  it("renders segmented control with labels and icons", () => {
    render(
      <Switch
        leftLabel="Light"
        rightLabel="Dark"
        leftIcon={<SunIcon />}
        rightIcon={<MoonIcon />}
      />
    );
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
  });

  it("handles segmented control toggle", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        leftLabel="Light"
        rightLabel="Dark"
        onCheckedChange={onCheckedChange}
      />
    );

    const rightSegment = screen.getByText("Dark");
    await user.click(rightSegment);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("highlights left segment when unchecked", () => {
    render(<Switch leftLabel="Light" rightLabel="Dark" checked={false} />);
    const leftLabel = screen.getByText("Light");
    const leftSegment = leftLabel.closest("div.relative.flex");
    expect(leftSegment).toHaveClass("bg-white", "text-blue-600");
  });

  it("highlights right segment when checked", () => {
    render(<Switch leftLabel="Light" rightLabel="Dark" checked={true} />);
    const rightLabel = screen.getByText("Dark");
    const rightSegment = rightLabel.closest("div.relative.flex");
    expect(rightSegment).toHaveClass("bg-white", "text-blue-600");
  });

  it("disables segmented control when disabled prop is true", () => {
    render(<Switch leftLabel="Light" rightLabel="Dark" disabled />);
    const switchInput = screen.getByRole("switch");
    expect(switchInput).toHaveAttribute("aria-disabled", "true");
  });

  it("renders label for segmented variant", () => {
    render(<Switch label="Theme" leftLabel="Light" rightLabel="Dark" />);
    expect(screen.getByText("Theme")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(
      <Switch
        label="Theme"
        leftLabel="Light"
        rightLabel="Dark"
        helperText="Choose your theme"
      />
    );
    expect(screen.getByText("Choose your theme")).toBeInTheDocument();
  });

  it("respects controlled checked state", () => {
    const { rerender } = render(
      <Switch leftLabel="Light" rightLabel="Dark" checked={false} />
    );
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");

    rerender(<Switch leftLabel="Light" rightLabel="Dark" checked={true} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onCheckedChange when toggled", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Switch
        leftLabel="Light"
        rightLabel="Dark"
        onCheckedChange={onCheckedChange}
      />
    );

    const leftSegment = screen.getByText("Light");
    await user.click(leftSegment);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });
});
