import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../ui/button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("applies primary variant by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-blue-500");
  });

  it("applies secondary variant when specified", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-200");
  });

  it("applies danger variant when specified", () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-red-500");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  describe("Link variants", () => {
    it("applies link variant when specified", () => {
      render(<Button variant="link">Cancel</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-gray-900");
      expect(button).toHaveClass("hover:text-gray-700");
      expect(button).toHaveClass("hover:underline");
      expect(button).not.toHaveClass("rounded-full");
    });

    it("applies link-primary variant when specified", () => {
      render(<Button variant="link-primary">Learn more</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-blue-600");
      expect(button).toHaveClass("hover:text-blue-700");
      expect(button).toHaveClass("hover:underline");
      expect(button).not.toHaveClass("rounded-full");
    });

    it("applies link-muted variant when specified", () => {
      render(<Button variant="link-muted">Dismiss</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-gray-500");
      expect(button).toHaveClass("hover:text-gray-700");
      expect(button).toHaveClass("hover:underline");
      expect(button).not.toHaveClass("rounded-full");
    });

    it("link variant can be disabled", () => {
      render(
        <Button variant="link" disabled>
          Disabled Link
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:opacity-50");
    });
  });
});
