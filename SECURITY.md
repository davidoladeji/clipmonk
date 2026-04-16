# ClipMonk — Security Guardrails

> **Layer 6: Security is a constraint, not a feature.** These rules are declared here and enforced across every file Claude touches. CSP headers, OAuth 2.0, DB encryption — they're not optional line items. They're the guardrails.

---

## PRINCIPLE

Security rules in this file are **non-negotiable**. If an implementation conflicts with a rule here, the implementation is wrong. These constraints take precedence over convenience, performance, or developer experience.

---

## 1. AUTHENTICATION SECURITY

### Password Handling
- **Hashing:** bcrypt with cost factor 12. Never MD5, SHA-256, or plain text.
- **Storage:** Only `passwordHash` stored. Raw password never logged, never stored, never returned in API responses.
- **Strength:** Enforce minimum 8 characters. Use zxcvbn library for real-time strength scoring on client. Reject passwords scoring < 2 (out of 4).
- **Reset tokens:** Cryptographically random, 64 bytes hex. Expire after 1 hour. Single use. Hashed in DB (never store raw token).

### Session Security
- **Cookie flags:** `httpOnly: true`, `secure: true` (production), `sameSite: 'lax'`
- **Session duration:** 24 hours default. 30 days with "Remember Me."
- **Session invalidation:** On password change → revoke ALL other sessions. On 2FA enable/disable → revoke ALL other sessions.
- **Session tracking:** Store IP address + User-Agent per session for audit.

### Account Lockout
- 5 failed attempts → 15 minute lockout
- 10 failed attempts → 1 hour lockout
- 15 failed attempts → 24 hour lockout
- 20+ failed attempts → indefinite lockout (admin must unlock)
- Counter resets on successful login.
- Lockout is per-account, not per-IP (prevents distributed brute force from locking out legitimate users — but rate limiting handles per-IP).

### Two-Factor Authentication
- **Algorithm:** TOTP (RFC 6238), SHA-1, 6 digits, 30-second window
- **Secret storage:** Encrypted at rest (AES-256-GCM with key from env var)
- **Backup codes:** 8 codes, 8 random alphanumeric characters each. Hashed with bcrypt (cost 10). Single-use.
- **Recovery:** If user loses authenticator + backup codes → must contact support → admin manually disables 2FA (audit logged).

### OAuth Security
- **State parameter:** Cryptographically random, verified on callback. Prevents CSRF.
- **Nonce:** Used for OpenID Connect providers (Google).
- **Token storage:** Access and refresh tokens encrypted at rest (AES-256-GCM).
- **Token refresh:** Automatic before expiry. If refresh fails → mark account as EXPIRED, notify user.

---

## 2. AUTHORIZATION SECURITY

### Permission Enforcement
- **Every Server Action** must call `checkPermission()` before any data mutation.
- **Every API route** must verify API key scopes OR session permissions.
- **Every page** must verify access in the server component (not just middleware — defense in depth).
- **Never trust the client** to hide UI elements as a security measure. UI hiding is for UX, not security.

### Admin Impersonation
- Only `SUPER_ADMIN` can impersonate.
- Impersonation creates an audit log entry with: who impersonated, who was impersonated, start time.
- Impersonation session has a visible banner: "You are impersonating [user]. Stop Impersonating."
- Impersonated session cannot: change target user's password, enable/disable 2FA, delete account, access admin panel.
- Auto-expires after 1 hour.

### API Key Security
- **Format:** `cm_live_` + 32 cryptographically random characters
- **Storage:** Only SHA-256 hash stored in DB. Full key shown once on creation — never retrievable again.
- **Scopes:** Keys must declare scopes. Requests outside scope are rejected.
- **Rotation:** Keys can be revoked and regenerated. Old key immediately invalid.
- **Prefix:** First 8 characters stored as `keyPrefix` for identification in logs/UI.

---

## 3. INPUT VALIDATION

### Server-Side Validation (Mandatory)
- **Every** user input validated with Zod on the server. No exceptions.
- Validation happens BEFORE any database query or mutation.
- Failed validation returns structured error (field, message, code) — never raw Zod errors to client.

### Sanitization
- **HTML content:** Sanitize with DOMPurify before rendering user-generated content.
- **SQL injection:** Prisma parameterized queries handle this. Never use raw SQL with string interpolation.
- **XSS:** React escapes by default. Never use `dangerouslySetInnerHTML` with user input.
- **Path traversal:** Validate file names/paths. Strip `../`, null bytes, and special characters.

### File Upload Validation
- **File type:** Validate MIME type server-side (not just extension). Allow list: images (jpg, png, gif, webp), video (mp4, mov, webm), audio (mp3, wav).
- **File size:** Enforce per-plan limits. Max: 5GB absolute.
- **File name:** Sanitize, replace spaces with hyphens, strip special characters.
- **Virus scanning:** (Future) Integrate ClamAV for uploaded files.
- **Presigned URLs:** S3 presigned upload URLs expire after 15 minutes. Scoped to specific key + content type.

---

## 4. HTTP SECURITY HEADERS

Set these in `middleware.ts` and `next.config.ts`:

```typescript
const securityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS protection (legacy, but still set)
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // HSTS (production only)
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // Permissions Policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://*.amazonaws.com https://*.r2.cloudflarestorage.com",
    "connect-src 'self' https://api.stripe.com https://api.openai.com https://api.anthropic.com",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};
```

---

## 5. RATE LIMITING

### Implementation
- **Engine:** Upstash Redis sliding window (`@upstash/ratelimit`)
- **Key:** IP address for public routes. API key hash for API routes. User ID for authenticated routes.

### Limits

| Endpoint | Window | Max Requests | Key |
|---|---|---|---|
| `POST /login` | 1 minute | 10 | IP |
| `POST /register` | 1 minute | 3 | IP |
| `POST /forgot-password` | 1 minute | 3 | IP |
| `POST /magic-link` | 1 minute | 3 | IP |
| `POST /verify-2fa` | 1 minute | 5 | IP + User |
| `/api/v1/*` | 1 minute | 100 | API Key |
| `/api/upload` | 1 minute | 10 | User ID |
| Server Actions (general) | 1 minute | 60 | User ID |
| Admin actions | 1 minute | 30 | User ID |

### Rate Limit Response
```
HTTP 429 Too Many Requests
Retry-After: 42
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1714000000
```

---

## 6. DATA PROTECTION

### Encryption at Rest
| Data | Encryption | Notes |
|---|---|---|
| Passwords | bcrypt (cost 12) | One-way hash |
| 2FA secrets | AES-256-GCM | Symmetric, key from `ENCRYPTION_KEY` env var |
| Backup codes | bcrypt (cost 10) | One-way hash, each code individually |
| OAuth tokens (social) | AES-256-GCM | Access + refresh tokens |
| API keys | SHA-256 | One-way hash, only hash stored |

### Encryption Key Management
- `ENCRYPTION_KEY` env var: 32-byte hex string
- Generated with: `openssl rand -hex 32`
- Rotatable: store key version alongside encrypted data

### Data Deletion
- **Soft delete:** Users are soft-deleted first (`deletedAt` set). Hard-delete after 30 days.
- **Right to erasure:** Provide admin action to hard-delete user + all their data.
- **Cascade:** When team deleted → all projects, clips, posts, files, social accounts deleted.
- **S3 cleanup:** Background job to delete orphaned S3 objects.

---

## 7. AUDIT LOGGING

### What Gets Logged

**Always log these events:**
- User login (success + failure, with IP + User-Agent)
- User logout
- Password change
- Password reset request
- 2FA enable / disable
- Account creation / deletion
- Role assignment change
- Permission change
- Team create / delete / member add / member remove
- Social account connect / disconnect
- Plan change / subscription cancel
- Admin impersonation start / stop
- Admin user ban / suspend / activate
- Admin role create / edit / delete
- Feature flag toggle
- API key create / revoke

### Audit Log Format

```typescript
{
  actorId: string,       // Who did it
  teamId?: string,       // In which team context
  action: string,        // What happened (entity.verb)
  entityType?: string,   // What type of thing
  entityId?: string,     // Which specific thing
  metadata?: {           // Additional context
    before?: object,     // State before change
    after?: object,      // State after change
    reason?: string,     // Why (for bans, etc.)
  },
  ipAddress: string,
  userAgent: string,
  createdAt: DateTime,
}
```

### Retention
- Audit logs retained for 1 year minimum.
- Never delete audit logs when deleting users (anonymize the actorId instead).

---

## 8. ENVIRONMENT SECURITY

### Secret Management
- **Never commit secrets** to git. `.env` is in `.gitignore`.
- **`.env.example`** contains all keys with empty values + comments.
- **Production secrets** managed via platform env vars (Vercel, Docker secrets, etc.), not files.

### Development vs Production
| Concern | Development | Production |
|---|---|---|
| HTTPS | Optional (localhost) | Required (HSTS enforced) |
| Cookie secure | false | true |
| CSP | Report-only mode | Enforce mode |
| Rate limiting | Relaxed (100x) | Strict |
| Error details | Full stack traces | Generic messages |
| Debug logging | Verbose | Errors only |

---

## 9. DEPENDENCY SECURITY

- **Audit:** Run `npm audit` in CI. Fail on critical/high vulnerabilities.
- **Updates:** Dependabot or Renovate for automated dependency updates.
- **Lock file:** Always commit `package-lock.json`. Install with `npm ci` in CI (not `npm install`).
- **Supply chain:** Prefer well-maintained, widely-used packages. Review new dependencies before adding.

---

## 10. STRIPE WEBHOOK SECURITY

- **Signature verification:** Always verify `Stripe-Signature` header using `stripe.webhooks.constructEvent()`.
- **Idempotency:** Handle duplicate webhook deliveries gracefully (check if event already processed).
- **Timing:** Process webhooks asynchronously if they trigger heavy work.
- **Raw body:** Use raw body (not parsed JSON) for signature verification.

---

*These security constraints apply across the entire codebase. For implementation patterns, see `CLAUDE.md`. For what to test, see `TESTING.md`. For CI enforcement, see `CI_CD.md`.*
