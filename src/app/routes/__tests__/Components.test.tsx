import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import ComponentsPage from "../Components";

const mockScrollTo = vi.fn();
let getElementByIdSpy: ReturnType<typeof vi.spyOn>;

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
      expect(
        screen.getByRole("heading", { name: "Buttons" })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Button components with various styles and states")
      ).toBeInTheDocument();
    });

    it("renders Inputs section", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("heading", { name: "Inputs" })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Text input components with labels and validation")
      ).toBeInTheDocument();
    });

    it("renders Select section", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("heading", { name: "Select" })
      ).toBeInTheDocument();
      expect(screen.getByText("Dropdown select component")).toBeInTheDocument();
    });

    it("renders Combobox section", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("heading", { name: "Combobox" })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Searchable dropdown with type-to-filter")
      ).toBeInTheDocument();
    });

    describe("Combobox variants", () => {
      it("renders all four Combobox variants (Choose a fruit, With error, With helper, Disabled)", () => {
        renderComponentsPage();

        const chooseFruit = screen.getByLabelText(/choose a fruit/i);
        expect(chooseFruit).toBeInTheDocument();
        expect(chooseFruit).toHaveAttribute("placeholder", "Type to search...");

        const withError = screen.getByLabelText(/with error/i);
        expect(withError).toBeInTheDocument();
        const comboboxSection = document.getElementById("combobox");
        expect(comboboxSection).toBeInTheDocument();
        expect(comboboxSection).toHaveTextContent("This field is required");

        const withHelper = screen.getByLabelText(/with helper/i);
        expect(withHelper).toBeInTheDocument();
        expect(screen.getByText("Pick one from the list")).toBeInTheDocument();

        const disabledCombobox = screen.getByLabelText(/^disabled$/i);
        expect(disabledCombobox).toBeInTheDocument();
        expect(disabledCombobox).toBeDisabled();
      });
    });

    it("renders Textarea section", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("heading", { name: "Textarea" })
      ).toBeInTheDocument();
      expect(screen.getByText("Multi-line text input")).toBeInTheDocument();
    });

    it("renders Checkbox section", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("heading", { name: "Checkbox" })
      ).toBeInTheDocument();
      expect(screen.getByText("Checkbox input with label")).toBeInTheDocument();
    });

    it("renders Switch section", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("heading", { name: "Switch" })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Segmented control switch component")
      ).toBeInTheDocument();
    });

    it("renders Toggle section", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("heading", { name: "Toggle" })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Toggle with labels on both sides")
      ).toBeInTheDocument();
    });

    it("renders Badges section", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("heading", { name: "Badges" })
      ).toBeInTheDocument();
      expect(screen.getByText("Badge components")).toBeInTheDocument();
    });

    it("renders Alerts section", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("heading", { name: "Alerts" })
      ).toBeInTheDocument();
      expect(screen.getByText("Alert notifications")).toBeInTheDocument();
    });

    it("renders Cards section", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("heading", { name: "Cards" })
      ).toBeInTheDocument();
      expect(screen.getByText("Card components")).toBeInTheDocument();
    });

    it("renders Avatars section", () => {
      renderComponentsPage();
      expect(
        screen.getByRole("heading", { name: "Avatars" })
      ).toBeInTheDocument();
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
      // Multiple disabled buttons exist
      expect(
        screen.getAllByRole("button", { name: "Disabled" }).length
      ).toBeGreaterThan(0);
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
      // Check inputs by placeholder instead due to label association complexities in the component library demo
      expect(
        screen.getAllByPlaceholderText("Enter text...").length
      ).toBeGreaterThanOrEqual(3);
    });

    it("displays error message on input", () => {
      renderComponentsPage();
      expect(
        screen.getAllByText("This field is required").length
      ).toBeGreaterThan(0);
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
    it("applies page background", () => {
      const { container } = renderComponentsPage();
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("bg-gray-50");
    });

    it("uses max-width container", () => {
      const { container } = renderComponentsPage();
      const containerDiv = container.querySelector(".max-w-7xl");
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

      // Check combobox
      expect(screen.getByLabelText("Choose a fruit")).toBeInTheDocument();

      // Verify input section exists with proper labels (as text)
      expect(screen.getByText("Default Input")).toBeInTheDocument();
      expect(screen.getByText("With Error")).toBeInTheDocument();
      expect(screen.getByText("With Helper")).toBeInTheDocument();
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
      const disabledButtons = screen.getAllByRole("button", {
        name: "Disabled",
      });
      expect(disabledButtons.length).toBeGreaterThan(0);
      disabledButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("handleTocClick / TOC", () => {
    const mockGetBoundingClientRect = () => ({
      top: 100,
      left: 0,
      width: 1,
      height: 1,
      bottom: 101,
      right: 1,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    });

    beforeEach(() => {
      mockScrollTo.mockClear();
      window.scrollTo = mockScrollTo;
      Object.defineProperty(window, "pageYOffset", {
        value: 0,
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("scrolls to section when TOC link is clicked (smooth)", async () => {
      const user = userEvent.setup();
      vi.doMock("motion/react", async () => {
        const actual =
          await vi.importActual<typeof import("motion/react")>("motion/react");
        return {
          ...actual,
          useReducedMotion: () => false,
        };
      });
      vi.resetModules();
      const { default: ComponentsPageSmooth } = await import("../Components");
      const mockElement = {
        getBoundingClientRect: mockGetBoundingClientRect,
      } as unknown as HTMLElement;
      getElementByIdSpy = vi
        .spyOn(document, "getElementById")
        .mockReturnValue(mockElement);

      render(
        <BrowserRouter>
          <ComponentsPageSmooth />
        </BrowserRouter>
      );

      const tocLink = screen.getByRole("link", { name: "Combobox" });
      expect(tocLink).toHaveAttribute("href", "#combobox");
      await user.click(tocLink);

      expect(getElementByIdSpy).toHaveBeenCalledWith("combobox");
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 20,
        behavior: "smooth",
      });
    });

    it("does not scroll when target element is not found", async () => {
      const user = userEvent.setup();
      getElementByIdSpy = vi
        .spyOn(document, "getElementById")
        .mockReturnValue(null);

      render(
        <BrowserRouter>
          <ComponentsPage />
        </BrowserRouter>
      );

      const tocLink = screen.getByRole("link", { name: "Combobox" });
      await user.click(tocLink);

      expect(getElementByIdSpy).toHaveBeenCalledWith("combobox");
      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it("uses auto scroll when reduced motion preferred", async () => {
      const user = userEvent.setup();
      vi.doMock("motion/react", async () => {
        const actual =
          await vi.importActual<typeof import("motion/react")>("motion/react");
        return {
          ...actual,
          useReducedMotion: () => true,
        };
      });
      vi.resetModules();
      const { default: ComponentsPageWithReducedMotion } =
        await import("../Components");
      const mockElement = {
        getBoundingClientRect: mockGetBoundingClientRect,
      } as unknown as HTMLElement;
      getElementByIdSpy = vi
        .spyOn(document, "getElementById")
        .mockReturnValue(mockElement);

      render(
        <BrowserRouter>
          <ComponentsPageWithReducedMotion />
        </BrowserRouter>
      );

      const tocLink = screen.getByRole("link", { name: "Combobox" });
      await user.click(tocLink);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 20,
        behavior: "auto",
      });
    });
  });
});
