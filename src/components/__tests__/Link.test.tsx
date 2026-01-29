import { render, screen } from "@/testing";
import { Link } from "../ui/link";

describe("Link", () => {
  it("renders children correctly", () => {
    render(<Link to="/test">Test Link</Link>);
    expect(screen.getByText("Test Link")).toBeInTheDocument();
  });

  it("renders with correct href attribute", () => {
    render(<Link to="/destination">Go to destination</Link>);
    const link = screen.getByText("Go to destination");
    expect(link).toHaveAttribute("href", "/destination");
  });

  it("applies default variant styles", () => {
    const { container } = render(<Link to="/test">Default Link</Link>);
    const link = container.firstChild as HTMLElement;
    expect(link).toHaveClass("text-gray-900");
  });

  it("applies primary variant", () => {
    const { container } = render(
      <Link to="/test" variant="primary">
        Primary Link
      </Link>
    );
    const link = container.firstChild as HTMLElement;
    expect(link).toHaveClass("text-blue-600");
  });

  it("applies muted variant", () => {
    const { container } = render(
      <Link to="/test" variant="muted">
        Muted Link
      </Link>
    );
    const link = container.firstChild as HTMLElement;
    expect(link).toHaveClass("text-gray-500");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Link to="/test" className="font-bold hover:underline">
        Custom Link
      </Link>
    );
    const link = container.firstChild as HTMLElement;
    expect(link).toHaveClass("font-bold", "hover:underline");
  });

  it("applies transition colors by default", () => {
    const { container } = render(<Link to="/test">Transition Link</Link>);
    const link = container.firstChild as HTMLElement;
    expect(link).toHaveClass("transition-colors");
  });

  it("passes through additional props", () => {
    render(
      <Link to="/test" aria-label="Test aria label">
        Link with aria
      </Link>
    );
    const link = screen.getByText("Link with aria");
    expect(link).toHaveAttribute("aria-label", "Test aria label");
  });

  it("renders with relative path", () => {
    render(<Link to="../parent">Parent Link</Link>);
    const link = screen.getByText("Parent Link");
    // React Router normalizes relative paths
    expect(link).toHaveAttribute("href", "/parent");
  });

  it("renders with absolute path", () => {
    render(<Link to="/absolute/path">Absolute Link</Link>);
    const link = screen.getByText("Absolute Link");
    expect(link).toHaveAttribute("href", "/absolute/path");
  });
});
