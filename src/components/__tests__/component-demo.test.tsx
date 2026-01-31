import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComponentDemo } from "../component-demo";

describe("ComponentDemo", () => {
  it("renders title and preview", () => {
    render(
      <ComponentDemo
        title="Button Demo"
        preview={<button type="button">Click me</button>}
        code="<Button>Click</Button>"
      />
    );

    expect(screen.getByText("Button Demo")).toBeInTheDocument();
    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.getByText("Code")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <ComponentDemo
        title="Demo"
        description="A test component"
        preview={<div>Preview</div>}
        code="code"
      />
    );

    expect(screen.getByText("A test component")).toBeInTheDocument();
  });

  it("renders props table when props provided", () => {
    render(
      <ComponentDemo
        title="Demo"
        preview={<div>Preview</div>}
        code="code"
        props={[
          {
            name: "variant",
            type: "string",
            default: "primary",
            description: "Button style",
          },
        ]}
      />
    );

    expect(screen.getByText("Props")).toBeInTheDocument();
    expect(screen.getByText("variant")).toBeInTheDocument();
    expect(screen.getByText("string")).toBeInTheDocument();
    expect(screen.getByText("primary")).toBeInTheDocument();
    expect(screen.getByText("Button style")).toBeInTheDocument();
  });

  it("does not render props section when props is empty", () => {
    render(
      <ComponentDemo title="Demo" preview={<div>Preview</div>} code="code" />
    );

    expect(screen.queryByText("Props")).not.toBeInTheDocument();
  });
});
