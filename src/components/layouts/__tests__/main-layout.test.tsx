import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "../main-layout";

vi.mock("../navbar", () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

describe("MainLayout", () => {
  it("renders navbar, outlet, and footer", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<div>Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Page Content")).toBeInTheDocument();
    expect(screen.getByText(/React Frontend Template/)).toBeInTheDocument();
  });

  it("hides navbar when showNavbar is false", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<MainLayout showNavbar={false} />}>
            <Route index element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
