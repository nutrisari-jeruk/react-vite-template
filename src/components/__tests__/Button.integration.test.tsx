/**
 * Button Integration Tests
 *
 * Tests button interactions in real-world scenarios
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Button } from "../ui/button";

describe("Button Integration Tests", () => {
  it("handles async operations with loading state", async () => {
    const user = userEvent.setup();

    function AsyncButton() {
      const [loading, setLoading] = useState(false);
      const [message, setMessage] = useState("");

      const handleClick = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 100));
        setMessage("Success!");
        setLoading(false);
      };

      return (
        <div>
          <Button onClick={handleClick} loading={loading}>
            {loading ? "Loading..." : "Click me"}
          </Button>
          {message && <p>{message}</p>}
        </div>
      );
    }

    render(<AsyncButton />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Click me");
    expect(button).not.toBeDisabled();

    await user.click(button);

    // Button should be disabled during loading
    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    // Success message should appear after loading
    await waitFor(
      () => {
        expect(screen.getByText("Success!")).toBeInTheDocument();
      },
      { timeout: 200 }
    );

    // Button should be enabled again
    expect(button).not.toBeDisabled();
  });

  it("works in form submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((e) => e.preventDefault());

    render(
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" defaultValue="test@example.com" />
        <Button type="submit">Submit</Button>
      </form>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it("prevents double clicks when loading", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    function DoubleClickTest() {
      const [loading, setLoading] = useState(false);

      const onClick = () => {
        handleClick();
        setLoading(true);
        setTimeout(() => setLoading(false), 100);
      };

      return (
        <Button onClick={onClick} loading={loading}>
          Click me
        </Button>
      );
    }

    render(<DoubleClickTest />);

    const button = screen.getByRole("button");

    await user.click(button);
    await user.click(button);
    await user.click(button);

    // Should only be called once because button becomes disabled
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <div>
        <input type="text" />
        <Button onClick={handleClick}>Submit</Button>
      </div>
    );

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button");

    // Tab to button
    await user.tab();
    expect(input).toHaveFocus();

    await user.tab();
    expect(button).toHaveFocus();

    // Activate with Enter or Space
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
