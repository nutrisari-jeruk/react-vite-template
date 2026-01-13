import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Avatar from "../Avatar";

describe("Avatar", () => {
  it("renders with initials", () => {
    render(<Avatar initials="TG" />);
    expect(screen.getByText("TG")).toBeInTheDocument();
  });

  it("renders with image src", () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="Test Avatar" />);
    const img = screen.getByAltText("Test Avatar");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("renders with default size", () => {
    const { container } = render(<Avatar initials="TG" />);
    const avatar = container.querySelector(".w-10");
    expect(avatar).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { container: xsContainer } = render(
      <Avatar initials="XS" size="xs" />
    );
    expect(xsContainer.querySelector(".w-6")).toBeInTheDocument();

    const { container: xlContainer } = render(
      <Avatar initials="XL" size="xl" />
    );
    expect(xlContainer.querySelector(".w-16")).toBeInTheDocument();
  });

  it("renders with circle shape by default", () => {
    const { container } = render(<Avatar initials="TG" />);
    const avatar = container.querySelector(".rounded-full");
    expect(avatar).toBeInTheDocument();
  });

  it("renders with square shape", () => {
    const { container } = render(<Avatar initials="TG" shape="square" />);
    const avatar = container.querySelector(".rounded-lg");
    expect(avatar).toBeInTheDocument();
  });

  it("renders with status indicator", () => {
    const { container } = render(<Avatar initials="TG" status />);
    const statusIndicator = container.querySelector(".bg-green-500");
    expect(statusIndicator).toBeInTheDocument();
  });

  it("renders with different status colors", () => {
    const { container } = render(
      <Avatar initials="TG" status statusColor="red" />
    );
    const statusIndicator = container.querySelector(".bg-red-500");
    expect(statusIndicator).toBeInTheDocument();
  });

  it("renders with different background colors", () => {
    const { container } = render(
      <Avatar initials="TG" backgroundColor="purple" />
    );
    const avatar = container.querySelector(".bg-purple-500");
    expect(avatar).toBeInTheDocument();
  });

  it("renders fallback when no initials or src provided", () => {
    render(<Avatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Avatar initials="TG" className="custom-class" />
    );
    const wrapper = container.querySelector(".custom-class");
    expect(wrapper).toBeInTheDocument();
  });

  it("converts initials to uppercase", () => {
    render(<Avatar initials="tg" />);
    const initialsElement = screen.getByText("tg");
    expect(initialsElement).toHaveClass("uppercase");
  });
});
