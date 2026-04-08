import { render, screen } from "@testing-library/react";
import { Badge } from "../ui/badge";

describe("Badge", () => {
  it("renders children correctly", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    const { container } = render(<Badge>Default</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("bg-gray-100", "text-gray-800");
  });

  it("applies primary variant", () => {
    const { container } = render(<Badge variant="primary">Primary</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("bg-blue-50", "text-blue-700");
  });

  it("applies success variant", () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("bg-green-50", "text-green-700");
  });

  it("applies warning variant", () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("bg-yellow-50", "text-yellow-800");
  });

  it("applies danger variant", () => {
    const { container } = render(<Badge variant="danger">Danger</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("bg-red-50", "text-red-700");
  });

  it("applies small size", () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("px-2", "py-0.5", "text-xs");
  });

  it("applies large size", () => {
    const { container } = render(<Badge size="lg">Large</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("px-3", "py-1.5", "text-base");
  });

  it("renders as pill when pill prop is true", () => {
    const { container } = render(<Badge pill>Pill</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("rounded-full");
  });

  it("shows dot indicator when dot prop is true", () => {
    const { container } = render(<Badge dot>With Dot</Badge>);
    const badge = container.firstChild as HTMLElement;
    const dot = badge.querySelector("span");
    expect(dot).toHaveClass("rounded-full");
  });
});
