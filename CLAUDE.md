# ClipMonk — Architecture & Implementation Guide

> **This is the "How."** It defines architecture decisions, naming conventions, code patterns, and implementation order. For what to build (data models, API contracts, features), see `PRD.md`. For design tokens, see `DESIGN_SYSTEM.md`. For security rules, see `SECURITY.md`. For testing, see `TESTING.md`. For CI/CD, see `CI_CD.md`. For deployment, see `DEPLOY.md`.

---

## TECH STACK DECISIONS

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server Components reduce client JS. Server Actions eliminate API boilerplate. Route groups organize auth/app/admin/marketing. |
| Language | TypeScript (strict mode) | `"strict": true` in tsconfig. No `any`. No `@ts-ignore` without adjacent comment explaining why. |
| Database | PostgreSQL 16 | JSONB for flexible settings, array types for tags/scopes, full-text search, battle-tested at scale. |
| ORM | Prisma 6 | Type-safe queries generated from schema. Migrations are version-controlled. Schema is the contract (matches PRD.md exactly). |
| Auth | Auth.js v5 (NextAuth.js) | Built for Next.js App Router. Supports JWT + database sessions. Handles OAuth complexity. |
| Payments | Stripe | Industry standard. Hosted checkout + customer portal reduce PCI scope. Webhook-driven state machine. |
| Email | Resend + React Email | React Email = type-safe templates with component reuse. Resend = reliable delivery, good DX. |
| Storage | S3-compatible | Works with AWS S3, Cloudflare R2, or MinIO (self-host). Presigned URLs = no proxy bandwidth. |
| Cache/Queue | Upstash Redis | Serverless Redis. Rate limiting, session cache, background job queue. HTTP-based = works in edge. |
| Video | FFmpeg (fluent-ffmpeg) | Industry standard. Handles every codec. Runs in Docker container. |
| AI | OpenAI + Anthropic + Google SDKs | Multi-provider = no vendor lock-in. Router pattern selects provider by feature/preference. |
| STT | OpenAI Whisper API | Best accuracy across languages. Word-level timestamps for caption sync. |
| Validation | Zod | Runtime + compile-time validation. Integrates with React Hook Form and Server Actions. |
| UI | shadcn/ui + Tailwind CSS + Radix | Copy-paste components = no dependency bloat. Radix = accessible primitives. Tailwind = utility-first, purged in prod. |
| Tables | TanStack Table v8 | Headless = full control over rendering. Server-side pagination, sort, filter built in. |
| Forms | React Hook Form + Zod resolvers | Uncontrolled by default = fewer re-renders. Zod resolver validates on submit/blur. |
| Client state | Zustand | Minimal API, no providers, works with Server Components. |
| Server state | TanStack Query | Cache invalidation, optimistic updates, refetch on focus. |
| Charts | Recharts | React-native, composable, responsive. Good enough for dashboards. |
| Testing | Vitest + Playwright | Vitest = fast unit/integration. Playwright = real browser E2E. See `TESTING.md`. |
| Deploy | Docker + docker-compose | Self-hostable requirement. Multi-stage builds for small images. See `DEPLOY.md`. |

---

## ARCHITECTURE PATTERNS

### Route Groups (App Router)

```
src/app/
├── (marketing)/    # Public pages — no auth required
│                   # layout.tsx: minimal nav + footer, SSR
├── (auth)/         # Login/register/reset — no auth required
│                   # layout.tsx: centered card, no sidebar
├── (app)/          # Authenticated app — session required
│                   # layout.tsx: sidebar + topbar shell
├── admin/          # Admin panel — systemRole check
│                   # layout.tsx: admin sidebar, separate nav
└── api/            # API routes — no layout
```

**Why route groups, not nested layouts?** Each group has a fundamentally different layout. `(marketing)` has a marketing nav. `(auth)` has a centered card. `(app)` has a sidebar. `admin` has an admin sidebar. Route groups keep these separate without layout nesting conflicts.

### Server Components vs Client Components

**Default to Server Components.** Only add `"use client"` when you need:
- Event handlers (onClick, onChange, onSubmit)
- useState, useEffect, useRef
- Browser APIs (localStorage, window)
- Third-party client libraries (Recharts, TanStack Table)

**Pattern: Server Component parent, Client Component child.**
```tsx
// page.tsx (Server Component) — fetches data
export default async function ProjectsPage() {
  const projects = await getProjects(); // Server Action or direct DB
  return <ProjectsList projects={projects} />; // Client component for interactivity
}

// components/projects-list.tsx (Client Component) — handles UI interaction
"use client";
export function ProjectsList({ projects }: { projects: Project[] }) {
  // useState, click handlers, etc.
}
```

### Server Actions Pattern

All mutations go through Server Actions in `src/actions/`. Every action follows this structure:

```typescript
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { checkPermission } from "@/lib/permissions";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const CreateProjectSchema = z.object({
  title: z.string().min(1).max(200),
  sourceUrl: z.string().url().optional(),
});

export async function createProject(input: z.infer<typeof CreateProjectSchema>) {
  // 1. Authenticate
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // 2. Validate
  const data = CreateProjectSchema.parse(input);

  // 3. Authorize (check team permission)
  await checkPermission(session.user.id, session.teamId, "projects.create");

  // 4. Check plan limits
  await checkUsageLimit(session.teamId, "projects");

  // 5. Execute (in transaction if multi-step)
  const project = await db.project.create({
    data: {
      ...data,
      teamId: session.teamId,
      createdById: session.user.id,
    },
  });

  // 6. Side effects
  await auditLog({
    actorId: session.user.id,
    teamId: session.teamId,
    action: "project.create",
    entityType: "Project",
    entityId: project.id,
  });

  // 7. Revalidate
  revalidatePath("/projects");
  return project;
}
```

**Every Server Action must:** authenticate → validate → authorize → check limits → execute → audit → revalidate. No shortcuts.

### Permission Check Pattern

```typescript
// src/lib/permissions.ts

export async function checkPermission(
  userId: string,
  teamId: string,
  permission: string
): Promise<void> {
  // 1. Get user's team membership + role
  const member = await db.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId } },
    include: { role: { include: { permissions: { include: { permission: true } } } } },
  });

  if (!member) throw new ForbiddenError("Not a member of this team");

  // 2. Check if role has permission
  const hasPermission = member.role.permissions.some(
    (rp) => rp.permission.name === permission
  );

  if (!hasPermission) throw new ForbiddenError(`Missing permission: ${permission}`);
}

// Client-side hook
export function usePermissions() {
  // Fetches current user's permissions for active team
  // Returns { can: (permission: string) => boolean, permissions: string[] }
}
```

### Error Handling Pattern

Custom error classes that map to HTTP status codes:

```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super("UNAUTHORIZED", 401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Permission denied") {
    super("FORBIDDEN", 403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super("NOT_FOUND", 404, `${resource} not found`);
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super("RATE_LIMITED", 429, "Too many requests");
  }
}

export class UsageLimitError extends AppError {
  constructor(resource: string, limit: number) {
    super("USAGE_LIMIT", 402, `${resource} limit reached (${limit})`, { resource, limit });
  }
}
```

### State Management Architecture

```
Server state (TanStack Query)     Client state (Zustand)
├── User session                  ├── Active team ID
├── Projects list                 ├── Sidebar collapsed
├── Clips list                    ├── Theme preference
├── Posts list                    ├── Editor state (timeline position, zoom)
├── Analytics data                ├── Compose draft
├── Team members                  └── Notification panel open
└── Social accounts
```

**Rule:** If data comes from the server and may be stale → TanStack Query. If data is UI-only and ephemeral → Zustand.

---

## NAMING CONVENTIONS

### Files & Directories
- **Pages:** `kebab-case` directories, `page.tsx` files (Next.js convention)
- **Components:** `kebab-case.tsx` files, PascalCase exports. `data-table.tsx` exports `DataTable`.
- **Server Actions:** `kebab-case.ts` files in `src/actions/`. One file per domain.
- **Libs:** `kebab-case.ts` in `src/lib/`. One file per concern.
- **Hooks:** `use-kebab-case.ts` in `src/hooks/`.
- **Types:** `kebab-case.ts` in `src/types/`.
- **Validators:** `kebab-case.ts` in `src/validators/`. Matches the action file name.

### Code
- **Variables/functions:** camelCase
- **Types/interfaces:** PascalCase
- **Enums:** PascalCase name, UPPER_SNAKE_CASE values (matches Prisma)
- **Constants:** UPPER_SNAKE_CASE
- **Database tables:** snake_case (via `@@map()` in Prisma)
- **API routes:** kebab-case paths
- **Permissions:** `resource.action` format (e.g., `posts.publish`)
- **Audit actions:** `entity.verb` format (e.g., `user.login`, `post.create`, `admin.user.ban`)
- **Feature flags:** `kebab-case` keys (e.g., `face-tracking`, `ai-captions-v2`)
- **API keys:** `cm_live_` prefix + 32 random chars

### Git
- **Branches:** `feat/description`, `fix/description`, `chore/description`
- **Commits:** Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- **PR titles:** Same as commit convention

---

## DIRECTORY STRUCTURE

```
clipmonk/
├── PRD.md                         # The "What" — data models, API contracts
├── CLAUDE.md                      # The "How" — this file
├── DESIGN_SYSTEM.md               # Design tokens, components
├── TESTING.md                     # Test strategy
├── SECURITY.md                    # Security constraints
├── CI_CD.md                       # Pipeline config
├── DEPLOY.md                      # Deployment spec
├── prisma/
│   ├── schema.prisma              # Database schema (must match PRD.md models)
│   ├── seed.ts                    # Seeds: admin user, plans, roles, permissions
│   └── migrations/                # Version-controlled migrations
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Landing, pricing, blog
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   └── blog/page.tsx
│   │   ├── (auth)/                # Login, register, verify, reset, 2FA, invite
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   ├── two-factor/page.tsx
│   │   │   └── invite/[token]/page.tsx
│   │   ├── (app)/                 # Authenticated application
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── editor/page.tsx
│   │   │   ├── accounts/
│   │   │   │   ├── page.tsx
│   │   │   │   └── connect/[platform]/callback/route.ts
│   │   │   ├── compose/page.tsx
│   │   │   ├── scheduler/page.tsx
│   │   │   ├── ai/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── files/page.tsx
│   │   │   ├── team/
│   │   │   │   ├── page.tsx
│   │   │   │   └── invites/page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       ├── profile/page.tsx
│   │   │       ├── billing/page.tsx
│   │   │       ├── security/page.tsx
│   │   │       ├── api-keys/page.tsx
│   │   │       └── notifications/page.tsx
│   │   ├── admin/                 # Admin panel
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── teams/page.tsx
│   │   │   ├── plans/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── subscriptions/page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   ├── roles/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── permissions/page.tsx
│   │   │   ├── content/
│   │   │   │   ├── posts/page.tsx
│   │   │   │   └── reports/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── email/page.tsx
│   │   │   │   ├── ai/page.tsx
│   │   │   │   ├── storage/page.tsx
│   │   │   │   └── webhooks/page.tsx
│   │   │   ├── audit-log/page.tsx
│   │   │   ├── feature-flags/page.tsx
│   │   │   └── support/
│   │   │       ├── tickets/page.tsx
│   │   │       └── [id]/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── webhooks/
│   │       │   ├── stripe/route.ts
│   │       │   └── social/[platform]/route.ts
│   │       ├── upload/route.ts
│   │       ├── v1/                 # Public API
│   │       │   ├── clips/route.ts
│   │       │   ├── posts/route.ts
│   │       │   └── analytics/route.ts
│   │       └── internal/
│   │           ├── process-video/route.ts
│   │           └── cron/
│   │               ├── publish-scheduled/route.ts
│   │               └── sync-analytics/route.ts
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── auth/                  # Auth-specific UI
│   │   ├── admin/                 # Admin-specific UI
│   │   ├── app/                   # App shell components
│   │   ├── billing/               # Billing UI
│   │   └── shared/                # Reusable across contexts
│   ├── lib/
│   │   ├── auth.ts                # Auth.js config entry
│   │   ├── auth-options.ts        # Providers, callbacks, session
│   │   ├── db.ts                  # Prisma singleton
│   │   ├── stripe.ts              # Stripe client + helpers
│   │   ├── redis.ts               # Upstash Redis client
│   │   ├── s3.ts                  # S3 client + presigned URLs
│   │   ├── email.ts               # Resend client + send helpers
│   │   ├── ai/                    # AI provider clients
│   │   │   ├── openai.ts
│   │   │   ├── anthropic.ts
│   │   │   ├── gemini.ts
│   │   │   └── router.ts          # Provider selection logic
│   │   ├── video/                 # Video processing
│   │   │   ├── processor.ts
│   │   │   ├── transcriber.ts
│   │   │   └── clipper.ts
│   │   ├── social/                # Platform API clients
│   │   │   ├── youtube.ts
│   │   │   ├── tiktok.ts
│   │   │   ├── instagram.ts
│   │   │   ├── facebook.ts
│   │   │   ├── linkedin.ts
│   │   │   ├── twitter.ts
│   │   │   ├── pinterest.ts
│   │   │   └── publisher.ts       # Unified publish interface
│   │   ├── permissions.ts         # RBAC logic + can() helper
│   │   ├── rate-limit.ts          # Redis rate limiter
│   │   ├── audit.ts               # Audit log helper
│   │   ├── api-keys.ts            # Key generation + validation
│   │   ├── errors.ts              # Custom error classes
│   │   └── utils.ts               # General utilities
│   ├── actions/                   # Server Actions (one file per domain)
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── clips.ts
│   │   ├── posts.ts
│   │   ├── accounts.ts
│   │   ├── team.ts
│   │   ├── billing.ts
│   │   ├── files.ts
│   │   ├── ai.ts
│   │   ├── analytics.ts
│   │   ├── admin.ts
│   │   └── settings.ts
│   ├── hooks/                     # Client-side React hooks
│   │   ├── use-current-user.ts
│   │   ├── use-permissions.ts
│   │   ├── use-team.ts
│   │   ├── use-subscription.ts
│   │   └── use-debounce.ts
│   ├── types/                     # Shared TypeScript types
│   │   ├── index.ts
│   │   ├── api.ts
│   │   └── next-auth.d.ts
│   ├── validators/                # Zod schemas (mirror actions/)
│   │   ├── auth.ts
│   │   ├── project.ts
│   │   ├── post.ts
│   │   ├── team.ts
│   │   └── admin.ts
│   └── middleware.ts
├── emails/                        # React Email templates
│   ├── welcome.tsx
│   ├── verify-email.tsx
│   ├── reset-password.tsx
│   ├── team-invite.tsx
│   ├── subscription-created.tsx
│   ├── subscription-cancelled.tsx
│   └── usage-warning.tsx
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── docs/
    ├── API.md
    ├── SELF-HOSTING.md
    └── ARCHITECTURE.md
```

---

## AUTH IMPLEMENTATION

### Auth.js Configuration

```typescript
// src/lib/auth-options.ts
// Session strategy: JWT (for edge middleware compatibility) + database session tracking
// JWT payload: { userId, email, systemRole, activeTeamId }
// Session callback: enrich session with team, role, permissions

providers: [
  CredentialsProvider({...}),     // Email + password
  GoogleProvider({...}),          // OAuth
  GitHubProvider({...}),          // OAuth
  DiscordProvider({...}),         // OAuth
  EmailProvider({...}),           // Magic link via Resend
]
```

### Middleware Chain (`src/middleware.ts`)

Execute in this order:
1. **Security headers** — HSTS, CSP, X-Frame-Options (see SECURITY.md)
2. **Rate limiting** — Redis-based, per-IP for auth routes, per-key for API routes
3. **Auth check** — Verify JWT for `/app/*` and `/admin/*`
4. **Email verification** — Redirect unverified users to `/verify-email`
5. **2FA check** — Redirect to `/two-factor` if required but not completed
6. **Admin check** — Verify systemRole for `/admin/*`
7. **Maintenance mode** — Check SystemSetting, show maintenance page if enabled

### Account Lockout Escalation

| Failed attempts | Action |
|---|---|
| 1-4 | Increment counter |
| 5 | Lock for 15 minutes |
| 10 | Lock for 1 hour |
| 15 | Lock for 24 hours |
| 20+ | Lock indefinitely (admin must unlock) |

---

## BILLING IMPLEMENTATION

### Stripe Integration Pattern

```
User clicks "Upgrade" → Create Stripe Checkout Session → Redirect to Stripe
→ User pays → Stripe redirects to /settings/billing?success=true
→ Webhook: checkout.session.completed → Update team: planId, subscriptionStatus, stripeCustomerId, stripeSubscriptionId
```

**State machine (team.subscriptionStatus):**
```
TRIALING → ACTIVE (payment succeeds)
TRIALING → CANCELED (trial expires, no payment)
ACTIVE → PAST_DUE (payment fails)
ACTIVE → CANCELED (user cancels)
PAST_DUE → ACTIVE (payment succeeds)
PAST_DUE → CANCELED (multiple failures)
```

### Usage Enforcement

Check limits BEFORE the action, not after. Pattern:

```typescript
async function checkUsageLimit(teamId: string, resource: "clips" | "posts" | "ai" | "storage" | "projects") {
  const team = await db.team.findUnique({ where: { id: teamId }, include: { plan: true } });
  const limitMap = {
    clips: { used: team.clipsUsedThisMonth, max: team.plan.maxClipsPerMonth },
    posts: { used: team.postsUsedThisMonth, max: team.plan.maxPostsPerMonth },
    // ...
  };
  const { used, max } = limitMap[resource];
  if (max !== -1 && used >= max) throw new UsageLimitError(resource, max);
}
```

---

## IMPLEMENTATION ORDER

Build in this order. Each phase depends on the previous.

| Phase | What | Depends On | Deliverable |
|---|---|---|---|
| 1 | Project setup | — | package.json, tsconfig, eslint, prettier, env, docker-compose |
| 2 | Database | Phase 1 | Prisma schema, migrations, seed script (admin, plans, roles, permissions) |
| 3 | Auth | Phase 2 | Auth.js config, all auth flows (register, login, verify, reset, 2FA, OAuth, magic link), middleware |
| 4 | RBAC | Phase 3 | permissions.ts, can() helper, usePermissions hook, permission checks in all actions |
| 5 | Billing | Phase 2, 3 | Stripe integration, checkout, webhooks, usage tracking, billing UI |
| 6 | Admin panel | Phase 2, 3, 4 | All 12+ admin pages with real data, full CRUD |
| 7 | Core app wiring | Phase 2, 3, 4, 5 | Connect existing UI to real data (projects, clips, posts, scheduler, analytics) |
| 8 | Social accounts | Phase 7 | OAuth for 7 platforms, token management, publish pipeline |
| 9 | AI integration | Phase 7 | Multi-provider router, content generation, templates |
| 10 | File storage | Phase 2 | S3 presigned URLs, upload component, media library |
| 11 | Email | Phase 3, 5 | All 11+ transactional email templates |
| 12 | Public API | Phase 4 | v1 endpoints, API key auth, rate limiting, documentation |
| 13 | Docker | All | Multi-stage Dockerfile, docker-compose, self-host docs |
| 14 | Tests | All | Unit tests (Vitest), E2E tests (Playwright). See TESTING.md. |

---

## CODE QUALITY RULES

1. **Zero `any` types.** Use `unknown` + type guards if the type is genuinely unknown.
2. **Zero `@ts-ignore`.** If absolutely necessary, use `@ts-expect-error` with a comment explaining the specific issue.
3. **Every `async` function handles errors.** Use try/catch in Server Actions, error boundaries in pages.
4. **Every form has client-side AND server-side validation.** Zod schema shared between validator and action.
5. **Every list has empty state, loading state, and error state.**
6. **Every destructive action has a confirmation dialog** with the entity name typed to confirm.
7. **Every data table has search, sort, filter, pagination.** Server-side for tables > 100 rows.
8. **Optimistic updates** for likes, toggles, and status changes. Rollback on error.
9. **Revalidation** after every mutation. Use `revalidatePath` or `revalidateTag`.
10. **No console.log in production.** Use a structured logger (pino or similar).

---

## ENVIRONMENT VARIABLES

See `.env.example` for the complete list. Groups:

| Group | Vars | Notes |
|---|---|---|
| Database | `DATABASE_URL` | PostgreSQL connection string |
| Auth | `NEXTAUTH_URL`, `NEXTAUTH_SECRET` | Secret via `openssl rand -base64 32` |
| OAuth | `GOOGLE_CLIENT_*`, `GITHUB_CLIENT_*`, `DISCORD_CLIENT_*` | One pair per provider |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Test keys for dev |
| Email | `RESEND_API_KEY`, `EMAIL_FROM` | `ClipMonk <noreply@clipmonk.dev>` |
| Storage | `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` | MinIO for local dev |
| Redis | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Upstash for prod |
| AI | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY` | At least one required |
| Admin | `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used by seed script |
| App | `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME` | Public-facing config |

---

*For the complete data models, API contracts, and feature specs, see `PRD.md`.*
*For design tokens and component specs, see `DESIGN_SYSTEM.md`.*
*For security constraints, see `SECURITY.md`.*
*For testing strategy, see `TESTING.md`.*
*For CI/CD pipeline, see `CI_CD.md`.*
*For deployment, see `DEPLOY.md`.*
