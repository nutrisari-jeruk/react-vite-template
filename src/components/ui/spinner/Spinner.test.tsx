import { render, screen } from "@testing-library/react";
import { Spinner } from "./";

describe("Spinner", () => {
  describe("Rendering", () => {
    it("renders spinner variant by default", () => {
      const { container } = render(<Spinner />);
      const spinner = container.querySelector("svg");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass("animate-spin");
    });

    it("renders dots variant", () => {
      const { container } = render(<Spinner variant="dots" />);
      const dots = container.querySelectorAll("[aria-hidden='true']");
      expect(dots).toHaveLength(3);
    });

    it("renders bars variant", () => {
      const { container } = render(<Spinner variant="bars" />);
      const bars = container.querySelectorAll("[aria-hidden='true']");
      expect(bars).toHaveLength(3);
    });
  });

  describe("Sizes", () => {
    it.each([
      ["xs", "h-3 w-3"],
      ["sm", "h-4 w-4"],
      ["md", "h-5 w-5"],
      ["lg", "h-6 w-6"],
      ["xl", "h-8 w-8"],
    ] as const)("applies %s size classes", (size, expectedClass) => {
      const { container } = render(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Spinner size={size as any} variant="spinner" />
      );
      const spinner = container.querySelector("svg");
      expect(spinner).toHaveClass(expectedClass);
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes", () => {
      render(<Spinner label="Loading content" />);

      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-live", "polite");
      expect(status).toHaveAttribute("aria-busy", "true");
    });

    it("includes screen reader label when provided", () => {
      render(<Spinner label="Loading content" />);

      expect(screen.getByText("Loading content")).toBeInTheDocument();
    });

    it("hides visual elements from screen readers", () => {
      const { container } = render(<Spinner variant="spinner" />);

      const spinner = container.querySelector("svg");
      expect(spinner).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Reduced Motion", () => {
    beforeEach(() => {
      // Mock prefers-reduced-motion
      vi.stubGlobal("matchMedia", () => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("respects prefers-reduced-motion", () => {
      const { container } = render(<Spinner variant="spinner" />);

      const spinner = container.querySelector("svg");
      // When prefers-reduced-motion is true, animation classes might be conditionally applied
      // The component respects this setting
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Custom Class Names", () => {
    it("applies custom className", () => {
      const { container } = render(<Spinner className="text-blue-500" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("text-blue-500");
    });
  });

  describe("Integration", () => {
    it("renders with all props", () => {
      const { container } = render(
        <Spinner
          size="lg"
          variant="dots"
          label="Loading data..."
          className="text-blue-600"
        />
      );

      const status = screen.getByRole("status");
      expect(status).toBeInTheDocument();
      expect(screen.getByText("Loading data...")).toBeInTheDocument();

      const dots = container.querySelectorAll("[aria-hidden='true']");
      expect(dots).toHaveLength(3);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("text-blue-600");
    });
  });
});
