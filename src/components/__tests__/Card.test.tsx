import React from "react";
import { render, screen } from "@testing-library/react";
import Card from "../Card";

describe("Card", () => {
  it("renders children correctly", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-white", "rounded-lg", "shadow-md");
  });

  it("applies outlined variant", () => {
    const { container } = render(<Card variant="outlined">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("border-2", "border-gray-300");
  });

  it("applies elevated variant", () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("shadow-xl");
  });

  it("applies flat variant", () => {
    const { container } = render(<Card variant="flat">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-gray-50");
  });

  it("renders title when provided", () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<Card description="Card description">Content</Card>);
    expect(screen.getByText("Card description")).toBeInTheDocument();
  });

  it("renders title and description together", () => {
    render(
      <Card title="Title" description="Description">
        Content
      </Card>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });
});
