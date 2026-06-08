import { render, screen } from "@testing-library/react";
import { Progress } from "./";

describe("Progress", () => {
  describe("Linear Progress", () => {
    it("renders linear progress by default", () => {
      const { container } = render(<Progress value={50} max={100} />);

      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toBeInTheDocument();
      expect(progressbar).toHaveAttribute("aria-valuemax", "100");
      expect(progressbar).toHaveAttribute("aria-valuenow", "50");
    });

    it("displays correct percentage", () => {
      const { container } = render(<Progress value={75} max={100} />);

      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute("aria-valuenow", "75");
    });

    it("handles zero value", () => {
      const { container } = render(<Progress value={0} max={100} />);

      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute("aria-valuenow", "0");
    });

    it("handles undefined value (indeterminate)", () => {
      const { container } = render(<Progress max={100} />);

      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toBeInTheDocument();
      expect(progressbar).toHaveAttribute("aria-valuenow", "0");
    });

    it("clamps values above max", () => {
      const { container } = render(<Progress value={150} max={100} />);

      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute("aria-valuenow", "100");
    });

    it("clamps negative values", () => {
      const { container } = render(<Progress value={-10} max={100} />);

      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute("aria-valuenow", "0");
    });
  });

  describe("Circular Progress", () => {
    it("renders circular progress", () => {
      const { container } = render(
        <Progress value={50} max={100} variant="circular" />
      );

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders circular progress with value display", () => {
      render(<Progress value={60} max={100} variant="circular" showValue />);

      expect(screen.getByText("60%")).toBeInTheDocument();
    });

    it("handles different sizes for circular", () => {
      const { container } = render(
        <Progress value={50} max={100} variant="circular" size="sm" />
      );

      const wrapper = container.querySelector('[role="progressbar"]');
      expect(wrapper).toHaveClass("size-8");
    });
  });

  describe("Sizes", () => {
    it.each([
      ["sm", "h-1"],
      ["md", "h-2"],
      ["lg", "h-3"],
    ] as const)("applies %s size classes for linear", (size, expectedClass) => {
      const { container } = render(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Progress value={50} max={100} size={size as any} />
      );

      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveClass(expectedClass);
    });

    it.each([
      ["sm", "size-8"],
      ["md", "size-12"],
      ["lg", "size-16"],
    ] as const)(
      "applies %s size classes for circular",
      (size, expectedClass) => {
        const { container } = render(
          <Progress
            value={50}
            max={100}
            variant="circular"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            size={size as any}
          />
        );

        const wrapper = container.querySelector('[role="progressbar"]');
        expect(wrapper).toHaveClass(expectedClass);
      }
    );
  });

  describe("Label and Value Display", () => {
    it("shows label when provided", () => {
      render(<Progress value={50} max={100} label="Loading..." />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("shows percentage when showValue is true", () => {
      render(<Progress value={75} max={100} showValue />);

      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("shows both label and value", () => {
      render(<Progress value={30} max={100} label="Uploading" showValue />);

      expect(screen.getByText("Uploading")).toBeInTheDocument();
      expect(screen.getByText("30%")).toBeInTheDocument();
    });

    it("does not show label or value by default", () => {
      const { container } = render(<Progress value={50} max={100} />);

      expect(container.querySelector("span")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes", () => {
      const { container } = render(
        <Progress value={60} max={100} label="File upload" />
      );

      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveAttribute("role", "progressbar");
      expect(progressbar).toHaveAttribute("aria-valuemin", "0");
      expect(progressbar).toHaveAttribute("aria-valuemax", "100");
      expect(progressbar).toHaveAttribute("aria-valuenow", "60");
      expect(progressbar).toHaveAttribute("aria-label", "File upload");
    });

    it("uses tabular-nums for value display", () => {
      render(<Progress value={42} max={100} showValue />);

      const value = screen.getByText("42%");
      expect(value).toHaveClass("tabular-nums");
    });
  });

  describe("Custom Class Names", () => {
    it("applies custom className", () => {
      const { container } = render(
        <Progress value={50} max={100} className="custom-progress" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-progress");
    });
  });

  describe("Integration", () => {
    it("handles complete progress lifecycle with all features", () => {
      const { container } = render(
        <Progress
          value={85}
          max={100}
          variant="linear"
          size="lg"
          label="Processing file"
          showValue
          className="w-64"
        />
      );

      const progressbar = container.querySelector('[role="progressbar"]');
      expect(progressbar).toHaveClass("h-3");
      expect(progressbar).toHaveAttribute("aria-valuenow", "85");

      expect(screen.getByText("Processing file")).toBeInTheDocument();
      expect(screen.getByText("85%")).toBeInTheDocument();

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("w-64");
    });

    it("handles circular progress with all features", () => {
      render(
        <Progress value={67} max={100} variant="circular" size="lg" showValue />
      );

      expect(screen.getByText("67%")).toBeInTheDocument();

      const svg = screen.getByRole("progressbar").querySelector("svg");
      expect(svg?.parentElement).toHaveClass("size-16");
    });
  });
});
