import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "./Home";

describe("Starter Home Page", () => {
  it("renders starter welcome message and CLI instructions", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText("Welcome to Your App")).toBeInTheDocument();
    expect(screen.getByText("frontier-fe add")).toBeInTheDocument();
  });
});
