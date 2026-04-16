# ClipMonk — Testing Strategy

> **Layer 5: The Safety Net.** Testing is not a phase — it's a layer. Claude generates test scaffolding from the spec BEFORE the code is written. In regulated environments, this is the only way to ship with confidence.

---

## PHILOSOPHY

1. **Tests are written from the PRD, not the implementation.** Read `PRD.md` for what each feature should do. Write tests that verify the contract, not the internals.
2. **Test files live next to the code they test.** No separate `__tests__` directory tree.
3. **Every Server Action gets a test.** Every API route gets a test. Every permission boundary gets a test.
4. **E2E tests cover user flows, not individual components.** One test per flow from `PRD.md` Section 3.

---

## TOOLING

| Tool | Purpose | Config File |
|---|---|---|
| Vitest | Unit + integration tests | `vitest.config.ts` |
| Playwright | E2E browser tests | `playwright.config.ts` |
| MSW (Mock Service Worker) | Mock external APIs (Stripe, social platforms, AI providers) | `src/mocks/` |
| Faker | Generate test data | Used in test factories |
| Prisma (test DB) | Isolated test database | `DATABASE_URL` override in test env |

---

## FILE NAMING CONVENTION

```
src/actions/projects.ts          → src/actions/projects.test.ts
src/lib/permissions.ts           → src/lib/permissions.test.ts
src/app/api/v1/clips/route.ts   → src/app/api/v1/clips/route.test.ts
src/components/auth/login-form.tsx → src/components/auth/login-form.test.tsx
```

E2E tests go in a top-level directory:
```
e2e/
├── auth.spec.ts           # Registration, login, verify, reset, 2FA
├── projects.spec.ts       # Create project, process, edit clips
├── posts.spec.ts          # Compose, schedule, publish
├── admin.spec.ts          # Admin panel CRUD flows
├── billing.spec.ts        # Checkout, upgrade, cancel
├── team.spec.ts           # Invite, role change, remove
└── api.spec.ts            # Public API with API key
```

---

## UNIT & INTEGRATION TESTS (Vitest)

### What to Test

| Domain | What to Assert |
|---|---|
| **Server Actions** | Input validation (Zod rejects bad input), permission checks (unauthorized throws), business logic (correct DB mutations), audit log creation, usage limit enforcement |
| **Permissions** | `checkPermission` grants correct access per role. Owner has all. Viewer has read-only. Custom roles respect matrix. System admins bypass team roles. |
| **Auth** | Password hashing + verification. Account lockout after N failures. Token generation + expiry. 2FA code validation. Session creation/destruction. |
| **Billing** | Usage counters increment correctly. Limits enforced at boundary. Webhook handlers update correct fields. Plan changes are prorated. |
| **API Keys** | Key generation format (`cm_live_...`). Hash stored, not plaintext. Scope enforcement. Rate limiting. Expiry/revocation. |
| **Rate Limiting** | Correct limits per endpoint. Sliding window. IP-based for auth, key-based for API. |
| **Validators** | Every Zod schema rejects invalid input and accepts valid input. Edge cases (empty strings, max lengths, special chars). |
| **AI Router** | Correct provider selected per feature/preference. Fallback on provider error. Token counting. |
| **Social Publisher** | Platform constraints enforced (video length, file size, caption limits from PRD Section 8). |

### Test Structure

```typescript
// src/actions/projects.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { createProject, deleteProject } from "./projects";
import { createTestUser, createTestTeam, assignRole } from "@/test/factories";

describe("createProject", () => {
  let user, team;

  beforeEach(async () => {
    user = await createTestUser();
    team = await createTestTeam(user.id);
    await assignRole(user.id, team.id, "editor");
  });

  it("creates a project with valid input", async () => {
    const project = await createProject({ title: "Test Project" });
    expect(project).toMatchObject({ title: "Test Project", teamId: team.id });
  });

  it("rejects empty title", async () => {
    await expect(createProject({ title: "" })).rejects.toThrow();
  });

  it("rejects if user lacks projects.create permission", async () => {
    await assignRole(user.id, team.id, "viewer");
    await expect(createProject({ title: "Test" })).rejects.toThrow("Permission denied");
  });

  it("rejects when plan limit reached", async () => {
    // Set team to Starter plan (3 projects/month) and use all 3
    await expect(createProject({ title: "4th" })).rejects.toThrow("limit reached");
  });

  it("creates audit log entry", async () => {
    const project = await createProject({ title: "Audited" });
    const log = await db.auditLog.findFirst({ where: { entityId: project.id } });
    expect(log).toMatchObject({ action: "project.create", actorId: user.id });
  });
});
```

### Test Factories

```typescript
// src/test/factories.ts
// Provides helpers to create test entities with sensible defaults:
// createTestUser(overrides?)
// createTestTeam(ownerId, overrides?)
// createTestProject(teamId, userId, overrides?)
// createTestClip(projectId, overrides?)
// createTestPost(teamId, userId, overrides?)
// assignRole(userId, teamId, roleName)
// createTestApiKey(teamId, userId, scopes[])
```

### Database Isolation

Each test file gets a fresh transaction that rolls back after the test:

```typescript
// vitest.setup.ts
import { db } from "@/lib/db";

beforeEach(async () => {
  // Start transaction
});

afterEach(async () => {
  // Rollback transaction — clean slate
});
```

---

## E2E TESTS (Playwright)

### What to Test

One E2E test per user flow from `PRD.md` Section 3:

| Test File | Flow | Key Assertions |
|---|---|---|
| `auth.spec.ts` | 3.1 Registration | Form validates, email sent, can verify, lands on onboarding |
| `auth.spec.ts` | 3.2 Login | Correct credentials → dashboard. Wrong → error. Lockout after 5. |
| `auth.spec.ts` | 3.3 2FA Setup | QR code shown, code validates, backup codes downloadable |
| `auth.spec.ts` | 3.4 Password Reset | Email sent, link works, new password accepted |
| `projects.spec.ts` | 3.5 Video Clipping | URL accepted, progress shown, clips generated, editor works |
| `posts.spec.ts` | 3.6 Post Composition | Editor loads, platforms selectable, AI generates, publishes |
| `posts.spec.ts` | 3.7 Scheduling | Calendar renders, drag-and-drop works, scheduled post appears |
| `admin.spec.ts` | Admin user management | Search, filter, edit, ban, impersonate all functional |
| `admin.spec.ts` | Admin role matrix | Permission toggle updates DB, reflected in user access |
| `billing.spec.ts` | Checkout flow | Stripe redirect, webhook processes, plan active |
| `team.spec.ts` | Team invite flow | Email sent, link works, member appears with correct role |
| `api.spec.ts` | API key usage | Create key, use in request, correct data returned |

### Playwright Config

```typescript
// playwright.config.ts
{
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    storageState: 'e2e/.auth/user.json', // Reuse auth state
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
}
```

### Auth State Reuse

```typescript
// e2e/setup/auth.setup.ts
// Logs in once, saves cookies/session to .auth/user.json
// Subsequent tests reuse this state — no login per test
// Separate setup for admin auth state: .auth/admin.json
```

---

## COVERAGE TARGETS

| Metric | Target | Rationale |
|---|---|---|
| Server Actions | 90%+ | These are the business logic core |
| Permission checks | 100% | Security-critical, every path must be tested |
| Zod validators | 100% | Schema = contract, must be verified |
| Auth flows | 100% (E2E) | Every auth path from PRD Section 3.1-3.4 |
| API routes | 85%+ | Public API is a contract |
| UI components | 60%+ | Focus on interactive components, not layout |
| E2E flows | 100% of PRD Section 3 | Every documented user flow has a test |

---

## RUNNING TESTS

```bash
# Unit + Integration
npm run test              # Vitest (watch mode)
npm run test:ci           # Vitest (single run, coverage)

# E2E
npm run test:e2e          # Playwright (headed)
npm run test:e2e:ci       # Playwright (headless, CI)

# Full suite (used in CI/CD — see CI_CD.md)
npm run test:all          # Vitest + Playwright
```

---

## MOCKING EXTERNAL SERVICES

| Service | Mock Strategy |
|---|---|
| Stripe | MSW intercepting Stripe API calls. Return canned checkout sessions, invoices, webhooks. |
| Social Platform APIs | MSW handlers per platform. Mock publish, analytics fetch, token refresh. |
| OpenAI / Anthropic / Gemini | MSW handlers returning deterministic AI responses for content generation, transcription. |
| Resend (email) | Mock Resend client. Assert emails sent with correct template/data. Don't actually send. |
| S3 | Mock S3 client. Return fake presigned URLs. Track "uploaded" files in memory. |

---

*For what to test against, see `PRD.md`. For how the code should work, see `CLAUDE.md`. For security tests, see `SECURITY.md`.*
