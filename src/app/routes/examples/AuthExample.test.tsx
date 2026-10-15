import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import AuthExample from "./Auth";
const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  session: { data: null as { name: string } | null, isLoading: false },
}));
vi.mock("@/features/auth", () => ({
  useUser: () => mocks.session,
  useLogout: () => ({ mutate: mocks.mutate, isPending: false }),
  LoginForm: () => <p>Session login form</p>,
}));
beforeEach(() => {
  mocks.session.data = null;
  mocks.session.isLoading = false;
  vi.clearAllMocks();
});
it("shows the real login component for anonymous visitors", () => {
  render(<AuthExample />);
  expect(screen.getByText("Session login form")).toBeInTheDocument();
});
it("shows session loading", () => {
  mocks.session.isLoading = true;
  render(<AuthExample />);
  expect(screen.getByRole("status")).toBeInTheDocument();
});
it("shows the backend user and logs out through the shared hook", async () => {
  mocks.session.data = { name: "User" };
  render(<AuthExample />);
  expect(screen.getByText("Welcome back, User!")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Sign Out" }));
  expect(mocks.mutate).toHaveBeenCalledWith(undefined);
});
