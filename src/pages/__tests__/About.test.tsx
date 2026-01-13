import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import About from "../About";

describe("About Page", () => {
  const renderAbout = () => {
    return render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
  };

  it("renders main heading", () => {
    renderAbout();
    expect(screen.getByText("About This Template")).toBeInTheDocument();
  });

  it("renders description text", () => {
    renderAbout();
    expect(
      screen.getByText(
        /This is a comprehensive React frontend template built with modern tools and best practices/i
      )
    ).toBeInTheDocument();
  });

  it("renders back to home button", () => {
    renderAbout();
    const backButton = screen.getByRole("link", { name: /back to home/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute("href", "/");
  });

  describe("Tech Stack Section", () => {
    it("renders tech stack heading", () => {
      renderAbout();
      expect(screen.getByText("Tech Stack")).toBeInTheDocument();
      expect(screen.getByText("🚀")).toBeInTheDocument();
    });

    it("renders all tech stack badges", () => {
      renderAbout();
      expect(screen.getByText("React 19")).toBeInTheDocument();
      expect(screen.getByText("Vite")).toBeInTheDocument();
      expect(screen.getByText("React Router")).toBeInTheDocument();
      expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();
      expect(screen.getByText("TanStack Query")).toBeInTheDocument();
      expect(screen.getByText("Axios")).toBeInTheDocument();
      expect(screen.getByText("Vitest")).toBeInTheDocument();
      expect(screen.getByText("Husky")).toBeInTheDocument();
      expect(screen.getByText("ESLint & Prettier")).toBeInTheDocument();
    });

    it("renders tech stack descriptions", () => {
      renderAbout();
      expect(screen.getByText("with TypeScript")).toBeInTheDocument();
      expect(screen.getByText("for fast development")).toBeInTheDocument();
      expect(screen.getByText("for routing")).toBeInTheDocument();
      expect(screen.getByText("for styling")).toBeInTheDocument();
      expect(screen.getByText("for data fetching")).toBeInTheDocument();
      expect(screen.getByText("for HTTP requests")).toBeInTheDocument();
      expect(screen.getByText("for testing")).toBeInTheDocument();
      expect(
        screen.getByText("& lint-staged for git hooks")
      ).toBeInTheDocument();
      expect(screen.getByText("for code quality")).toBeInTheDocument();
    });
  });

  describe("Key Features Section", () => {
    it("renders key features heading", () => {
      renderAbout();
      expect(screen.getByText("Key Features")).toBeInTheDocument();
      expect(screen.getByText("✨")).toBeInTheDocument();
    });

    it("renders all feature titles", () => {
      renderAbout();
      expect(screen.getByText("Component Library")).toBeInTheDocument();
      expect(screen.getByText("Type Safety")).toBeInTheDocument();
      expect(screen.getByText("Optimized Build")).toBeInTheDocument();
      expect(screen.getByText("Testing Ready")).toBeInTheDocument();
    });

    it("renders feature descriptions", () => {
      renderAbout();
      expect(
        screen.getByText("Pre-built, accessible components ready to use")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Full TypeScript support for better DX")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Vite for lightning-fast hot module replacement")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Vitest configured with testing utilities")
      ).toBeInTheDocument();
    });

    it("renders feature badges", () => {
      renderAbout();
      expect(screen.getByText("UI/UX")).toBeInTheDocument();
      expect(screen.getByText("DX")).toBeInTheDocument();
      expect(screen.getByText("Performance")).toBeInTheDocument();
      expect(screen.getByText("Quality")).toBeInTheDocument();
    });
  });

  describe("Call to Action Section", () => {
    it("renders ready to build heading", () => {
      renderAbout();
      expect(screen.getByText("Ready to Build?")).toBeInTheDocument();
    });

    it("renders call to action text", () => {
      renderAbout();
      expect(
        screen.getByText(
          "Explore the component library and start building your next amazing project!"
        )
      ).toBeInTheDocument();
    });

    it("renders view components link", () => {
      renderAbout();
      const viewComponentsLink = screen.getByRole("link", {
        name: /view components/i,
      });
      expect(viewComponentsLink).toBeInTheDocument();
      expect(viewComponentsLink).toHaveAttribute("href", "/components");
    });

    it("renders go home link", () => {
      renderAbout();
      const goHomeLinks = screen.getAllByRole("link", { name: /go home/i });
      // We expect at least one "Go Home" link in the CTA section
      expect(goHomeLinks.length).toBeGreaterThan(0);
      expect(goHomeLinks[0]).toHaveAttribute("href", "/");
    });
  });

  describe("Layout and Styling", () => {
    it("renders with gradient background", () => {
      const { container } = renderAbout();
      const gradientDiv = container.querySelector(
        ".bg-linear-to-br.from-gray-50.to-gray-100"
      );
      expect(gradientDiv).toBeInTheDocument();
    });

    it("renders multiple card components", () => {
      const { container } = renderAbout();
      // The page should have multiple cards with proper styling
      const cards = container.querySelectorAll(".rounded-lg");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      renderAbout();
      const h1 = screen.getByRole("heading", { level: 1 });
      const h2s = screen.getAllByRole("heading", { level: 2 });
      const h3s = screen.getAllByRole("heading", { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3s.length).toBeGreaterThan(0);
    });

    it("all links are accessible", () => {
      renderAbout();
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href");
      });
    });
  });
});
