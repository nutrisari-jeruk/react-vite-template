import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FormValidationExample from "../FormValidationExample";

describe("FormValidationExample", () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

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

  it("displays user registration form by default", () => {
    renderWithRouter(<FormValidationExample />);
    expect(screen.getByText("User Registration Form")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
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
