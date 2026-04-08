import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImageWithFallback } from "../ui/image-with-fallback";

describe("ImageWithFallback", () => {
  it("renders image when src loads", () => {
    render(
      <ImageWithFallback src="https://example.com/image.png" alt="Test image" />
    );

    const img = screen.getByRole("img", { name: "Test image" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/image.png");
  });

  it("renders fallback when image errors", () => {
    render(
      <ImageWithFallback
        src="https://invalid-url/image.png"
        alt="Fails"
        fallback={<span>Image failed to load</span>}
      />
    );

    const img = screen.getByRole("img", { name: "Fails" });
    fireEvent.error(img);

    expect(screen.getByText("Image failed to load")).toBeInTheDocument();
  });
});
