import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ComponentsPage from "../Components";

describe("Components Page", () => {
  const renderComponentsPage = () => {
    return render(
      <BrowserRouter>
        <ComponentsPage />
      </BrowserRouter>
    );
  };

  describe("Page Header", () => {
    it("renders page title", () => {
      renderComponentsPage();
      expect(screen.getByText("Component Library")).toBeInTheDocument();
    });

    it("renders page description", () => {
      renderComponentsPage();
      expect(
        screen.getByText(/A collection of accessible, reusable UI components/)
      ).toBeInTheDocument();
    });

    it("renders back to home button", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("button", { name: /back to home/i })
      ).toBeInTheDocument();
    });

    it("back button links to home page", () => {
      renderComponentsPage();
      const backButton = screen.getByRole("button", { name: /back to home/i });
      expect(backButton.closest("a")).toHaveAttribute("href", "/");
    });
  });

  describe("Component Demos", () => {
    it("renders Buttons section", () => {
      renderComponentsPage();
      expect(screen.getByText("Buttons")).toBeInTheDocument();
      expect(
        screen.getByText("Button components with various styles and states")
      ).toBeInTheDocument();
    });

    it("renders Inputs section", () => {
      renderComponentsPage();
      expect(screen.getByText("Inputs")).toBeInTheDocument();
      expect(
        screen.getByText("Text input components with labels and validation")
      ).toBeInTheDocument();
    });

    it("renders Select section", () => {
      renderComponentsPage();
      expect(screen.getByText("Select")).toBeInTheDocument();
      expect(screen.getByText("Dropdown select component")).toBeInTheDocument();
    });

    it("renders Textarea section", () => {
      renderComponentsPage();
      expect(screen.getByText("Textarea")).toBeInTheDocument();
      expect(screen.getByText("Multi-line text input")).toBeInTheDocument();
    });

    it("renders Checkbox section", () => {
      renderComponentsPage();
      expect(screen.getByText("Checkbox")).toBeInTheDocument();
      expect(screen.getByText("Checkbox input with label")).toBeInTheDocument();
    });

    it("renders Switch section", () => {
      renderComponentsPage();
      expect(screen.getByText("Switch")).toBeInTheDocument();
      expect(screen.getByText("Toggle switch component")).toBeInTheDocument();
    });

    it("renders Toggle section", () => {
      renderComponentsPage();
      expect(screen.getByText("Toggle")).toBeInTheDocument();
      expect(
        screen.getByText("Toggle with labels on both sides")
      ).toBeInTheDocument();
    });

    it("renders Badges section", () => {
      renderComponentsPage();
      expect(screen.getByText("Badges")).toBeInTheDocument();
      expect(screen.getByText("Badge components")).toBeInTheDocument();
    });

    it("renders Alerts section", () => {
      renderComponentsPage();
      expect(screen.getByText("Alerts")).toBeInTheDocument();
      expect(screen.getByText("Alert notifications")).toBeInTheDocument();
    });

    it("renders Cards section", () => {
      renderComponentsPage();
      expect(screen.getByText("Cards")).toBeInTheDocument();
      expect(screen.getByText("Card components")).toBeInTheDocument();
    });

    it("renders Avatars section", () => {
      renderComponentsPage();
      expect(screen.getByText("Avatars")).toBeInTheDocument();
      expect(screen.getByText("Avatar components")).toBeInTheDocument();
    });
  });

  describe("Button Examples", () => {
    it("renders various button variants", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("button", { name: "Primary" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Secondary" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Danger" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Outline" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Disabled" })
      ).toBeInTheDocument();
    });

    it("renders loading button", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("button", { name: /loading/i })
      ).toBeInTheDocument();
    });
  });

  describe("Input Examples", () => {
    it("renders input fields", () => {
      renderComponentsPage();
      expect(screen.getByLabelText("Default Input")).toBeInTheDocument();
      expect(screen.getByLabelText("With Error")).toBeInTheDocument();
      expect(screen.getByLabelText("With Helper")).toBeInTheDocument();
    });

    it("displays error message on input", () => {
      renderComponentsPage();
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("displays helper text on input", () => {
      renderComponentsPage();
      expect(screen.getByText("This is helper text")).toBeInTheDocument();
    });
  });

  describe("Checkbox Examples", () => {
    it("renders checkbox options", () => {
      renderComponentsPage();
      expect(
        screen.getByLabelText("Accept terms and conditions")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Subscribe to newsletter")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Disabled checkbox")).toBeInTheDocument();
    });
  });

  describe("Alert Examples", () => {
    it("renders alert variants", () => {
      renderComponentsPage();
      // Check that alert variants exist - may appear in both Alerts section and Badges section
      expect(screen.getAllByText("Info").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Success").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Warning").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Error").length).toBeGreaterThan(0);
    });

    it("displays alert messages", () => {
      renderComponentsPage();
      // Check that alert messages exist in the Alerts section
      expect(
        screen.getAllByText(/This is an informational message/).length
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(/Operation completed successfully/).length
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(/Please review before proceeding/).length
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(/Something went wrong/).length
      ).toBeGreaterThan(0);
    });
  });

  describe("Card Examples", () => {
    it("renders multiple cards", () => {
      renderComponentsPage();
      expect(screen.getByText("Default Card")).toBeInTheDocument();
      expect(screen.getByText("Outlined")).toBeInTheDocument();
      expect(screen.getByText("Elevated")).toBeInTheDocument();
      expect(screen.getByText("Flat")).toBeInTheDocument();
    });

    it("displays card descriptions", () => {
      renderComponentsPage();
      expect(screen.getByText("This is a default card")).toBeInTheDocument();
      expect(screen.getByText("With border style")).toBeInTheDocument();
      expect(screen.getByText("With shadow")).toBeInTheDocument();
      expect(screen.getByText("Minimal style")).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    it("applies gradient background", () => {
      const { container } = renderComponentsPage();
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass(
        "bg-gradient-to-br",
        "from-gray-50",
        "to-gray-100"
      );
    });

    it("uses max-width container", () => {
      const { container } = renderComponentsPage();
      const containerDiv = container.querySelector(".max-w-6xl");
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      renderComponentsPage();
      const h1 = screen.getByRole("heading", {
        level: 1,
        name: "Component Library",
      });
      expect(h1).toBeInTheDocument();

      // ComponentDemo uses h3 for section titles
      const h3s = screen.getAllByRole("heading", { level: 3 });
      expect(h3s.length).toBeGreaterThan(0);

      // ComponentDemo uses h4 for "Preview", "Code", "Props" labels
      const h4s = screen.getAllByRole("heading", { level: 4 });
      expect(h4s.length).toBeGreaterThan(0);
    });

    it("all form inputs have associated labels", () => {
      renderComponentsPage();

      // Check checkboxes
      expect(
        screen.getByLabelText("Accept terms and conditions")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Subscribe to newsletter")
      ).toBeInTheDocument();

      // Check inputs
      expect(screen.getByLabelText("Default Input")).toBeInTheDocument();
      expect(screen.getByLabelText("With Error")).toBeInTheDocument();
      expect(screen.getByLabelText("With Helper")).toBeInTheDocument();
    });
  });

  describe("Interactive Elements", () => {
    it("all buttons are clickable", () => {
      renderComponentsPage();
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      // Filter out buttons that are intentionally disabled or loading
      const enabledButtons = buttons.filter(
        (button) =>
          !button.hasAttribute("disabled") &&
          !button.getAttribute("class")?.includes("loading")
      );

      // All non-disabled, non-loading buttons should be enabled
      enabledButtons.forEach((button) => {
        expect(button).toBeEnabled();
      });

      // Verify we have at least some enabled buttons
      expect(enabledButtons.length).toBeGreaterThan(0);
    });

    it("disabled button is not enabled", () => {
      renderComponentsPage();
      const disabledButton = screen.getByRole("button", { name: "Disabled" });
      expect(disabledButton).toBeDisabled();
    });
  });
});
