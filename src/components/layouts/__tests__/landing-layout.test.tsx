import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LandingLayout } from "../landing-layout";

describe("LandingLayout", () => {
  it("renders outlet without navbar", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<div>Landing Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Landing Content")).toBeInTheDocument();
    expect(screen.getByText(/React Frontend Template/)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /home/i })
    ).not.toBeInTheDocument();
  });
});
