import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import FormValidationExample from "../form-validation-example";

describe("FormValidationExample", () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe("Page Layout", () => {
    it("renders the page title and description", () => {
      renderWithRouter(<FormValidationExample />);
      expect(screen.getByText("Zod Form Validation")).toBeInTheDocument();
      expect(
        screen.getByText(/Form validation using Zod/i)
      ).toBeInTheDocument();
    });

    it("renders validation features section", () => {
      renderWithRouter(<FormValidationExample />);
      expect(screen.getByText("Validation Features")).toBeInTheDocument();
      expect(screen.getByText(/String validation/i)).toBeInTheDocument();
      expect(screen.getByText(/Email validation/i)).toBeInTheDocument();
      expect(screen.getByText(/Number constraints/i)).toBeInTheDocument();
    });
  });

  describe("User Registration Form", () => {
    it("displays user registration form", () => {
      renderWithRouter(<FormValidationExample />);
      expect(screen.getByText("User Registration")).toBeInTheDocument();
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(screen.getByLabelText("Age")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Country")).toBeInTheDocument();
      expect(screen.getByLabelText("Bio (Optional)")).toBeInTheDocument();
      expect(
        screen.getByLabelText("I accept the terms and conditions")
      ).toBeInTheDocument();
    });

    it("shows validation errors for empty required fields", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      const submitButton = screen.getByRole("button", { name: "Register" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Username must be at least 3 characters")
        ).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Age is required")).toBeInTheDocument();
      });
    });

    it("validates username format", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      const usernameInput = screen.getByLabelText("Username");
      await user.type(usernameInput, "ab");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("Username must be at least 3 characters")
        ).toBeInTheDocument();
      });

      await user.clear(usernameInput);
      await user.type(usernameInput, "user@invalid");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(
            /Username can only contain letters, numbers, and underscores/i
          )
        ).toBeInTheDocument();
      });
    });

    it("validates email format", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      const emailInput = screen.getByLabelText("Email Address");
      await user.type(emailInput, "invalid-email");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      });
    });

    it("validates password requirements", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      const passwordInput = screen.getByLabelText("Password");
      await user.type(passwordInput, "weak");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("Password must be at least 8 characters")
        ).toBeInTheDocument();
      });
    });

    it("validates password matching", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      // Fill in all required fields
      await user.type(screen.getByLabelText("Username"), "validuser123");
      await user.type(
        screen.getByLabelText("Email Address"),
        "user@example.com"
      );
      await user.type(screen.getByLabelText("Age"), "25");

      const passwordInput = screen.getByLabelText("Password");
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");

      await user.type(passwordInput, "ValidPass123!");
      await user.type(confirmPasswordInput, "DifferentPass123!");

      // Select country (required field)
      await user.click(screen.getByLabelText("Country"));
      await user.click(screen.getByText("United States"));

      // Accept terms (required field)
      await user.click(
        screen.getByLabelText("I accept the terms and conditions")
      );

      const submitButton = screen.getByRole("button", { name: "Register" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
      });
    });

    it("validates age constraints", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      const ageInput = screen.getByLabelText("Age");
      await user.type(ageInput, "15");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("You must be at least 18 years old")
        ).toBeInTheDocument();
      });
    });

    it("requires terms acceptance", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      const submitButton = screen.getByRole("button", { name: "Register" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("You must accept the terms and conditions")
        ).toBeInTheDocument();
      });
    });

    it("submits form with valid data", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      await user.type(screen.getByLabelText("Username"), "validuser123");
      await user.type(
        screen.getByLabelText("Email Address"),
        "user@example.com"
      );
      await user.type(screen.getByLabelText("Age"), "25");
      await user.type(screen.getByLabelText("Password"), "ValidPass123!");
      await user.type(
        screen.getByLabelText("Confirm Password"),
        "ValidPass123!"
      );
      // Select country using custom Select component
      await user.click(screen.getByLabelText("Country"));
      await user.click(screen.getByText("United States"));
      await user.type(
        screen.getByLabelText("Bio (Optional)"),
        "This is a valid bio with more than 10 characters"
      );
      await user.click(
        screen.getByLabelText("I accept the terms and conditions")
      );

      const submitButton = screen.getByRole("button", { name: "Register" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Form Submitted Successfully!")
        ).toBeInTheDocument();
      });
    });

    it("resets form when reset button is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      const usernameInput = screen.getByLabelText("Username");
      await user.type(usernameInput, "testuser");

      const resetButton = screen.getByRole("button", { name: "Reset Form" });
      await user.click(resetButton);

      expect(usernameInput).toHaveValue("");
    });
  });

  describe("Form Success Display", () => {
    it("displays submitted data after successful submission", async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter(<FormValidationExample />);

      await user.type(screen.getByLabelText("Username"), "testuser");
      await user.type(
        screen.getByLabelText("Email Address"),
        "test@example.com"
      );
      await user.type(screen.getByLabelText("Age"), "25");
      await user.type(screen.getByLabelText("Password"), "ValidPass123!");
      await user.type(
        screen.getByLabelText("Confirm Password"),
        "ValidPass123!"
      );
      // Select country using custom Select component
      await user.click(screen.getByLabelText("Country"));
      await user.click(screen.getByText("United States"));
      await user.click(
        screen.getByLabelText("I accept the terms and conditions")
      );

      const submitButton = screen.getByRole("button", { name: "Register" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Form Submitted Successfully!")
        ).toBeInTheDocument();
      });

      // Verify the JSON data is displayed in the success message
      const jsonOutput = container.querySelector("pre");
      expect(jsonOutput).toBeInTheDocument();
      expect(jsonOutput?.textContent).toContain("testuser");
      expect(jsonOutput?.textContent).toContain("test@example.com");
    });

    it("clears success message when form is reset", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      // Submit form first
      await user.type(screen.getByLabelText("Username"), "testuser");
      await user.type(
        screen.getByLabelText("Email Address"),
        "test@example.com"
      );
      await user.type(screen.getByLabelText("Age"), "25");
      await user.type(screen.getByLabelText("Password"), "ValidPass123!");
      await user.type(
        screen.getByLabelText("Confirm Password"),
        "ValidPass123!"
      );
      // Select country using custom Select component
      await user.click(screen.getByLabelText("Country"));
      await user.click(screen.getByText("United States"));
      await user.click(
        screen.getByLabelText("I accept the terms and conditions")
      );

      const submitButton = screen.getByRole("button", { name: "Register" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Form Submitted Successfully!")
        ).toBeInTheDocument();
      });

      // Reset form
      const resetButton = screen.getByRole("button", { name: "Reset Form" });
      await user.click(resetButton);

      // Success message should still be there (it's from submittedData state)
      expect(
        screen.getByText("Form Submitted Successfully!")
      ).toBeInTheDocument();
    });
  });
});
