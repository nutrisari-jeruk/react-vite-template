# Security

## Overview

This document covers security best practices implemented in the application.

## Authentication

### Token Storage and Session Lifecycle

Token utilities are defined in `src/libs/tokenStorage.ts`. Bearer access and refresh tokens are stored in localStorage in every environment — development, staging, and production alike. `tokenStorage` therefore has a single adapter; there is no cookie storage and no environment switch.

localStorage is readable by any JavaScript running on the origin. A successful XSS attack can exfiltrate tokens, so localStorage tokens are **not** HttpOnly and are **not** intrinsically secure. HttpOnly, server-managed cookies require a backend contract this template does not assume. JWT helpers decode payloads and inspect expiration without verifying signatures.

Setters take tokens only: `setAccessToken(token)`, `setRefreshToken(token)`, `setAuthTokens(accessToken, refreshToken?)`. There are no cookie options.

`useUser` reads `/auth/me` through the shared query cache. Pending OTP sessions cannot access protected routes. Logout clears local tokens, pending verification state, and private query data even if the server request fails.

The HTTP client uses a separate refresh transport. Authenticated 401 responses share one refresh and retry once; both rotated tokens are persisted. Failed refresh clears session state. Logout invalidates in-flight refresh results, preventing a late response from restoring a cleared session.

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

### Bearer Tokens Are Not Ambient Credentials

Authentication uses an `Authorization: Bearer <token>` header. Browsers never attach it automatically, so a cross-site form post or image request cannot authenticate as the user. This template adds no CSRF token exchange because the backend contract does not use credential cookies.

If a future backend switches to cookie-based sessions, re-introduce CSRF protection then: `SameSite` cookies plus a token (double-submit or synchronizer) and CORS restrictions. Do not mix that change with the current Bearer flow.

### Request Headers

The Axios client attaches the access token to non-auth requests:

```typescript
config.headers.Authorization = `Bearer ${getAccessToken()}`;
```

Add a CSRF header only when the selected backend requires one.

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
import { getErrorMessage } from "@/libs";

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

- [ ] Accept that localStorage Bearer tokens are XSS-reachable; harden XSS defenses instead of assuming the storage is safe
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
