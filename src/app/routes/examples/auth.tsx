import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import type { LoginCredentials } from "@/features/auth";
import { Input, Button, Checkbox, Alert } from "@/components/ui";

export default function AuthExample() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    accessToken,
    logout,
    tokenExpiresIn,
    isTokenExpired,
  } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const mockAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      const mockRefreshToken = "refresh-token-" + Date.now();

      localStorage.setItem("token", mockAccessToken);
      localStorage.setItem("refreshToken", mockRefreshToken);

      navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatTime = (ms: number | null) => {
    if (!ms) return "Unknown";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Authentication Example
        </h1>

        {!isAuthenticated ? (
          <div className="rounded-lg bg-white p-6 shadow">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
                required
              />

              <Input
                id="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter password"
                required
              />

              <Checkbox
                id="rememberMe"
                label="Remember me"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
              />

              {error && (
                <Alert
                  variant="error"
                  dismissible
                  onDismiss={() => setError(null)}
                >
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="primary"
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Demo: Enter any email and password to sign in
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="mb-2 text-xl font-semibold">Welcome back!</h2>

              <div className="mb-6 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-green-600">
                    Authenticated
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Token:</span>
                  <span className="font-mono text-xs">
                    {accessToken?.substring(0, 20)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Expires in:</span>
                  <span
                    className={`font-medium ${
                      isTokenExpired
                        ? "text-red-600"
                        : tokenExpiresIn && tokenExpiresIn < 5 * 60000
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {isTokenExpired ? "Expired" : formatTime(tokenExpiresIn)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="danger"
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold text-blue-800">
            Secure Token Storage Features
          </h3>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>✓ Environment-based storage</li>
            <li>✓ Automatic token expiration tracking</li>
            <li>✓ JWT payload parsing</li>
            <li>✓ Type-safe token management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
