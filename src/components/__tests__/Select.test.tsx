import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "../Select";

describe("Select", () => {
  it("renders select element", () => {
    render(
      <Select>
        <option value="1">Option 1</option>
      </Select>
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(
      <Select label="Country">
        <option value="us">United States</option>
      </Select>
    );
    expect(screen.getByText("Country")).toBeInTheDocument();
  });

  it("associates label with select", () => {
    render(
      <Select label="Country">
        <option value="us">United States</option>
      </Select>
    );
    const select = screen.getByLabelText("Country");
    expect(select).toBeInTheDocument();
  });

  it("renders options correctly", () => {
    render(
      <Select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    );
    expect(
      screen.getByRole("option", { name: "Option 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Option 2" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Option 3" })
    ).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(
      <Select label="Category" error="This field is required">
        <option value="">Select</option>
      </Select>
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(
      <Select label="Size" helperText="Choose your size">
        <option value="">Select</option>
      </Select>
    );
    expect(screen.getByText("Choose your size")).toBeInTheDocument();
  });

  it("handles selection change", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <option value="">Select</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const select = screen.getByRole("combobox");

    await user.selectOptions(select, "1");
    expect(select).toHaveValue("1");
  });

  it("disables select when disabled prop is true", () => {
    render(
      <Select disabled>
        <option value="1">Option 1</option>
      </Select>
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("applies error styles when error is present", () => {
    render(
      <Select error="Error message">
        <option value="">Select</option>
      </Select>
    );
    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("border-red-500");
    expect(select).toHaveAttribute("aria-invalid", "true");
  });
});
