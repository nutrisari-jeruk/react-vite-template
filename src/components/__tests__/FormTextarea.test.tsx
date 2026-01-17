import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormTextarea } from "../form-textarea";

describe("FormTextarea Component", () => {
  describe("Rendering", () => {
    it("renders textarea element", () => {
      render(<FormTextarea label="Test" id="test" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
    });

    it("renders label", () => {
      render(<FormTextarea label="Enter message" id="test" />);
      expect(screen.getByText("Enter message")).toBeInTheDocument();
    });

    it("associates label with textarea via id", () => {
      render(<FormTextarea label="Test" id="test-textarea" />);
      const label = screen.getByText("Test");
      const textarea = screen.getByRole("textbox");

      expect(label).toHaveAttribute("for", "test-textarea");
      expect(textarea).toHaveAttribute("id", "test-textarea");
    });
  });

  describe("User Interaction", () => {
    it("allows typing text", async () => {
      const user = userEvent.setup();
      render(<FormTextarea label="Test" id="test" />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Hello, world!");

      expect(textarea).toHaveValue("Hello, world!");
    });

    it("calls onChange when text is entered", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<FormTextarea label="Test" id="test" onChange={handleChange} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "a");

      expect(handleChange).toHaveBeenCalled();
    });

    it("can be disabled", () => {
      render(<FormTextarea label="Test" id="test" disabled />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeDisabled();
    });

    it("can be read-only", () => {
      render(<FormTextarea label="Test" id="test" readOnly />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("readonly");
    });
  });

  describe("Error State", () => {
    it("displays error message when error prop is provided", () => {
      render(
        <FormTextarea label="Test" id="test" error="This field is required" />
      );

      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("does not display error message when error prop is not provided", () => {
      render(<FormTextarea label="Test" id="test" />);

      expect(
        screen.queryByText("This field is required")
      ).not.toBeInTheDocument();
    });

    it("applies error styling to textarea when error exists", () => {
      render(<FormTextarea label="Test" id="test" error="Field required" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("border-red-500");
      expect(textarea).toHaveClass("bg-red-50");
    });

    it("applies normal styling when no error", () => {
      render(<FormTextarea label="Test" id="test" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("border-gray-300");
      expect(textarea).not.toHaveClass("border-red-500");
    });
  });

  describe("Styling", () => {
    it("applies custom className", () => {
      render(<FormTextarea label="Test" id="test" className="custom-class" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("custom-class");
    });

    it("applies default styling classes", () => {
      render(<FormTextarea label="Test" id="test" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("px-4", "py-2", "border", "rounded-lg");
    });

    it("applies focus ring classes", () => {
      render(<FormTextarea label="Test" id="test" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("focus:ring-2", "focus:ring-blue-500");
    });

    it("has resize-none class by default", () => {
      render(<FormTextarea label="Test" id="test" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("resize-none");
    });
  });

  describe("Props Forwarding", () => {
    it("forwards id prop to textarea element", () => {
      render(<FormTextarea label="Test" id="custom-id" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("id", "custom-id");
    });

    it("forwards name prop to textarea element", () => {
      render(<FormTextarea label="Test" id="test" name="message" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("name", "message");
    });

    it("forwards placeholder prop", () => {
      render(
        <FormTextarea label="Test" id="test" placeholder="Enter your text" />
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("placeholder", "Enter your text");
    });

    it("forwards rows prop", () => {
      render(<FormTextarea label="Test" id="test" rows={5} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "5");
    });

    it("forwards required prop", () => {
      render(<FormTextarea label="Test" id="test" required />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeRequired();
    });

    it("forwards minLength prop", () => {
      render(<FormTextarea label="Test" id="test" minLength={10} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("minlength", "10");
    });

    it("forwards maxLength prop", () => {
      render(<FormTextarea label="Test" id="test" maxLength={500} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("maxlength", "500");
    });
  });

  describe("Value Handling", () => {
    it("respects defaultValue prop", () => {
      render(
        <FormTextarea label="Test" id="test" defaultValue="Default text" />
      );

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
      expect(textarea.value).toBe("Default text");
    });

    it("can be controlled with value prop", () => {
      render(<FormTextarea label="Test" id="test" value="Controlled text" />);

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
      expect(textarea.value).toBe("Controlled text");
    });

    it("controlled component updates on prop change", () => {
      const { rerender } = render(
        <FormTextarea label="Test" id="test" value="Initial" />
      );

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
      expect(textarea.value).toBe("Initial");

      rerender(<FormTextarea label="Test" id="test" value="Updated" />);
      expect(textarea.value).toBe("Updated");
    });
  });

  describe("Accessibility", () => {
    it("label has proper for attribute", () => {
      render(<FormTextarea label="Test Label" id="test-id" />);

      const label = screen.getByText("Test Label");
      expect(label).toHaveAttribute("for", "test-id");
    });

    it("textarea can be focused", async () => {
      const user = userEvent.setup();
      render(<FormTextarea label="Test" id="test" />);

      const textarea = screen.getByRole("textbox");
      await user.click(textarea);

      expect(textarea).toHaveFocus();
    });

    it("respects tabIndex", () => {
      render(<FormTextarea label="Test" id="test" tabIndex={1} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("tabindex", "1");
    });

    it("can have aria-describedby", () => {
      render(
        <FormTextarea label="Test" id="test" aria-describedby="help-text" />
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-describedby", "help-text");
    });
  });

  describe("Text Handling", () => {
    it("handles multiline text", async () => {
      const user = userEvent.setup();
      render(<FormTextarea label="Test" id="test" />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Line 1{\n}Line 2{\n}Line 3");

      expect(textarea).toHaveValue("Line 1\nLine 2\nLine 3");
    });

    it("handles special characters", async () => {
      const user = userEvent.setup();
      render(<FormTextarea label="Test" id="test" />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "<>&\"'");

      expect(textarea).toHaveValue("<>&\"'");
    });

    it("handles emoji", async () => {
      const user = userEvent.setup();
      render(<FormTextarea label="Test" id="test" />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Hello 👋 World 🌍");

      expect(textarea).toHaveValue("Hello 👋 World 🌍");
    });

    it("respects maxLength constraint", async () => {
      const user = userEvent.setup();
      render(<FormTextarea label="Test" id="test" maxLength={10} />);

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
      await user.type(textarea, "This is way too long");

      // HTML5 maxLength should prevent typing beyond limit
      expect(textarea.value.length).toBeLessThanOrEqual(10);
    });
  });

  describe("Auto-focus", () => {
    it("can have autoFocus prop", () => {
      render(<FormTextarea label="Test" id="test" autoFocus />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveFocus();
    });
  });

  describe("Integration", () => {
    it("works with form submission", async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <FormTextarea label="Test" id="test" name="message" />
          <button type="submit">Submit</button>
        </form>
      );

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test message");

      const submitButton = screen.getByRole("button", { name: "Submit" });
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty value", () => {
      render(<FormTextarea label="Test" id="test" value="" />);

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
      expect(textarea.value).toBe("");
    });

    it("handles very long text", async () => {
      const user = userEvent.setup();
      const longText = "a".repeat(1000);
      render(<FormTextarea label="Test" id="test" />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, longText);

      expect(textarea).toHaveValue(longText);
    });

    it("handles rapid value changes", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<FormTextarea label="Test" id="test" onChange={handleChange} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "fast");

      expect(handleChange).toHaveBeenCalledTimes(4); // Once per character
    });
  });

  describe("Placeholder", () => {
    it("displays placeholder when empty", () => {
      render(
        <FormTextarea label="Test" id="test" placeholder="Type here..." />
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("placeholder", "Type here...");
    });

    it("placeholder disappears when typing", async () => {
      const user = userEvent.setup();
      render(
        <FormTextarea label="Test" id="test" placeholder="Type here..." />
      );

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "a");

      expect(textarea).toHaveValue("a");
    });
  });
});
