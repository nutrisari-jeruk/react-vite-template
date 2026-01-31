import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "../navbar";

const mockUseUser = vi.fn();
const mockLogout = vi.fn();

vi.mock("@/features/auth/lib/auth-provider", () => ({
  useUser: () => mockUseUser(),
  useLogout: () => ({ mutate: mockLogout }),
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({
      data: null,
      isPending: false,
      isError: false,
    });
  });

  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Components" })
    ).toBeInTheDocument();
  });

  it("renders Examples submenu", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const examplesButton = screen.getByRole("button", { name: /examples/i });
    await user.click(examplesButton);

    expect(await screen.findByText("Error Handling")).toBeInTheDocument();
    expect(screen.getByText("Authentication")).toBeInTheDocument();
    expect(screen.getByText("Form Validation")).toBeInTheDocument();
  });

  it("renders open menu button on mobile", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: "Open menu" })
    ).toBeInTheDocument();
  });

  it("opens mobile menu when hamburger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(
      screen.getByRole("button", { name: "Close menu" })
    ).toBeInTheDocument();
  });
});
