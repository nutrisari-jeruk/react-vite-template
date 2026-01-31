import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthLayout } from "../auth-layout";

describe("AuthLayout", () => {
  it("renders heading and outlet", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<div>Login Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("React Template")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByText("Login Form")).toBeInTheDocument();
  });
});
