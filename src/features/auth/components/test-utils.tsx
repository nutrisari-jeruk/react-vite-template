import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";

/**
 * Creates a test QueryClient with disabled retries and caching
 */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });

interface AuthTestWrapperProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

/**
 * Standard wrapper for auth form tests
 */
export function AuthTestWrapper({
  children,
  queryClient,
}: AuthTestWrapperProps) {
  const testQueryClient = queryClient ?? createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

/**
 * Custom render function for auth components
 */
export const renderAuth = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    queryClient?: QueryClient;
  }
) => {
  const { queryClient, ...rest } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => (
      <AuthTestWrapper queryClient={queryClient}>{children}</AuthTestWrapper>
    ),
    ...rest,
  });
};

/**
 * Test credentials
 */
export const TEST_CREDENTIALS = {
  username: "14029808221",
  password: "password123",
  otp: "123456",
  invalidUsername: "invalid_user",
  wrongPassword: "wrongpassword",
} as const;

/**
 * Standard test user data
 */
export const TEST_USER = {
  name: "Test User",
  email: "test@example.com",
  username: "14029808221",
  token: "test-token",
} as const;
