---
name: security-review
description: "Security review for auth flows, token handling, input validation, and API client changes. Use when: modifying api-client.ts or api-error.ts, changing auth/token logic, adding form inputs or API endpoints, updating CSP headers, touching axios dependency, reviewing .env files for leaked secrets, or when the user mentions security, auth, tokens, XSS, CSRF, or input validation."
disable-model-invocation: false
---

# Security Review

## Review Checklist

### Auth Token Security

- [ ] Token storage uses `tokenStorage` abstraction (localStorage in dev, cookies in prod) — never raw `localStorage` for sensitive data in production
- [ ] Refresh token rotation implemented correctly
- [ ] 401 response clears tokens and redirects to `/login`
- [ ] No tokens logged or exposed in error messages

### Input Validation

- [ ] All user inputs validated with Zod schemas
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] File upload types and sizes validated
- [ ] API response data validated with Zod before use (runtime validation)

### API Client

- [ ] No new Axios instances created — always use centralized `api` client from `@/libs`
- [ ] `X-Request-ID` header present for tracing
- [ ] Timeout configured for all requests
- [ ] axios version remains exactly `1.14.0` — no caret (`^`) or tilde (`~`) added. This is a security pin after the March 2026 supply chain attack (UNC1069). Never upgrade without Tech Lead approval.

### Environment & Secrets

- [ ] No secrets in `VITE_*` variables — all `VITE_*` are exposed to the browser
- [ ] API keys not hardcoded in source
- [ ] `.env.example` updated but contains no real values
- [ ] `.env` is in `.gitignore`

### CSP & Headers

- [ ] Content-Security-Policy headers configured
- [ ] CORS settings restricted to known origins
- [ ] HTTPS enforced in production

## Output

Report only HIGH and MEDIUM confidence findings. For each:

- Severity (High/Medium)
- File and line
- What the vulnerability is
- Specific fix

Skip: theoretical attack vectors with no practical exploit path, style preferences, performance commentary.
