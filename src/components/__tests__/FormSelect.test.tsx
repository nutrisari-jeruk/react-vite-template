import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormSelect } from "../form-select";

describe("FormSelect Component", () => {
  const mockOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  describe("Rendering", () => {
    it("renders select element", () => {
      render(<FormSelect label="Test" options={mockOptions} id="test" />);
      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
    });

    it("renders label", () => {
      render(
        <FormSelect label="Choose an option" options={mockOptions} id="test" />
      );
      expect(screen.getByText("Choose an option")).toBeInTheDocument();
    });

    it("associates label with select via id", () => {
      render(
        <FormSelect label="Test" options={mockOptions} id="test-select" />
      );
      const label = screen.getByText("Test");
      const select = screen.getByRole("combobox");

      expect(label).toHaveAttribute("for", "test-select");
      expect(select).toHaveAttribute("id", "test-select");
    });

    it("renders default placeholder option", () => {
      render(<FormSelect label="Test" options={mockOptions} id="test" />);
      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("renders all provided options", () => {
      render(<FormSelect label="Test" options={mockOptions} id="test" />);

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });
  });

  describe("User Interaction", () => {
    it("allows selecting an option", async () => {
      const user = userEvent.setup();
      render(<FormSelect label="Test" options={mockOptions} id="test" />);

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "2");

      expect(select).toHaveValue("2");
    });

    it("calls onChange when selection changes", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <FormSelect
          label="Test"
          options={mockOptions}
          id="test"
          onChange={handleChange}
        />
      );

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "1");

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("can be disabled", () => {
      render(
        <FormSelect label="Test" options={mockOptions} id="test" disabled />
      );

      const select = screen.getByRole("combobox");
      expect(select).toBeDisabled();
    });
  });

  describe("Error State", () => {
    it("displays error message when error prop is provided", () => {
      render(
        <FormSelect
          label="Test"
          options={mockOptions}
          id="test"
          error="This field is required"
        />
      );

      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("does not display error message when error prop is not provided", () => {
      render(<FormSelect label="Test" options={mockOptions} id="test" />);

      expect(
        screen.queryByText("This field is required")
      ).not.toBeInTheDocument();
    });

    it("applies error styling to select when error exists", () => {
      render(
        <FormSelect
          label="Test"
          options={mockOptions}
          id="test"
          error="Selection required"
        />
      );

      const select = screen.getByRole("combobox");
      expect(select).toHaveClass("border-red-500");
      expect(select).toHaveClass("bg-red-50");
    });

    it("applies normal styling when no error", () => {
      render(<FormSelect label="Test" options={mockOptions} id="test" />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveClass("border-gray-300");
      expect(select).not.toHaveClass("border-red-500");
    });
  });

  describe("Styling", () => {
    it("applies custom className", () => {
      render(
        <FormSelect
          label="Test"
          options={mockOptions}
          id="test"
          className="custom-class"
        />
      );

      const select = screen.getByRole("combobox");
      expect(select).toHaveClass("custom-class");
    });

    it("applies default styling classes", () => {
      render(<FormSelect label="Test" options={mockOptions} id="test" />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveClass("px-4", "py-2", "border", "rounded-lg");
    });

    it("applies focus ring classes", () => {
      render(<FormSelect label="Test" options={mockOptions} id="test" />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveClass("focus:ring-2", "focus:ring-blue-500");
    });
  });

  describe("Props Forwarding", () => {
    it("forwards id prop to select element", () => {
      render(<FormSelect label="Test" options={mockOptions} id="custom-id" />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveAttribute("id", "custom-id");
    });

    it("forwards name prop to select element", () => {
      render(
        <FormSelect label="Test" options={mockOptions} id="test" name="field" />
      );

      const select = screen.getByRole("combobox");
      expect(select).toHaveAttribute("name", "field");
    });

    it("forwards required prop to select element", () => {
      render(
        <FormSelect label="Test" options={mockOptions} id="test" required />
      );

      const select = screen.getByRole("combobox");
      expect(select).toBeRequired();
    });

    it("forwards autoComplete prop", () => {
      render(
        <FormSelect
          label="Test"
          options={mockOptions}
          id="test"
          autoComplete="off"
        />
      );

      const select = screen.getByRole("combobox");
      expect(select).toHaveAttribute("autocomplete", "off");
    });
  });

  describe("Accessibility", () => {
    it("label has proper for attribute", () => {
      render(
        <FormSelect label="Test Label" options={mockOptions} id="test-id" />
      );

      const label = screen.getByText("Test Label");
      expect(label).toHaveAttribute("for", "test-id");
    });

    it("select can be focused", async () => {
      const user = userEvent.setup();
      render(<FormSelect label="Test" options={mockOptions} id="test" />);

      const select = screen.getByRole("combobox");
      await user.click(select);

      expect(select).toHaveFocus();
    });

    it("keyboard navigation works", () => {
      render(<FormSelect label="Test" options={mockOptions} id="test" />);

      const select = screen.getByRole("combobox");
      select.focus();
      expect(select).toHaveFocus();
    });
  });

  describe("Default Value", () => {
    it("respects defaultValue prop", () => {
      render(
        <FormSelect
          label="Test"
          options={mockOptions}
          id="test"
          defaultValue="2"
        />
      );

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("2");
    });

    it("can be controlled with value prop", () => {
      render(
        <FormSelect label="Test" options={mockOptions} id="test" value="3" />
      );

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("3");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      render(<FormSelect label="Test" options={[]} id="test" />);

      const select = screen.getByRole("combobox");
      const options = select.querySelectorAll("option");

      // Should only have placeholder option
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent("Select an option");
    });

    it("handles options with special characters", () => {
      const specialOptions = [
        { value: "1", label: "Option with & symbol" },
        { value: "2", label: "Option with <tag>" },
        { value: "3", label: 'Option with "quotes"' },
      ];

      render(<FormSelect label="Test" options={specialOptions} id="test" />);

      expect(screen.getByText("Option with & symbol")).toBeInTheDocument();
      expect(screen.getByText('Option with "quotes"')).toBeInTheDocument();
    });

    it("handles very long option labels", () => {
      const longOptions = [
        {
          value: "1",
          label: "This is a very long option label that might wrap or overflow",
        },
      ];

      render(<FormSelect label="Test" options={longOptions} id="test" />);

      expect(
        screen.getByText(
          "This is a very long option label that might wrap or overflow"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("works with form submission", async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <FormSelect
            label="Test"
            options={mockOptions}
            id="test"
            name="test"
          />
          <button type="submit">Submit</button>
        </form>
      );

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "2");

      const submitButton = screen.getByRole("button", { name: "Submit" });
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
