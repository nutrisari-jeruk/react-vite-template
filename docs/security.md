# Security

## Overview

This document covers security best practices implemented in the application.

## Authentication

### Token Storage

The application uses environment-aware token storage:

| Environment | Storage | Reason |
|-------------|---------|--------|
| Development | localStorage | Easier debugging |
| Production | Cookies | More secure |

```typescript
// src/features/auth/lib/token-storage.ts
const storage = isProduction ? cookieStorage : localStorageStorage;

export function setAccessToken(token: string) {
  storage.set(STORAGE_KEYS.ACCESS_TOKEN, token);
}

export function getAccessToken(): string | null {
  return storage.get(STORAGE_KEYS.ACCESS_TOKEN);
}
```

### Cookie Configuration

Production cookies use secure settings:

```typescript
const cookieOptions = {
  secure: true,      // HTTPS only
  sameSite: "strict", // CSRF protection
  path: "/",
  expires: 7,        // Days
};
```

### Token Expiration

JWT tokens are validated for expiration:

```typescript
import { isTokenExpired, getTimeUntilExpiration } from "@/features/auth";

// Check if token is expired
if (isTokenExpired(token)) {
  // Redirect to login
}

// Get time until expiration
const expiresIn = getTimeUntilExpiration(token);
if (expiresIn < 5 * 60 * 1000) {
  // Refresh token soon
}
```

### Automatic Token Clearing

On 401 responses, tokens are automatically cleared:

```typescript
// src/lib/api-client.ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthTokens();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## XSS Prevention

### React's Built-in Protection

React escapes values by default:

```typescript
// Safe - React escapes this
const userInput = "<script>alert('xss')</script>";
return <div>{userInput}</div>;
// Renders as text, not HTML
```

### Avoid dangerouslySetInnerHTML

```typescript
// ❌ Avoid
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ If necessary, sanitize first
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

### URL Validation

Validate URLs before using:

```typescript
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Usage
if (isValidUrl(userProvidedUrl)) {
  window.location.href = userProvidedUrl;
}
```

## CSRF Protection

### SameSite Cookies

Cookies are configured with `sameSite: "strict"`:

```typescript
// Prevents cookies from being sent with cross-site requests
document.cookie = `token=${token}; SameSite=Strict; Secure`;
```

### Request Headers

Include CSRF token in requests if required by backend:

```typescript
api.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});
```

## Input Validation

### Client-Side Validation

Use Zod for type-safe validation:

```typescript
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Needs uppercase")
    .regex(/[0-9]/, "Needs number"),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Alphanumeric only"),
});
```

### Server-Side Validation

Always validate on the server too. Client validation is for UX, server validation is for security.

## Environment Variables

### Never Expose Secrets

```typescript
// ❌ Never commit secrets
VITE_API_SECRET=abc123

// ✅ Use placeholders in examples
VITE_API_SECRET=<YOUR_API_SECRET>
```

### Validate Environment

Environment variables are validated at startup:

```typescript
// src/config/env.ts
function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}
```

## Content Security Policy

If using CSP headers, configure appropriately:

```typescript
// Example CSP header (set on server)
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
```

## Error Handling

### Don't Expose Stack Traces

```typescript
// ❌ Don't show to users
catch (error) {
  alert(error.stack);
}

// ✅ Show user-friendly message
catch (error) {
  const message = getErrorMessage(error);
  showNotification(message);

  // Log details for debugging
  console.error(error);
}
```

### Sanitize Error Messages

The API error handler provides safe messages:

```typescript
import { getErrorMessage } from "@/lib";

// Returns user-friendly message, not raw error
const message = getErrorMessage(error);
```

## Dependency Security

### Regular Updates

Keep dependencies updated:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### Lock File

Commit `package-lock.json` to ensure consistent installs.

## Best Practices Checklist

### Authentication
- [ ] Use secure token storage in production
- [ ] Validate token expiration
- [ ] Clear tokens on logout/401
- [ ] Use HTTPS only

### Data Handling
- [ ] Validate all user input
- [ ] Sanitize HTML if rendering user content
- [ ] Validate URLs before navigation
- [ ] Don't expose sensitive data in errors

### Configuration
- [ ] Never commit secrets
- [ ] Validate environment variables
- [ ] Use different configs per environment

### Dependencies
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Review new dependencies

## Related Documentation

- [API Layer](./api-layer.md)
- [Error Handling](./error-handling.md)
