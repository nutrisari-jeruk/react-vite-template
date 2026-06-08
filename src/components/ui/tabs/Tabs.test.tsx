import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./";

describe("Tabs", () => {
  describe("Basic Rendering", () => {
    it("renders tabs with list and content", () => {
      const TestComponent = () => {
        const [value, setValue] = useState("tab1");

        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText("Tab 1")).toBeInTheDocument();
      expect(screen.getByText("Tab 2")).toBeInTheDocument();
      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });

    it("only shows content for active tab", () => {
      const TestComponent = () => {
        const [value, setValue] = useState("tab1");

        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    });
  });

  describe("Tab Switching", () => {
    it("switches content when tab is clicked", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const [value, setValue] = useState("tab1");

        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      const tab2 = screen.getByText("Tab 2");

      await user.click(tab2);

      expect(screen.getByText("Content 2")).toBeInTheDocument();
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });

    it("calls onValueChange with correct value", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      const TestComponent = () => {
        const [value, setValue] = useState("tab1");

        const handleValueChange = (newValue: string) => {
          handleChange(newValue);
          setValue(newValue);
        };

        return (
          <Tabs value={value} onValueChange={handleValueChange}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      const tab2 = screen.getByText("Tab 2");

      await user.click(tab2);

      expect(handleChange).toHaveBeenCalledWith("tab2");
    });
  });

  describe("Disabled Tab", () => {
    it("does not switch when disabled tab is clicked", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const [value, setValue] = useState("tab1");

        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2" disabled>
                Tab 2
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      const tab2 = screen.getByText("Tab 2");

      await user.click(tab2);

      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    });

    it("applies disabled styling", () => {
      const TestComponent = () => {
        const [value, setValue] = useState("tab1");

        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2" disabled>
                Tab 2
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      const tab2 = screen.getByText("Tab 2");
      expect(tab2).toHaveAttribute("aria-disabled", "true");
      expect(tab2).toHaveAttribute("aria-selected", "false");
      expect(tab2).toHaveClass("disabled:opacity-50");
    });
  });

  describe("Accessibility", () => {
    it("renders tablist with correct role", () => {
      const TestComponent = () => {
        const [value, setValue] = useState("tab1");

        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      const tablist = screen.getByRole("tablist");
      expect(tablist).toBeInTheDocument();
    });

    it("renders tab buttons with correct role", () => {
      const TestComponent = () => {
        const [value, setValue] = useState("tab1");

        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(2);
    });

    it("renders tab panel with correct role", () => {
      const TestComponent = () => {
        const [value, setValue] = useState("tab1");

        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      const panel = screen.getByRole("tabpanel");
      expect(panel).toBeInTheDocument();
    });
  });

  describe("Custom Class Names", () => {
    it("applies custom className to Tabs", () => {
      const TestComponent = () => {
        const [value, setValue] = useState("tab1");

        return (
          <Tabs value={value} onValueChange={setValue} className="custom-tabs">
            <TabsList className="custom-list">
              <TabsTrigger value="tab1" className="custom-trigger">
                Tab 1
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="custom-content">
              Content 1
            </TabsContent>
          </Tabs>
        );
      };

      const { container } = render(<TestComponent />);

      expect(container.firstChild).toHaveClass("custom-tabs");
      expect(screen.getByRole("tablist")).toHaveClass("custom-list");
      expect(screen.getByText("Tab 1")).toHaveClass("custom-trigger");
      expect(screen.getByText("Content 1")).toHaveClass("custom-content");
    });
  });

  describe("Integration", () => {
    it("handles complete tabs lifecycle", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const [value, setValue] = useState("tab1");

        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Profile</TabsTrigger>
              <TabsTrigger value="tab2">Settings</TabsTrigger>
              <TabsTrigger value="tab3">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <p>Profile content</p>
            </TabsContent>
            <TabsContent value="tab2">
              <p>Settings content</p>
            </TabsContent>
            <TabsContent value="tab3">
              <p>Notifications content</p>
            </TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      // Initial state
      expect(screen.getByText("Profile content")).toBeInTheDocument();
      expect(screen.queryByText("Settings content")).not.toBeInTheDocument();

      // Switch to Settings
      await user.click(screen.getByText("Settings"));
      expect(screen.getByText("Settings content")).toBeInTheDocument();
      expect(screen.queryByText("Profile content")).not.toBeInTheDocument();

      // Switch to Notifications
      await user.click(screen.getByText("Notifications"));
      expect(screen.getByText("Notifications content")).toBeInTheDocument();
      expect(screen.queryByText("Settings content")).not.toBeInTheDocument();

      // Switch back to Profile
      await user.click(screen.getByText("Profile"));
      expect(screen.getByText("Profile content")).toBeInTheDocument();
      expect(
        screen.queryByText("Notifications content")
      ).not.toBeInTheDocument();
    });
  });
});
