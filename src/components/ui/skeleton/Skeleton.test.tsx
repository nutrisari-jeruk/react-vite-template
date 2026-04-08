import { render } from "@testing-library/react";
import { Skeleton, SkeletonText, SkeletonCard } from "../ui/skeleton";

describe("Skeleton", () => {
  it("renders skeleton with default variant", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("bg-gray-200");
    expect(container.firstChild).toHaveClass("rounded-md");
  });

  it("renders skeleton with circular variant", () => {
    const { container } = render(<Skeleton variant="circular" />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("renders skeleton with pulse animation", () => {
    const { container } = render(<Skeleton animation="pulse" />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("renders skeleton text with multiple lines", () => {
    const { container } = render(<SkeletonText lines={3} />);
    const skeletons = container.querySelectorAll(".bg-gray-200");
    expect(skeletons).toHaveLength(3);
  });

  it("renders skeleton card", () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll(".bg-gray-200");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
