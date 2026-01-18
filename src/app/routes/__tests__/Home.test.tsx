import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../Home";

describe("Home Page", () => {
  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  it("renders welcome message", () => {
    renderHome();
    expect(
      screen.getByText("Welcome to React Frontend Template")
    ).toBeInTheDocument();
  });

  it("renders version and status badges", () => {
    renderHome();
    expect(screen.getByText("v1.0")).toBeInTheDocument();
    expect(screen.getByText("Production Ready")).toBeInTheDocument();
  });

  it("renders description text", () => {
    renderHome();
    expect(
      screen.getByText(/A production-ready template with React Router/i)
    ).toBeInTheDocument();
  });

  it("renders quick navigation section", () => {
    renderHome();
    expect(screen.getByText("Quick Navigation")).toBeInTheDocument();
    expect(
      screen.getByText(/Explore the features and examples/i)
    ).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    renderHome();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /form validation/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view components/i })
    ).toBeInTheDocument();
  });

  it("renders feature cards with titles", () => {
    renderHome();
    expect(screen.getByText("Modern Stack")).toBeInTheDocument();
    expect(screen.getByText("UI Components")).toBeInTheDocument();
    expect(screen.getByText("Developer Tools")).toBeInTheDocument();
  });

  it("renders feature card descriptions", () => {
    renderHome();
    expect(
      screen.getByText(/Built with React 18, TypeScript, and Vite/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Pre-built accessible components with Tailwind CSS/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ESLint, Prettier, Vitest, and Docker ready/i)
    ).toBeInTheDocument();
  });

  it("renders technology badges", () => {
    renderHome();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Vite")).toBeInTheDocument();
    expect(screen.getByText("Tailwind")).toBeInTheDocument();
    expect(screen.getByText("Accessible")).toBeInTheDocument();
    expect(screen.getByText("Responsive")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
    expect(screen.getByText("Linting")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });

  it("renders buttons with correct variants", () => {
    renderHome();
    const aboutButton = screen.getByRole("button", { name: /about/i });
    const formButton = screen.getByRole("button", {
      name: /form validation/i,
    });
    const componentsButton = screen.getByRole("button", {
      name: /view components/i,
    });

    expect(aboutButton).toBeInTheDocument();
    expect(formButton).toBeInTheDocument();
    expect(componentsButton).toBeInTheDocument();
  });
});
