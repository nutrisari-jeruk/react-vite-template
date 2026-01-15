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
      expect(
        screen.getByText("Zod Form Validation Examples")
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Comprehensive examples of form validation/i)
      ).toBeInTheDocument();
    });

    it("renders form toggle buttons", () => {
      renderWithRouter(<FormValidationExample />);
      expect(screen.getByText("User Registration")).toBeInTheDocument();
      expect(screen.getByText("Contact Form")).toBeInTheDocument();
    });

    it("displays validation features list", () => {
      renderWithRouter(<FormValidationExample />);
      expect(
        screen.getByText("Validation Features Demonstrated")
      ).toBeInTheDocument();
      expect(screen.getByText(/String Validation/)).toBeInTheDocument();
      expect(screen.getByText(/Number Validation/)).toBeInTheDocument();
      expect(screen.getByText(/Complex Rules/)).toBeInTheDocument();
    });
  });

  describe("User Registration Form", () => {
    it("displays user registration form by default", () => {
      renderWithRouter(<FormValidationExample />);
      expect(screen.getByText("User Registration Form")).toBeInTheDocument();
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
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

      const passwordInput = screen.getByLabelText("Password");
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");

      await user.type(passwordInput, "ValidPass123!");
      await user.type(confirmPasswordInput, "DifferentPass123!");
      await user.tab();

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
      await user.selectOptions(screen.getByLabelText("Country"), "us");
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

  describe("Contact Form", () => {
    it("switches to contact form when button is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      const contactFormButton = screen.getByRole("button", {
        name: "Contact Form",
      });
      await user.click(contactFormButton);

      expect(
        screen.getByRole("heading", { name: "Contact Form" })
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Subject")).toBeInTheDocument();
      expect(screen.getByLabelText("Priority")).toBeInTheDocument();
      expect(screen.getByLabelText("Message")).toBeInTheDocument();
    });

    it("validates contact form fields", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      await user.click(screen.getByRole("button", { name: "Contact Form" }));

      const submitButton = screen.getByRole("button", {
        name: "Send Message",
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Name must be at least 2 characters")
        ).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(
          screen.getByText("Subject must be at least 5 characters")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Message must be at least 20 characters")
        ).toBeInTheDocument();
      });
    });

    it("submits contact form with valid data", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormValidationExample />);

      await user.click(screen.getByRole("button", { name: "Contact Form" }));

      await user.type(screen.getByLabelText("Name"), "John Doe");
      await user.type(
        screen.getByLabelText("Email Address"),
        "john@example.com"
      );
      await user.type(screen.getByLabelText("Subject"), "Test Subject");
      await user.selectOptions(screen.getByLabelText("Priority"), "high");
      await user.type(
        screen.getByLabelText("Message"),
        "This is a test message with more than 20 characters"
      );

      const submitButton = screen.getByRole("button", {
        name: "Send Message",
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Form Submitted Successfully!")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Form Switching", () => {
    it("clears submitted data when switching forms", async () => {
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
      await user.selectOptions(screen.getByLabelText("Country"), "us");
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

      await user.click(screen.getByRole("button", { name: "Contact Form" }));

      expect(
        screen.queryByText("Form Submitted Successfully!")
      ).not.toBeInTheDocument();
    });
  });
});
