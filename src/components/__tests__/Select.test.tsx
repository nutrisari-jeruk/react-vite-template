import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../ui/select";

describe("Select", () => {
  it("renders button element", () => {
    render(
      <Select>
        <option value="1">Option 1</option>
      </Select>
    );
    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeInTheDocument();
    expect(combobox).toHaveAttribute("aria-haspopup", "listbox");
    expect(combobox).toHaveTextContent("Option 1");
  });

  it("renders label when provided", () => {
    render(
      <Select label="Country">
        <option value="us">United States</option>
      </Select>
    );
    expect(screen.getByText("Country")).toBeInTheDocument();
  });

  it("associates label with button", () => {
    render(
      <Select label="Country">
        <option value="us">United States</option>
      </Select>
    );
    const button = screen.getByLabelText("Country");
    expect(button).toBeInTheDocument();
  });

  it("opens dropdown and shows options when clicked", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    );

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

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
    const handleChange = vi.fn();
    render(
      <Select onChange={handleChange}>
        <option value="">Select</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    const option1 = screen.getByRole("option", { name: "Option 1" });
    await user.click(option1);

    expect(handleChange).toHaveBeenCalledWith("1");
    expect(combobox).toHaveTextContent("Option 1");
  });

  it("disables button when disabled prop is true", () => {
    render(
      <Select disabled>
        <option value="1">Option 1</option>
      </Select>
    );
    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeDisabled();
  });

  it("does not open dropdown when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Select disabled>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("applies error styles when error is present", () => {
    render(
      <Select error="Error message">
        <option value="">Select</option>
      </Select>
    );
    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveClass("border-red-500");
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Select>
          <option value="1">Option 1</option>
        </Select>
        <div data-testid="outside">Outside</div>
      </div>
    );

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    const outside = screen.getByTestId("outside");
    await user.click(outside);

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("displays selected value", () => {
    render(
      <Select defaultValue="2">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );

    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveTextContent("Option 2");
  });

  it("shows selected option with blue background when dropdown is open", async () => {
    const user = userEvent.setup();
    render(
      <Select defaultValue="2">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    );

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    const selectedOption = screen.getByRole("option", { name: "Option 2" });
    expect(selectedOption).toHaveClass("bg-blue-600");
    expect(selectedOption).toHaveClass("text-white");
    expect(selectedOption).toHaveAttribute("aria-selected", "true");
  });
});
