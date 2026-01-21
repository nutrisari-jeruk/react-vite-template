import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "../ui/tooltip";
import { Button } from "../ui/button";

describe("Tooltip", () => {
  it("renders trigger correctly", () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("applies dark variant by default", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Dark tooltip">
        <button>Hover</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover");
    await user.hover(trigger);

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveClass("bg-gray-900", "text-white");
  });

  it("applies light variant", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Light tooltip" variant="light">
        <button>Hover</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover");
    await user.hover(trigger);

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveClass("bg-white", "text-gray-900", "border");
  });

  it("renders content correctly", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover me");
    await user.hover(trigger);

    expect(await screen.findByText("Tooltip content")).toBeInTheDocument();
  });

  it("does not render tooltip when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip content" disabled>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover me");
    await user.hover(trigger);

    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("works with Button component as trigger", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Button tooltip">
        <Button>Click me</Button>
      </Tooltip>
    );

    const trigger = screen.getByText("Click me");
    await user.hover(trigger);

    expect(await screen.findByText("Button tooltip")).toBeInTheDocument();
  });

  it("applies custom className", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Custom tooltip" className="custom-class">
        <button>Hover</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover");
    await user.hover(trigger);

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveClass("custom-class");
  });
});
