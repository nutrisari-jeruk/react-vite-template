import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthenticatedLayout } from "../authenticated-layout";

vi.mock("@/features/auth", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-guard">{children}</div>
  ),
}));

vi.mock("../navbar", () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

describe("AuthenticatedLayout", () => {
  it("renders AuthGuard with navbar, outlet, and footer", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<AuthenticatedLayout />}>
            <Route index element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("auth-guard")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.getByText(/React Frontend Template/)).toBeInTheDocument();
  });
});
