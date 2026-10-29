import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";
import { clearAuthTokens, setAccessToken } from "@/libs/tokenStorage";
import { AuthGuard } from "./AuthGuard";

const session = vi.hoisted(() => ({
  isLoading: false,
  data: null as { id: string } | null,
}));
vi.mock("../lib/AuthProvider", () => ({ useUser: () => session }));
function renderGuard() {
  render(
    <MemoryRouter initialEntries={["/private"]}>
      <Routes>
        <Route
          path="/private"
          element={
            <AuthGuard>
              <p>Private page</p>
            </AuthGuard>
          }
        />
        <Route path="/login" element={<p>Login destination</p>} />
        <Route path="/otp" element={<p>OTP destination</p>} />
      </Routes>
    </MemoryRouter>
  );
}
beforeEach(() => {
  clearAuthTokens();
  session.isLoading = false;
  session.data = null;
});
it("redirects anonymous visitors", () => {
  renderGuard();
  expect(screen.getByText("Login destination")).toBeInTheDocument();
});
it("redirects a pending session to OTP after reload", () => {
  setAccessToken("pending");
  sessionStorage.setItem("otp_pending", "true");
  renderGuard();
  expect(screen.getByText("OTP destination")).toBeInTheDocument();
});
it("waits for /me before showing protected content", () => {
  setAccessToken("token");
  session.isLoading = true;
  renderGuard();
  expect(screen.getByRole("status")).toHaveTextContent("Loading session");
  expect(screen.queryByText("Private page")).not.toBeInTheDocument();
});
it("renders the authenticated page", () => {
  setAccessToken("token");
  session.data = { id: "42" };
  renderGuard();
  expect(screen.getByText("Private page")).toBeInTheDocument();
});
it("redirects an invalid session", () => {
  setAccessToken("token");
  renderGuard();
  expect(screen.getByText("Login destination")).toBeInTheDocument();
});
