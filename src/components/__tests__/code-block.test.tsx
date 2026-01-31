import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "../code-block";

describe("CodeBlock", () => {
  const mockWriteText = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });
  });

  it("renders code content", () => {
    render(<CodeBlock code="const x = 1;" />);

    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
  });

  it("renders language label", () => {
    render(<CodeBlock code="code" language="javascript" />);

    expect(screen.getByText("javascript")).toBeInTheDocument();
  });

  it("renders Copy button", () => {
    render(<CodeBlock code="code" />);

    expect(
      screen.getByRole("button", { name: "Copy code" })
    ).toBeInTheDocument();
  });

  it("shows Copied when Copy is clicked and clipboard succeeds", async () => {
    mockWriteText.mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<CodeBlock code="const x = 1;" />);

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });

  it("renders line numbers when showLineNumbers is true", () => {
    render(<CodeBlock code={"line1\nline2"} showLineNumbers />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getAllByText(/^[12]$/).length).toBeGreaterThanOrEqual(1);
  });
});
