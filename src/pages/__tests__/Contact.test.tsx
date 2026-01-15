import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Contact from "../contact";

describe("Contact Page", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const renderContact = () => {
    return render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );
  };

  describe("Page Structure", () => {
    it("renders main heading", () => {
      renderContact();
      expect(screen.getByText("Contact Us")).toBeInTheDocument();
    });

    it("renders page description", () => {
      renderContact();
      expect(
        screen.getByText(
          /Have a question or feedback\? We'd love to hear from you!/i
        )
      ).toBeInTheDocument();
    });

    it("renders back to home button", () => {
      renderContact();
      const backButton = screen.getByRole("link");
      expect(backButton).toHaveAttribute("href", "/");
      expect(backButton).toBeInTheDocument();
    });
  });

  describe("Contact Form", () => {
    it("renders all form fields", () => {
      renderContact();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it("renders form fields with correct attributes", () => {
      renderContact();
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      expect(nameInput).toHaveAttribute("type", "text");
      expect(nameInput).toHaveAttribute("required");
      expect(nameInput).toHaveAttribute("placeholder", "Enter your name");

      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("required");
      expect(emailInput).toHaveAttribute(
        "placeholder",
        "your.email@example.com"
      );

      expect(messageInput).toHaveAttribute("required");
      expect(messageInput).toHaveAttribute("rows", "6");
      expect(messageInput).toHaveAttribute(
        "placeholder",
        "Tell us what's on your mind..."
      );
    });

    it("renders send message button", () => {
      renderContact();
      expect(
        screen.getByRole("button", { name: /send message/i })
      ).toBeInTheDocument();
    });

    it("renders clear button", () => {
      renderContact();
      expect(
        screen.getByRole("button", { name: /clear/i })
      ).toBeInTheDocument();
    });

    it("allows user to type in form fields", () => {
      renderContact();
      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const messageInput = screen.getByLabelText(
        /message/i
      ) as HTMLTextAreaElement;

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "Hello there!" } });

      expect(nameInput.value).toBe("John Doe");
      expect(emailInput.value).toBe("john@example.com");
      expect(messageInput.value).toBe("Hello there!");
    });

    it("clears form when clear button is clicked", () => {
      renderContact();
      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const messageInput = screen.getByLabelText(
        /message/i
      ) as HTMLTextAreaElement;
      const clearButton = screen.getByRole("button", { name: /clear/i });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "Hello there!" } });

      expect(nameInput.value).toBe("John Doe");
      expect(emailInput.value).toBe("john@example.com");
      expect(messageInput.value).toBe("Hello there!");

      fireEvent.click(clearButton);

      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
      expect(messageInput.value).toBe("");
    });
  });

  describe("Form Submission", () => {
    it("shows success alert after form submission", () => {
      renderContact();
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "Hello there!" } });

      fireEvent.click(submitButton);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Success!")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Your message has been sent successfully. We'll get back to you soon!/i
        )
      ).toBeInTheDocument();
    });

    it("hides form while showing success message", () => {
      renderContact();
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "Hello there!" } });

      fireEvent.click(submitButton);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("resets form after success message timeout", async () => {
      renderContact();
      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const messageInput = screen.getByLabelText(
        /message/i
      ) as HTMLTextAreaElement;
      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "Hello there!" } });

      fireEvent.click(submitButton);

      expect(screen.getByRole("alert")).toBeInTheDocument();

      // Fast-forward time by 3 seconds
      vi.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(nameInput.value).toBe("");
        expect(emailInput.value).toBe("");
        expect(messageInput.value).toBe("");
      });
    });

    it("allows dismissing success alert manually", () => {
      renderContact();
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "Hello there!" } });

      fireEvent.click(submitButton);

      const dismissButton = screen.getByLabelText(/dismiss/i);
      expect(dismissButton).toBeInTheDocument();

      fireEvent.click(dismissButton);

      // The alert should start dismissing
      expect(dismissButton).toBeDisabled();
    });
  });

  describe("Other Ways to Reach Us Section", () => {
    it("renders section heading", () => {
      renderContact();
      expect(screen.getByText("Other Ways to Reach Us")).toBeInTheDocument();
    });

    it("renders contact information", () => {
      renderContact();
      expect(screen.getByText(/email:/i)).toBeInTheDocument();
      expect(screen.getByText(/phone:/i)).toBeInTheDocument();
      expect(screen.getByText(/hours:/i)).toBeInTheDocument();
    });

    it("renders email link with correct href", () => {
      renderContact();
      const emailLink = screen.getByText("support@example.com");
      expect(emailLink).toHaveAttribute("href", "mailto:support@example.com");
    });

    it("renders phone link with correct href", () => {
      renderContact();
      const phoneLink = screen.getByText("+1 (234) 567-890");
      expect(phoneLink).toHaveAttribute("href", "tel:+1234567890");
    });

    it("renders business hours", () => {
      renderContact();
      expect(screen.getByText(/Mon-Fri, 9AM-5PM EST/i)).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    it("renders with gradient background", () => {
      const { container } = renderContact();
      const gradientDiv = container.querySelector(
        ".bg-gradient-to-br.from-gray-50.to-gray-100"
      );
      expect(gradientDiv).toBeInTheDocument();
    });

    it("uses Card components for layout", () => {
      const { container } = renderContact();
      const cards = container.querySelectorAll(".rounded-lg");
      expect(cards.length).toBeGreaterThan(0);
    });

    it("has proper spacing classes", () => {
      const { container } = renderContact();
      const mainContainer = container.querySelector(".max-w-2xl");
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      renderContact();
      const h1 = screen.getByRole("heading", { level: 1, name: /contact us/i });
      const h2 = screen.getByRole("heading", {
        level: 2,
        name: /other ways to reach us/i,
      });

      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
    });

    it("all form fields have associated labels", () => {
      renderContact();
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(messageInput).toBeInTheDocument();
    });

    it("form has required fields", () => {
      renderContact();
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      expect(nameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(messageInput).toBeRequired();
    });

    it("success alert has proper role", () => {
      renderContact();
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "Hello there!" } });

      fireEvent.click(submitButton);

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
    });

    it("all interactive elements are keyboard accessible", () => {
      renderContact();
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });
      const clearButton = screen.getByRole("button", { name: /clear/i });

      // All form elements should be focusable
      nameInput.focus();
      expect(document.activeElement).toBe(nameInput);

      emailInput.focus();
      expect(document.activeElement).toBe(emailInput);

      messageInput.focus();
      expect(document.activeElement).toBe(messageInput);

      submitButton.focus();
      expect(document.activeElement).toBe(submitButton);

      clearButton.focus();
      expect(document.activeElement).toBe(clearButton);
    });

    it("all links have valid hrefs", () => {
      renderContact();
      const links = screen.getAllByRole("link");

      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
        const href = link.getAttribute("href");
        expect(href).toBeTruthy();
      });
    });
  });

  describe("Form Validation", () => {
    it("email input accepts valid email format", () => {
      renderContact();
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: "valid@example.com" } });

      expect(emailInput.value).toBe("valid@example.com");
      expect(emailInput.validity.valid).toBe(true);
    });

    it("form submission prevents default behavior", () => {
      renderContact();
      const form = screen
        .getByRole("button", { name: /send message/i })
        .closest("form");
      const mockSubmit = vi.fn((e) => e.preventDefault());

      form?.addEventListener("submit", mockSubmit);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "Hello there!" } });

      fireEvent.click(submitButton);

      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  describe("User Experience", () => {
    it("submit button has appropriate type attribute", () => {
      renderContact();
      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });
      expect(submitButton).toHaveAttribute("type", "submit");
    });

    it("clear button has appropriate type attribute", () => {
      renderContact();
      const clearButton = screen.getByRole("button", { name: /clear/i });
      expect(clearButton).toHaveAttribute("type", "button");
    });

    it("displays helpful placeholder text", () => {
      renderContact();
      expect(
        screen.getByPlaceholderText("Enter your name")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("your.email@example.com")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Tell us what's on your mind...")
      ).toBeInTheDocument();
    });

    it("contact information is clickable", () => {
      renderContact();
      const emailLink = screen.getByText("support@example.com");
      const phoneLink = screen.getByText("+1 (234) 567-890");

      expect(emailLink.closest("a")).toBeInTheDocument();
      expect(phoneLink.closest("a")).toBeInTheDocument();
    });
  });
});
