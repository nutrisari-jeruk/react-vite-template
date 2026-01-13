import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkbox from "../Checkbox";

describe("Checkbox", () => {
  it("renders checkbox input", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("type", "checkbox");
  });

  it("renders label when provided", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("associates label with checkbox", () => {
    render(<Checkbox label="Accept terms" />);
    const checkbox = screen.getByLabelText("Accept terms");
    expect(checkbox).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(<Checkbox label="Subscribe" helperText="Get updates" />);
    expect(screen.getByText("Get updates")).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<Checkbox label="Required" error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("handles check/uncheck", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Option" />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("disables checkbox when disabled prop is true", () => {
    render(<Checkbox label="Disabled" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
