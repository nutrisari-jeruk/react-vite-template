import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AvatarGroup from "../AvatarGroup";
import Avatar from "../Avatar";

describe("AvatarGroup", () => {
  it("renders all avatars when no max is set", () => {
    render(
      <AvatarGroup>
        <Avatar initials="A1" />
        <Avatar initials="A2" />
        <Avatar initials="A3" />
      </AvatarGroup>
    );

    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("A2")).toBeInTheDocument();
    expect(screen.getByText("A3")).toBeInTheDocument();
  });

  it("renders max avatars and shows +X indicator", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar initials="A1" />
        <Avatar initials="A2" />
        <Avatar initials="A3" />
        <Avatar initials="A4" />
      </AvatarGroup>
    );

    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("A2")).toBeInTheDocument();
    expect(screen.queryByText("A3")).not.toBeInTheDocument();
    expect(screen.queryByText("A4")).not.toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders single avatar", () => {
    render(
      <AvatarGroup>
        <Avatar initials="A1" />
      </AvatarGroup>
    );

    expect(screen.getByText("A1")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AvatarGroup className="custom-class">
        <Avatar initials="A1" />
      </AvatarGroup>
    );

    const group = container.querySelector(".custom-class");
    expect(group).toBeInTheDocument();
  });

  it("applies correct spacing classes", () => {
    const { container } = render(
      <AvatarGroup spacing="tight">
        <Avatar initials="A1" />
        <Avatar initials="A2" />
      </AvatarGroup>
    );

    const group = container.querySelector(".-space-x-4");
    expect(group).toBeInTheDocument();
  });

  it("calculates remaining count correctly", () => {
    render(
      <AvatarGroup max={3}>
        <Avatar initials="A1" />
        <Avatar initials="A2" />
        <Avatar initials="A3" />
        <Avatar initials="A4" />
        <Avatar initials="A5" />
      </AvatarGroup>
    );

    expect(screen.getByText("+2")).toBeInTheDocument();
  });
});
