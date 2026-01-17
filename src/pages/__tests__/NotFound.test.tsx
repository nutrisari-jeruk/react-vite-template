import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFound from "../not-found";

describe("NotFound Page", () => {
  const renderNotFound = () => {
    return render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
  };

  describe("Page Content", () => {
    it("renders 404 error code", () => {
      renderNotFound();
      expect(screen.getByText("404")).toBeInTheDocument();
    });

    it("renders page title", () => {
      renderNotFound();
      expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    });

    it("renders error description", () => {
      renderNotFound();
      expect(
        screen.getByText("The page you're looking for doesn't exist.")
      ).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("renders Go Home link", () => {
      renderNotFound();
      expect(screen.getByRole("link", { name: "Go Home" })).toBeInTheDocument();
    });

    it("Go Home link points to home page", () => {
      renderNotFound();
      const homeLink = screen.getByRole("link", { name: "Go Home" });
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  describe("Layout and Styling", () => {
    it("renders centered layout", () => {
      const { container } = renderNotFound();
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass(
        "flex",
        "flex-col",
        "items-center",
        "justify-center"
      );
    });

    it("applies correct styling to 404 text", () => {
      renderNotFound();
      const heading = screen.getByText("404");
      expect(heading).toHaveClass("text-6xl", "font-bold", "text-gray-300");
    });

    it("applies correct styling to title", () => {
      renderNotFound();
      const title = screen.getByText("Page Not Found");
      expect(title).toHaveClass("text-2xl", "font-semibold");
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      renderNotFound();
      const headings = screen.getAllByRole("heading");
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent("404");
      expect(headings[1]).toHaveTextContent("Page Not Found");
    });

    it("has accessible navigation link", () => {
      renderNotFound();
      const link = screen.getByRole("link", { name: "Go Home" });
      expect(link).toBeInTheDocument();
    });
  });
});
