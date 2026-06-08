import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "./";

describe("Accordion", () => {
  describe("Basic Rendering", () => {
    it("renders accordion with items", () => {
      const TestComponent = () => {
        const [value, setValue] = useState<string | null>(null);

        return (
          <Accordion value={value} onValueChange={setValue}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Section 1</AccordionTrigger>
              <AccordionPanel>Content 1</AccordionPanel>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Section 2</AccordionTrigger>
              <AccordionPanel>Content 2</AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText("Section 1")).toBeInTheDocument();
      expect(screen.getByText("Section 2")).toBeInTheDocument();
    });

    it("renders triggers as buttons", () => {
      const TestComponent = () => {
        const [value, setValue] = useState<string | null>(null);

        return (
          <Accordion value={value} onValueChange={setValue}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Section 1</AccordionTrigger>
              <AccordionPanel>Content 1</AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByText("Section 1");
      expect(trigger.tagName.toLowerCase()).toBe("button");
    });
  });

  describe("Accordion Item Expansion", () => {
    it("expands panel when trigger is clicked", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        return (
          <Accordion defaultValue={null}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Section 1</AccordionTrigger>
              <AccordionPanel>Content 1</AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByText("Section 1");

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Content 1")).toBeInTheDocument();
      });
    });

    it("collapses panel when trigger is clicked again", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        return (
          <Accordion defaultValue={["item-1"]}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Section 1</AccordionTrigger>
              <AccordionPanel>Content 1</AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText("Content 1")).toBeInTheDocument();
      });

      const trigger = screen.getByText("Section 1");

      await user.click(trigger);

      // Content should be hidden after collapse
      await waitFor(() => {
        expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
      });
    });

    it("only one panel is open at a time in single mode", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const [value, setValue] = useState<string | null>(null);

        return (
          <Accordion value={value} onValueChange={setValue}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Section 1</AccordionTrigger>
              <AccordionPanel>Content 1</AccordionPanel>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Section 2</AccordionTrigger>
              <AccordionPanel>Content 2</AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      };

      render(<TestComponent />);

      const trigger1 = screen.getByText("Section 1");
      const trigger2 = screen.getByText("Section 2");

      await user.click(trigger1);

      expect(screen.getByText("Content 1")).toBeInTheDocument();

      await user.click(trigger2);

      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });
  });

  describe("Chevron Icon", () => {
    it("rotates chevron when expanded", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const [value, setValue] = useState<string | null>(null);

        return (
          <Accordion value={value} onValueChange={setValue}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Section 1</AccordionTrigger>
              <AccordionPanel>Content 1</AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByText("Section 1");
      const chevron = trigger.nextElementSibling as SVGElement;

      expect(chevron).not.toHaveClass("rotate-180");

      await user.click(trigger);

      expect(chevron).toHaveClass("rotate-180");
    });
  });

  describe("Accessibility", () => {
    it("renders trigger with correct button attributes", () => {
      const TestComponent = () => {
        const [value, setValue] = useState<string | null>(null);

        return (
          <Accordion value={value} onValueChange={setValue}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Section 1</AccordionTrigger>
              <AccordionPanel>Content 1</AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByText("Section 1");

      expect(trigger.tagName.toLowerCase()).toBe("button");
      expect(trigger).toHaveAttribute("type", "button");
    });
  });

  describe("Custom Class Names", () => {
    it("applies custom className to Accordion", () => {
      const TestComponent = () => {
        const [value, setValue] = useState<string | null>(null);

        return (
          <Accordion
            value={value}
            onValueChange={setValue}
            className="custom-accordion"
          >
            <AccordionItem value="item-1" className="custom-item">
              <AccordionTrigger className="custom-trigger">
                Section 1
              </AccordionTrigger>
              <AccordionPanel className="custom-panel">
                Content 1
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      };

      const { container } = render(<TestComponent />);

      expect(container.firstChild).toHaveClass("custom-accordion");
      expect(screen.getByText("Section 1").closest(".border")).toHaveClass(
        "custom-item"
      );
      expect(screen.getByText("Section 1")).toHaveClass("custom-trigger");
    });
  });

  describe("Integration", () => {
    it("handles complete accordion lifecycle", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const [value, setValue] = useState<string | null>(null);

        return (
          <Accordion value={value} onValueChange={setValue}>
            <AccordionItem value="faq-1">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionPanel>
                <p>You can return items within 30 days of purchase.</p>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger>
                Do you offer international shipping?
              </AccordionTrigger>
              <AccordionPanel>
                <p>Yes, we ship to over 50 countries worldwide.</p>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger>How can I track my order?</AccordionTrigger>
              <AccordionPanel>
                <p>You'll receive a tracking number via email once shipped.</p>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      };

      render(<TestComponent />);

      // All sections collapsed initially
      expect(
        screen.queryByText("You can return items")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Yes, we ship")).not.toBeInTheDocument();

      // Open first FAQ
      await user.click(screen.getByText("What is your return policy?"));
      expect(
        screen.getByText("You can return items within 30 days of purchase.")
      ).toBeInTheDocument();

      // Switch to second FAQ (first should close)
      await user.click(
        screen.getByText("Do you offer international shipping?")
      );
      expect(
        screen.queryByText("You can return items")
      ).not.toBeInTheDocument();
      expect(
        screen.getByText("Yes, we ship to over 50 countries worldwide.")
      ).toBeInTheDocument();

      // Open third FAQ
      await user.click(screen.getByText("How can I track my order?"));
      expect(
        screen.getByText(
          "You'll receive a tracking number via email once shipped."
        )
      ).toBeInTheDocument();

      // Close third FAQ
      await user.click(screen.getByText("How can I track my order?"));
      expect(
        screen.queryByText("You'll receive a tracking number")
      ).not.toBeInTheDocument();
    });
  });
});
