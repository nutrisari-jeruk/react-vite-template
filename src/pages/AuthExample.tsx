/**
 * Authentication Example Page
 * Demonstrates secure token storage and authentication hooks
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { LoginCredentials } from "@/types/auth";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Alert from "@/components/Alert";

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
      // Simulate API call
      // const response = await api.post('/auth/login', formData)
      // const { accessToken, refreshToken } = response.data

      // For demo: Simulate successful login
      const mockAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      const mockRefreshToken = "refresh-token-" + Date.now();

      // Use the login hook (simulated)
      // login(mockAccessToken, mockRefreshToken);
      localStorage.setItem("token", mockAccessToken);
      localStorage.setItem("refreshToken", mockRefreshToken);

      // Redirect to dashboard
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
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Authentication Example
        </h1>

        {/* Login Form */}
        {!isAuthenticated ? (
          <div className="bg-white rounded-lg shadow p-6">
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
                placeholder="•••••••••"
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

            <p className="mt-4 text-sm text-center text-gray-600">
              Demo: Enter any email and password to sign in
            </p>
          </div>
        ) : (
          /* Authenticated State */
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
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

              <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>

              <div className="space-y-2 text-sm text-gray-600 mb-6">
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

        {/* Features Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            Secure Token Storage Features
          </h3>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>✓ Environment-based storage (cookies in production)</li>
            <li>✓ Cookie options (httpOnly, secure, sameSite)</li>
            <li>✓ Automatic token expiration tracking</li>
            <li>✓ JWT payload parsing</li>
            <li>✓ localStorage fallback when cookies fail</li>
            <li>✓ Type-safe token management</li>
            <li>✓ Automatic token cleanup on logout</li>
          </ul>
        </div>

        {/* Token Storage Info */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">
            Current Storage Method
          </h3>
          <p className="text-sm text-gray-700">
            Using:{" "}
            <span className="font-mono font-medium">
              {import.meta.env.MODE === "production"
                ? "Cookies"
                : "localStorage"}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {import.meta.env.MODE === "production"
              ? "Cookies with secure, httpOnly flags (server-set)"
              : "localStorage (development fallback)"}
          </p>
        </div>
      </div>
    </div>
  );
}
