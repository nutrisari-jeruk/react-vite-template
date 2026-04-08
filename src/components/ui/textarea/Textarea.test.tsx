import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "../ui/textarea";

describe("Textarea", () => {
  it("renders textarea correctly", () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Textarea label="Message" />);
    expect(screen.getByText("Message")).toBeInTheDocument();
  });

  it("associates label with textarea", () => {
    render(<Textarea label="Message" />);
    const textarea = screen.getByLabelText("Message");
    expect(textarea).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<Textarea label="Comment" error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(<Textarea label="Description" helperText="Be descriptive" />);
    expect(screen.getByText("Be descriptive")).toBeInTheDocument();
  });

  it("applies error styles when error is present", () => {
    render(<Textarea error="Error message" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("border-red-500");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Textarea placeholder="Type here" />);
    const textarea = screen.getByPlaceholderText("Type here");

    await user.type(textarea, "Hello world");
    expect(textarea).toHaveValue("Hello world");
  });

  it("disables textarea when disabled prop is true", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("applies small size styles", () => {
    render(<Textarea textareaSize="sm" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("applies large size styles", () => {
    render(<Textarea textareaSize="lg" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("px-5", "py-3", "text-lg");
  });
});
