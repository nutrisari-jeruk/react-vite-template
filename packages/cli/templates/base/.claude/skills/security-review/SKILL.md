---
name: security-review
description: Security review for auth flows, token handling, input validation, and API client changes
disable-model-invocation: false
---

# Security Review

## Activation

Invoke this skill when:

- Modifying `src/libs/api-client.ts` or `src/libs/api-error.ts`
- Changing auth logic (login, token refresh, session management)
- Adding new form inputs or API endpoints
- Modifying CSP headers or security config
- Updating axios version (currently pinned to 1.14.0)

## Review Checklist

### Auth Token Security

- [ ] Tokens stored in memory/sessionStorage, NOT localStorage (XSS risk)
- [ ] Refresh token rotation implemented correctly
- [ ] 401 response clears tokens and redirects to `/login`
- [ ] No tokens logged or exposed in error messages

### Input Validation

- [ ] All user inputs validated with Zod schemas
- [ ] SQL/command injection vectors checked
- [ ] File upload types and sizes validated
- [ ] No `dangerouslySetInnerHTML` without sanitization

### API Client

- [ ] No new Axios instances created (use centralized `api` client)
- [ ] `X-Request-ID` header present for tracing
- [ ] Timeout configured for all requests
- [ ] axios version remains exactly `1.14.0` (no caret/tilde added)

### Environment & Secrets

- [ ] No secrets in `VITE_*` variables (they're public)
- [ ] API keys not hardcoded
- [ ] `.env.example` updated but contains no real values

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
