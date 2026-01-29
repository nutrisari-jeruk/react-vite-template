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
    expect(screen.getByText(/Ship faster with/i)).toBeInTheDocument();
    expect(screen.getByText(/React Frontend Template/i)).toBeInTheDocument();
  });

  it("renders version and status badges", () => {
    renderHome();
    expect(screen.getByText("v1.0")).toBeInTheDocument();
    // Production Ready appears twice (badge and feature card), so use getAllByText
    expect(screen.getAllByText("Production Ready").length).toBeGreaterThan(0);
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
      screen.getByText(/Explore the features and examples available/i)
    ).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    renderHome();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /forms/i })).toBeInTheDocument();
    // Components and Dashboard links appear multiple times, check that at least one exists
    expect(
      screen.getAllByRole("link", { name: /components/i }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /dashboard/i }).length
    ).toBeGreaterThan(0);
  });

  it("renders feature cards with titles", () => {
    renderHome();
    expect(screen.getByText("Modern Stack")).toBeInTheDocument();
    expect(screen.getByText("UI Components")).toBeInTheDocument();
    expect(screen.getByText("State Management")).toBeInTheDocument();
    expect(screen.getByText("Type Safety")).toBeInTheDocument();
    expect(screen.getByText("Testing Ready")).toBeInTheDocument();
    // Production Ready appears as badge and feature card, check feature card specifically
    expect(
      screen.getByRole("heading", { name: "Production Ready" })
    ).toBeInTheDocument();
  });

  it("renders feature card descriptions", () => {
    renderHome();
    expect(
      screen.getByText(/React 19, TypeScript, and Vite/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Pre-built accessible components with beautiful Tailwind CSS/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/TanStack Query for server state/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/End-to-end TypeScript with strict mode/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Vitest, Testing Library, and MSW/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ESLint, Prettier, Docker, and CI\/CD/i)
    ).toBeInTheDocument();
  });

  it("renders technology badges", () => {
    renderHome();
    expect(screen.getByText("React")).toBeInTheDocument();
    // TypeScript appears in stats and badges, check that at least one exists
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);
    expect(screen.getByText("Vite")).toBeInTheDocument();
    expect(screen.getByText("Accessible")).toBeInTheDocument();
    expect(screen.getByText("Responsive")).toBeInTheDocument();
    expect(screen.getByText("Query")).toBeInTheDocument();
    expect(screen.getByText("Mutation")).toBeInTheDocument();
    expect(screen.getByText("Strict")).toBeInTheDocument();
    expect(screen.getByText("Unit")).toBeInTheDocument();
    expect(screen.getByText("Integration")).toBeInTheDocument();
    expect(screen.getByText("Linting")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });

  it("renders buttons with correct variants", () => {
    renderHome();
    // Hero section buttons
    expect(
      screen.getByRole("button", { name: /get started/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /view components/i })
    ).toBeInTheDocument();
    // CTA section buttons
    expect(
      screen.getByRole("button", { name: /explore dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^components$/i })
    ).toBeInTheDocument();
  });

  it("renders stats section", () => {
    renderHome();
    expect(screen.getByText("20+")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("A11y")).toBeInTheDocument();
    // Components appears in stats and elsewhere, verify stats section specifically
    const statsSection = screen.getByText("20+").closest("section");
    expect(statsSection).toBeInTheDocument();
    expect(statsSection?.textContent).toContain("Components");
    expect(statsSection?.textContent).toContain("TypeScript");
    expect(statsSection?.textContent).toContain("First");
  });

  it("renders CTA section", () => {
    renderHome();
    expect(
      screen.getByText(/Ready to build something amazing\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Get started with our comprehensive dashboard/i)
    ).toBeInTheDocument();
  });
});
