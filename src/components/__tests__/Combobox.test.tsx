import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox } from "../combobox";

const mockOptions = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
];

describe("Combobox", () => {
  it("renders combobox input", () => {
    render(<Combobox options={mockOptions} />);
    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Combobox options={mockOptions} label="Select option" />);
    expect(screen.getByText("Select option")).toBeInTheDocument();
  });

  it("displays placeholder", () => {
    render(<Combobox options={mockOptions} placeholder="Type to search..." />);
    expect(
      screen.getByPlaceholderText("Type to search...")
    ).toBeInTheDocument();
  });

  it("opens dropdown on focus", async () => {
    const user = userEvent.setup();
    render(<Combobox options={mockOptions} />);
    const combobox = screen.getByRole("combobox");

    await user.click(combobox);

    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    expect(within(listbox).getAllByRole("option")).toHaveLength(5);
  });

  it("filters options based on search query", async () => {
    const user = userEvent.setup();
    render(<Combobox options={mockOptions} />);
    const combobox = screen.getByRole("combobox");

    await user.click(combobox);
    await user.type(combobox, "apple");

    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Apple");
  });

  it("selects option on click", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Combobox options={mockOptions} onChange={onChange} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    const option = screen.getByText("Option 2");
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith("2");
  });

  it("displays selected value", () => {
    render(<Combobox options={mockOptions} value="2" />);
    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveValue("Option 2");
  });

  it("navigates options with keyboard", async () => {
    const user = userEvent.setup();
    render(<Combobox options={mockOptions} />);
    const combobox = screen.getByRole("combobox");

    await user.click(combobox);
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");

    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    expect(options[1]).toHaveClass("bg-blue-100");
  });

  it("selects option with Enter key", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Combobox options={mockOptions} onChange={onChange} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("closes dropdown on Escape key", async () => {
    const user = userEvent.setup();
    render(<Combobox options={mockOptions} />);
    const combobox = screen.getByRole("combobox");

    await user.click(combobox);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows no results message when no options match", async () => {
    const user = userEvent.setup();
    render(<Combobox options={mockOptions} />);
    const combobox = screen.getByRole("combobox");

    await user.click(combobox);
    await user.type(combobox, "xyz");

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(
      <Combobox
        options={mockOptions}
        label="Select"
        error="This field is required"
      />
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(
      <Combobox
        options={mockOptions}
        label="Select"
        helperText="Choose an option"
      />
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  it("disables combobox when disabled prop is true", () => {
    render(<Combobox options={mockOptions} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("renders left icon", () => {
    const Icon = () => <span data-testid="icon">Icon</span>;
    render(<Combobox options={mockOptions} iconLeft={<Icon />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
