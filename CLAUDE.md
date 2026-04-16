# ClipMonk — Full SaaS Build Specification

> **This is a Claude Code build prompt.** Feed this entire file to Claude Code to transform the existing ClipMonk UI into a production-grade, full-stack SaaS platform.

---

## PROJECT OVERVIEW

ClipMonk is an AI-powered video clipping and social media management platform. It currently has a React/Next.js frontend with complete UI mockups. **Your job is to build the full backend, database, auth, admin panel, billing, API, and all business logic to make this a real, deployable SaaS product.**

The existing codebase is at the repo root. Do NOT delete or break the existing UI — wire it up to real data and APIs.

---

## TECH STACK (Non-Negotiable)

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components, Server Actions) |
| **Language** | TypeScript (strict mode) |
| **Database** | PostgreSQL 16 (via Neon, Supabase, or local) |
| **ORM** | Prisma 6 |
| **Auth** | Auth.js v5 (NextAuth.js) |
| **Payments** | Stripe (subscriptions, checkout, customer portal, webhooks) |
| **Email** | Resend (transactional) + React Email (templates) |
| **File Storage** | S3-compatible (AWS S3, Cloudflare R2, or MinIO) |
| **Cache/Queue** | Upstash Redis (rate limiting, queues, sessions) |
| **Video Processing** | FFmpeg (via fluent-ffmpeg) |
| **AI** | OpenAI SDK, Anthropic SDK, Google Generative AI SDK |
| **Speech-to-Text** | OpenAI Whisper API |
| **Validation** | Zod |
| **UI Components** | shadcn/ui + Tailwind CSS + Radix primitives |
| **Tables** | TanStack Table v8 |
| **Forms** | React Hook Form + Zod resolvers |
| **State** | Zustand (client), TanStack Query (server state) |
| **Charts** | Recharts |
| **Testing** | Vitest + Playwright |
| **Deployment** | Docker + docker-compose (self-hostable) |

---

## DIRECTORY STRUCTURE

Build this exact structure. Every file listed must be created:

```
clipmonk/
├── prisma/
│   ├── schema.prisma              # Full database schema
│   ├── seed.ts                    # Seed script (admin user, plans, permissions)
│   └── migrations/                # Auto-generated
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Public pages (landing, pricing, blog)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Landing page (use existing Hero, Features, etc.)
│   │   │   ├── pricing/page.tsx
│   │   │   └── blog/page.tsx
│   │   ├── (auth)/                # Auth pages
│   │   │   ├── layout.tsx         # Centered card layout
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   ├── two-factor/page.tsx
│   │   │   └── invite/[token]/page.tsx
│   │   ├── (app)/                 # Authenticated app
│   │   │   ├── layout.tsx         # App shell with sidebar
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx       # List projects
│   │   │   │   ├── new/page.tsx   # New project (URL paste / upload)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx   # Project detail
│   │   │   │       └── editor/page.tsx  # Clip editor
│   │   │   ├── accounts/
│   │   │   │   ├── page.tsx       # Connected social accounts
│   │   │   │   └── connect/[platform]/callback/route.ts  # OAuth callbacks
│   │   │   ├── compose/page.tsx   # Post composer
│   │   │   ├── scheduler/page.tsx # Calendar scheduler
│   │   │   ├── ai/page.tsx        # AI Studio
│   │   │   ├── analytics/page.tsx
│   │   │   ├── files/page.tsx     # Media library
│   │   │   ├── team/
│   │   │   │   ├── page.tsx       # Team members
│   │   │   │   └── invites/page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx       # General settings
│   │   │       ├── profile/page.tsx
│   │   │       ├── billing/page.tsx
│   │   │       ├── security/page.tsx
│   │   │       ├── api-keys/page.tsx
│   │   │       └── notifications/page.tsx
│   │   ├── admin/                 # Admin panel (separate layout)
│   │   │   ├── layout.tsx         # Admin layout with admin sidebar
│   │   │   ├── page.tsx           # Admin dashboard (system stats)
│   │   │   ├── users/
│   │   │   │   ├── page.tsx       # User list with search/filter/sort
│   │   │   │   └── [id]/page.tsx  # User detail (edit, impersonate, ban)
│   │   │   ├── teams/page.tsx     # All teams
│   │   │   ├── plans/
│   │   │   │   ├── page.tsx       # Plan management
│   │   │   │   └── [id]/page.tsx  # Edit plan features/limits
│   │   │   ├── subscriptions/page.tsx
│   │   │   ├── payments/page.tsx  # Payment history
│   │   │   ├── roles/
│   │   │   │   ├── page.tsx       # Role management
│   │   │   │   └── [id]/page.tsx  # Edit role permissions
│   │   │   ├── permissions/page.tsx
│   │   │   ├── content/           # Content moderation
│   │   │   │   ├── posts/page.tsx
│   │   │   │   └── reports/page.tsx
│   │   │   ├── analytics/page.tsx # System-wide analytics
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx       # System settings
│   │   │   │   ├── email/page.tsx # Email templates
│   │   │   │   ├── ai/page.tsx    # AI provider config
│   │   │   │   ├── storage/page.tsx
│   │   │   │   └── webhooks/page.tsx
│   │   │   ├── audit-log/page.tsx # Full audit trail
│   │   │   ├── feature-flags/page.tsx
│   │   │   └── support/
│   │   │       ├── tickets/page.tsx
│   │   │       └── [id]/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── webhooks/
│   │       │   ├── stripe/route.ts
│   │       │   └── social/[platform]/route.ts
│   │       ├── upload/route.ts     # Presigned URL generation
│   │       ├── v1/                 # Public API (for API key users)
│   │       │   ├── clips/route.ts
│   │       │   ├── posts/route.ts
│   │       │   └── analytics/route.ts
│   │       └── internal/           # Server-to-server
│   │           ├── process-video/route.ts
│   │           └── cron/
│   │               ├── publish-scheduled/route.ts
│   │               └── sync-analytics/route.ts
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── auth/                  # Auth-specific components
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── social-login-buttons.tsx
│   │   │   ├── two-factor-form.tsx
│   │   │   └── password-strength.tsx
│   │   ├── admin/                 # Admin components
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── data-table.tsx     # Reusable admin table
│   │   │   ├── stats-card.tsx
│   │   │   ├── user-actions.tsx   # Impersonate, ban, edit
│   │   │   └── role-permission-matrix.tsx
│   │   ├── app/                   # App components (wire up existing UI)
│   │   │   ├── sidebar.tsx
│   │   │   ├── top-bar.tsx
│   │   │   └── ... (existing components, refactored)
│   │   ├── billing/
│   │   │   ├── pricing-cards.tsx
│   │   │   ├── subscription-manager.tsx
│   │   │   └── usage-meter.tsx
│   │   └── shared/
│   │       ├── data-table.tsx     # Generic TanStack Table
│   │       ├── file-upload.tsx
│   │       ├── confirm-dialog.tsx
│   │       └── empty-state.tsx
│   ├── lib/
│   │   ├── auth.ts                # Auth.js config
│   │   ├── auth-options.ts        # Providers, callbacks, session strategy
│   │   ├── db.ts                  # Prisma client singleton
│   │   ├── stripe.ts              # Stripe client + helpers
│   │   ├── redis.ts               # Upstash Redis client
│   │   ├── s3.ts                  # S3 client + presigned URLs
│   │   ├── email.ts               # Resend client + send helpers
│   │   ├── ai/
│   │   │   ├── openai.ts
│   │   │   ├── anthropic.ts
│   │   │   ├── gemini.ts
│   │   │   └── router.ts          # AI provider router
│   │   ├── video/
│   │   │   ├── processor.ts       # FFmpeg processing pipeline
│   │   │   ├── transcriber.ts     # Whisper integration
│   │   │   └── clipper.ts         # Clip extraction logic
│   │   ├── social/
│   │   │   ├── youtube.ts
│   │   │   ├── tiktok.ts
│   │   │   ├── instagram.ts
│   │   │   ├── facebook.ts
│   │   │   ├── linkedin.ts
│   │   │   ├── twitter.ts
│   │   │   ├── pinterest.ts
│   │   │   └── publisher.ts       # Unified publish interface
│   │   ├── permissions.ts         # RBAC logic
│   │   ├── rate-limit.ts          # Redis-based rate limiting
│   │   ├── audit.ts               # Audit log helper
│   │   ├── api-keys.ts            # API key generation + validation
│   │   └── utils.ts               # General utilities
│   ├── actions/                   # Server Actions
│   │   ├── auth.ts                # register, login, verify, reset
│   │   ├── projects.ts            # CRUD projects
│   │   ├── clips.ts               # CRUD clips, process video
│   │   ├── posts.ts               # CRUD posts, schedule, publish
│   │   ├── accounts.ts            # Connect/disconnect social accounts
│   │   ├── team.ts                # Invite, remove, change role
│   │   ├── billing.ts             # Subscribe, cancel, change plan
│   │   ├── files.ts               # Upload, delete, organize
│   │   ├── ai.ts                  # Generate content
│   │   ├── analytics.ts           # Fetch analytics
│   │   ├── admin.ts               # Admin-only actions
│   │   └── settings.ts            # User + system settings
│   ├── hooks/
│   │   ├── use-current-user.ts
│   │   ├── use-permissions.ts
│   │   ├── use-team.ts
│   │   ├── use-subscription.ts
│   │   └── use-debounce.ts
│   ├── types/
│   │   ├── index.ts               # Shared types
│   │   ├── api.ts                 # API request/response types
│   │   └── next-auth.d.ts         # Auth.js type extensions
│   ├── validators/                # Zod schemas
│   │   ├── auth.ts
│   │   ├── project.ts
│   │   ├── post.ts
│   │   ├── team.ts
│   │   └── admin.ts
│   └── middleware.ts              # Auth middleware, role checks, rate limiting
├── emails/                        # React Email templates
│   ├── welcome.tsx
│   ├── verify-email.tsx
│   ├── reset-password.tsx
│   ├── team-invite.tsx
│   ├── subscription-created.tsx
│   ├── subscription-cancelled.tsx
│   └── usage-warning.tsx
├── docker-compose.yml             # PostgreSQL + Redis + MinIO + App
├── Dockerfile
├── .env.example                   # All required env vars documented
└── docs/
    ├── API.md                     # Public API documentation
    ├── SELF-HOSTING.md
    └── ARCHITECTURE.md
```

---

## DATABASE SCHEMA (Prisma)

Build this COMPLETE schema in `prisma/schema.prisma`. Every model, every field, every relation:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════════
// AUTH & USERS
// ═══════════════════════════════════════════

model User {
  id                 String    @id @default(cuid())
  email              String    @unique
  emailVerified      DateTime?
  passwordHash       String?
  name               String?
  displayName        String?
  avatarUrl          String?
  bio                String?
  timezone           String    @default("UTC")
  language           String    @default("en")
  
  // Auth
  twoFactorEnabled   Boolean   @default(false)
  twoFactorSecret    String?
  backupCodes        String[]  // Encrypted
  lastLoginAt        DateTime?
  lastLoginIp        String?
  failedLoginAttempts Int      @default(0)
  lockedUntil        DateTime?
  
  // Status
  status             UserStatus @default(ACTIVE)
  bannedAt           DateTime?
  bannedReason       String?
  bannedBy           String?
  deletedAt          DateTime?  // Soft delete
  
  // System role (different from team roles)
  systemRole         SystemRole @default(USER)
  
  // Onboarding
  onboardingCompleted Boolean  @default(false)
  onboardingStep     Int       @default(0)
  
  // Relations
  accounts           Account[]
  sessions           Session[]
  teamMemberships    TeamMember[]
  ownedTeams         Team[]           @relation("TeamOwner")
  apiKeys            ApiKey[]
  auditLogs          AuditLog[]       @relation("AuditActor")
  notifications      Notification[]
  
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  @@index([email])
  @@index([status])
  @@index([systemRole])
  @@map("users")
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BANNED
  SUSPENDED
  PENDING_VERIFICATION
  DELETED
}

enum SystemRole {
  USER
  MODERATOR
  ADMIN
  SUPER_ADMIN
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  ipAddress    String?
  userAgent    String?
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  type       TokenType @default(EMAIL_VERIFICATION)

  @@unique([identifier, token])
  @@map("verification_tokens")
}

enum TokenType {
  EMAIL_VERIFICATION
  PASSWORD_RESET
  TEAM_INVITE
  TWO_FACTOR
  API_KEY
}

// ═══════════════════════════════════════════
// TEAMS & RBAC
// ═══════════════════════════════════════════

model Team {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  avatarUrl   String?
  description String?
  
  // Owner
  ownerId     String
  owner       User     @relation("TeamOwner", fields: [ownerId], references: [id])
  
  // Billing (each team has its own subscription)
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  planId               String?
  plan                 Plan?     @relation(fields: [planId], references: [id])
  subscriptionStatus   SubscriptionStatus @default(TRIALING)
  trialEndsAt          DateTime?
  currentPeriodEnd     DateTime?
  
  // Usage tracking
  clipsUsedThisMonth     Int     @default(0)
  postsUsedThisMonth     Int     @default(0)
  aiCreditsUsedThisMonth Int     @default(0)
  storageUsedBytes       BigInt  @default(0)
  
  // Settings
  settings    Json      @default("{}")  // Team-level settings
  
  // Relations
  members     TeamMember[]
  invites     TeamInvite[]
  projects    Project[]
  socialAccounts SocialAccount[]
  posts       Post[]
  files       File[]
  apiKeys     ApiKey[]
  auditLogs   AuditLog[]
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([slug])
  @@index([ownerId])
  @@map("teams")
}

enum SubscriptionStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
  INCOMPLETE
}

model TeamMember {
  id       String   @id @default(cuid())
  teamId   String
  userId   String
  roleId   String
  
  team     Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role     Role     @relation(fields: [roleId], references: [id])
  
  joinedAt DateTime @default(now())

  @@unique([teamId, userId])
  @@map("team_members")
}

model TeamInvite {
  id        String   @id @default(cuid())
  teamId    String
  email     String
  roleId    String
  token     String   @unique @default(cuid())
  expiresAt DateTime
  invitedBy String
  
  team      Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  role      Role     @relation(fields: [roleId], references: [id])
  
  createdAt DateTime @default(now())

  @@unique([teamId, email])
  @@map("team_invites")
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique   // "owner", "admin", "editor", "publisher", "viewer", "custom_*"
  displayName String
  description String?
  isSystem    Boolean  @default(false) // System roles can't be deleted
  color       String?  // For UI display
  
  permissions RolePermission[]
  members     TeamMember[]
  invites     TeamInvite[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("roles")
}

model Permission {
  id          String   @id @default(cuid())
  name        String   @unique  // e.g., "projects.create", "posts.publish", "team.manage"
  displayName String
  description String?
  group       String   // e.g., "projects", "posts", "team", "billing", "admin"
  
  roles       RolePermission[]
  
  @@index([group])
  @@map("permissions")
}

model RolePermission {
  roleId       String
  permissionId String
  
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
  @@map("role_permissions")
}

// ═══════════════════════════════════════════
// PLANS & BILLING
// ═══════════════════════════════════════════

model Plan {
  id                    String   @id @default(cuid())
  name                  String
  slug                  String   @unique
  description           String?
  
  // Stripe
  stripePriceIdMonthly  String?  @unique
  stripePriceIdYearly   String?  @unique
  stripeProductId       String?  @unique
  
  // Pricing
  priceMonthly          Int      @default(0)  // In cents
  priceYearly           Int      @default(0)
  
  // Limits (-1 = unlimited)
  maxClipsPerMonth      Int      @default(5)
  maxPostsPerMonth      Int      @default(50)
  maxAiCreditsPerMonth  Int      @default(100)
  maxTeamMembers        Int      @default(1)
  maxSocialAccounts     Int      @default(1)
  maxStorageBytes       BigInt   @default(1073741824) // 1GB
  maxProjectsPerMonth   Int      @default(3)
  maxExportResolution   String   @default("720p") // "720p", "1080p", "4k"
  
  // Feature flags
  features              Json     @default("{}") // { "faceTracking": true, "aiCaptions": true, etc. }
  
  // Display
  isPublic              Boolean  @default(true)
  isFeatured            Boolean  @default(false)
  sortOrder             Int      @default(0)
  
  // Relations
  teams                 Team[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@map("plans")
}

model PaymentHistory {
  id              String   @id @default(cuid())
  teamId          String
  stripeInvoiceId String?  @unique
  stripePaymentId String?
  amount          Int      // In cents
  currency        String   @default("usd")
  status          PaymentStatus
  description     String?
  receiptUrl      String?
  invoicePdfUrl   String?
  
  createdAt       DateTime @default(now())

  @@index([teamId])
  @@map("payment_history")
}

enum PaymentStatus {
  SUCCEEDED
  PENDING
  FAILED
  REFUNDED
}

// ═══════════════════════════════════════════
// PROJECTS & CLIPS
// ═══════════════════════════════════════════

model Project {
  id            String   @id @default(cuid())
  teamId        String
  createdById   String
  
  title         String
  description   String?
  sourceUrl     String?  // YouTube URL, Twitch URL, etc.
  sourceType    SourceType @default(UPLOAD)
  
  // Video file
  originalFileUrl  String?
  originalFileName String?
  originalDuration Int?     // Seconds
  thumbnailUrl     String?
  
  // Processing
  status          ProjectStatus @default(PENDING)
  processingError String?
  transcription   Json?    // Full transcript with timestamps
  
  // Settings used for this project
  settings        Json     @default("{}")  // { aspectRatio, clipDuration, language, etc. }
  
  // Relations
  team            Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  clips           Clip[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([teamId])
  @@index([status])
  @@map("projects")
}

enum SourceType {
  YOUTUBE
  TWITCH
  VIMEO
  UPLOAD
  URL
}

enum ProjectStatus {
  PENDING
  DOWNLOADING
  TRANSCRIBING
  ANALYZING
  GENERATING_CLIPS
  READY
  FAILED
}

model Clip {
  id            String   @id @default(cuid())
  projectId     String
  
  title         String
  startTime     Float    // Seconds
  endTime       Float
  duration      Float
  
  // AI analysis
  viralityScore Int      @default(0) // 0-100
  tags          String[]
  aiReasoning   String?  // Why AI chose this moment
  
  // Generated files
  videoUrl      String?
  thumbnailUrl  String?
  aspectRatio   String   @default("9:16")
  resolution    String   @default("1080p")
  
  // Captions
  captions      Json?    // SRT-like structure with timestamps
  captionStyle  String   @default("bold")
  captionLanguage String @default("en")
  
  // Features
  faceTrackingEnabled Boolean @default(true)
  hookTitle     String?
  ctaText       String?
  
  // Status
  status        ClipStatus @default(DRAFT)
  exportedAt    DateTime?
  
  // Relations
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  posts         PostClip[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([projectId])
  @@index([viralityScore])
  @@map("clips")
}

enum ClipStatus {
  DRAFT
  PROCESSING
  READY
  EXPORTED
  PUBLISHED
  FAILED
}

// ═══════════════════════════════════════════
// SOCIAL ACCOUNTS & POSTS
// ═══════════════════════════════════════════

model SocialAccount {
  id              String   @id @default(cuid())
  teamId          String
  platform        SocialPlatform
  
  // Account info
  platformUserId  String
  username        String?
  displayName     String?
  avatarUrl       String?
  profileUrl      String?
  followerCount   Int      @default(0)
  
  // OAuth tokens (encrypted)
  accessToken     String
  refreshToken    String?
  tokenExpiresAt  DateTime?
  scopes          String[]
  
  // Status
  status          AccountStatus @default(ACTIVE)
  lastSyncedAt    DateTime?
  errorMessage    String?
  
  // Relations
  team            Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  posts           PostAccount[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([teamId, platform, platformUserId])
  @@index([teamId])
  @@map("social_accounts")
}

enum SocialPlatform {
  YOUTUBE
  TIKTOK
  INSTAGRAM
  FACEBOOK
  LINKEDIN
  TWITTER
  PINTEREST
}

enum AccountStatus {
  ACTIVE
  EXPIRED
  ERROR
  DISCONNECTED
}

model Post {
  id              String   @id @default(cuid())
  teamId          String
  createdById     String
  
  // Content
  content         String
  title           String?
  hashtags        String[]
  mentions        String[]
  linkUrl         String?
  
  // Media
  mediaUrls       String[]
  thumbnailUrl    String?
  
  // Scheduling
  status          PostStatus @default(DRAFT)
  scheduledAt     DateTime?
  publishedAt     DateTime?
  
  // AI metadata
  aiGenerated     Boolean  @default(false)
  aiProvider      String?
  aiPrompt        String?
  
  // Campaign
  campaignId      String?
  campaign        Campaign? @relation(fields: [campaignId], references: [id])
  
  // Relations
  team            Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  accounts        PostAccount[]
  clips           PostClip[]
  analytics       PostAnalytics[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([teamId])
  @@index([status])
  @@index([scheduledAt])
  @@map("posts")
}

enum PostStatus {
  DRAFT
  SCHEDULED
  PUBLISHING
  PUBLISHED
  FAILED
  CANCELLED
}

model PostAccount {
  id              String   @id @default(cuid())
  postId          String
  socialAccountId String
  
  // Per-platform status
  status          PostStatus @default(DRAFT)
  platformPostId  String?   // ID on the platform after publishing
  platformUrl     String?   // URL on the platform
  errorMessage    String?
  publishedAt     DateTime?
  
  post            Post          @relation(fields: [postId], references: [id], onDelete: Cascade)
  socialAccount   SocialAccount @relation(fields: [socialAccountId], references: [id], onDelete: Cascade)

  @@unique([postId, socialAccountId])
  @@map("post_accounts")
}

model PostClip {
  postId String
  clipId String
  
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  clip   Clip @relation(fields: [clipId], references: [id], onDelete: Cascade)

  @@id([postId, clipId])
  @@map("post_clips")
}

model PostAnalytics {
  id              String   @id @default(cuid())
  postId          String
  platform        SocialPlatform
  
  views           Int      @default(0)
  likes           Int      @default(0)
  comments        Int      @default(0)
  shares          Int      @default(0)
  saves           Int      @default(0)
  clicks          Int      @default(0)
  impressions     Int      @default(0)
  reach           Int      @default(0)
  engagementRate  Float    @default(0)
  
  fetchedAt       DateTime @default(now())
  
  post            Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@index([postId, platform])
  @@map("post_analytics")
}

model Campaign {
  id          String   @id @default(cuid())
  teamId      String
  name        String
  description String?
  color       String?
  startDate   DateTime?
  endDate     DateTime?
  
  posts       Post[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("campaigns")
}

// ═══════════════════════════════════════════
// FILES & STORAGE
// ═══════════════════════════════════════════

model File {
  id          String   @id @default(cuid())
  teamId      String
  uploadedById String
  
  name        String
  key         String   @unique  // S3 key
  url         String
  size        BigInt
  mimeType    String
  folderId    String?
  
  // Metadata
  width       Int?
  height      Int?
  duration    Int?     // For video/audio
  
  team        Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  folder      FileFolder? @relation(fields: [folderId], references: [id])
  
  createdAt   DateTime @default(now())

  @@index([teamId])
  @@index([folderId])
  @@map("files")
}

model FileFolder {
  id        String   @id @default(cuid())
  teamId    String
  name      String
  parentId  String?
  
  parent    FileFolder?  @relation("FolderTree", fields: [parentId], references: [id])
  children  FileFolder[] @relation("FolderTree")
  files     File[]
  
  createdAt DateTime @default(now())

  @@unique([teamId, name, parentId])
  @@map("file_folders")
}

// ═══════════════════════════════════════════
// AI & CONTENT GENERATION
// ═══════════════════════════════════════════

model AiTemplate {
  id          String   @id @default(cuid())
  name        String
  description String?
  category    String   // "hooks", "captions", "descriptions", "ads", "planning"
  prompt      String   // Template with {{variables}}
  variables   Json     @default("[]") // [{ name, type, description }]
  provider    String   @default("openai")
  model       String   @default("gpt-4o")
  isSystem    Boolean  @default(false)
  isPublic    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("ai_templates")
}

model AiUsage {
  id          String   @id @default(cuid())
  teamId      String
  userId      String
  provider    String
  model       String
  feature     String   // "clip_analysis", "caption_gen", "content_gen", "translation"
  inputTokens  Int     @default(0)
  outputTokens Int     @default(0)
  cost         Float   @default(0) // Estimated cost in USD
  
  createdAt   DateTime @default(now())

  @@index([teamId, createdAt])
  @@map("ai_usage")
}

// ═══════════════════════════════════════════
// API KEYS
// ═══════════════════════════════════════════

model ApiKey {
  id          String   @id @default(cuid())
  teamId      String
  userId      String
  
  name        String
  keyHash     String   @unique // SHA-256 hash of the key (never store raw)
  keyPrefix   String   // First 8 chars for identification
  scopes      String[] // ["clips.read", "posts.write", etc.]
  
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  revokedAt   DateTime?
  
  team        Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id])
  
  createdAt   DateTime @default(now())

  @@index([keyHash])
  @@map("api_keys")
}

// ═══════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════

model Notification {
  id        String   @id @default(cuid())
  userId    String
  
  type      String   // "post_published", "clip_ready", "team_invite", "billing_warning", etc.
  title     String
  body      String?
  data      Json?    // Additional data (link, entityId, etc.)
  readAt    DateTime?
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())

  @@index([userId, readAt])
  @@map("notifications")
}

// ═══════════════════════════════════════════
// AUDIT LOG
// ═══════════════════════════════════════════

model AuditLog {
  id          String   @id @default(cuid())
  teamId      String?
  actorId     String
  
  action      String   // "user.login", "post.create", "team.member.invite", "admin.user.ban"
  entityType  String?  // "User", "Post", "Team", etc.
  entityId    String?
  metadata    Json?    // Before/after values, IP, user agent, etc.
  ipAddress   String?
  userAgent   String?
  
  actor       User     @relation("AuditActor", fields: [actorId], references: [id])
  team        Team?    @relation(fields: [teamId], references: [id])
  
  createdAt   DateTime @default(now())

  @@index([teamId, createdAt])
  @@index([actorId])
  @@index([action])
  @@index([entityType, entityId])
  @@map("audit_logs")
}

// ═══════════════════════════════════════════
// SUPPORT TICKETS
// ═══════════════════════════════════════════

model SupportTicket {
  id          String   @id @default(cuid())
  userId      String
  teamId      String?
  
  subject     String
  category    String   // "billing", "bug", "feature", "account", "other"
  priority    TicketPriority @default(NORMAL)
  status      TicketStatus   @default(OPEN)
  
  messages    SupportMessage[]
  
  closedAt    DateTime?
  closedBy    String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([status])
  @@map("support_tickets")
}

model SupportMessage {
  id        String   @id @default(cuid())
  ticketId  String
  authorId  String
  isStaff   Boolean  @default(false)
  body      String
  
  ticket    SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())

  @@map("support_messages")
}

enum TicketPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  WAITING_ON_CUSTOMER
  RESOLVED
  CLOSED
}

// ═══════════════════════════════════════════
// FEATURE FLAGS
// ═══════════════════════════════════════════

model FeatureFlag {
  id          String   @id @default(cuid())
  key         String   @unique
  name        String
  description String?
  enabled     Boolean  @default(false)
  
  // Targeting
  enabledForAll   Boolean @default(false)
  enabledForPlans String[] // Plan slugs
  enabledForUsers String[] // User IDs
  enabledForTeams String[] // Team IDs
  percentage      Int?     // Gradual rollout %
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("feature_flags")
}

// ═══════════════════════════════════════════
// SYSTEM SETTINGS
// ═══════════════════════════════════════════

model SystemSetting {
  key       String   @id
  value     Json
  updatedAt DateTime @updatedAt

  @@map("system_settings")
}
```

---

## AUTHENTICATION SYSTEM

Build a complete auth system with ALL of these features:

### Auth Flows
1. **Email + Password Registration** with password strength meter (zxcvbn), confirm password
2. **Email Verification** — must verify before accessing app. Resend link option.
3. **Login** with email/password + remember me (30-day persistent session)
4. **Social OAuth Login** — Google, GitHub, Discord (via Auth.js providers)
5. **Magic Link Login** — passwordless option via email
6. **Forgot Password** → email with secure reset link (1hr expiry)
7. **Two-Factor Authentication (2FA)** — TOTP via authenticator app (Google Auth, Authy)
   - Setup flow with QR code generation
   - Backup codes (8 codes, downloadable)
   - 2FA challenge on login
   - 2FA required option per-team (enforceable by admin)
8. **Team Invites** — invite link via email, auto-join team on signup/login
9. **Account Linking** — link multiple OAuth providers to one account
10. **Session Management** — view active sessions, revoke individual sessions
11. **Account Lockout** — 5 failed attempts → 15min lockout, escalating

### Auth Security
- CSRF protection on all forms
- Bcrypt password hashing (cost factor 12)
- Secure session cookies (httpOnly, secure, sameSite)
- Rate limiting on auth endpoints (10 req/min for login, 3 req/min for registration)
- IP-based suspicious login detection (notify user of new device/location)
- Audit log every auth event (login, logout, password change, 2FA enable/disable)

### Auth UI
- Beautiful auth pages matching the dark ClipMonk design
- Password strength indicator (real-time, color-coded bar)
- Social login buttons with proper platform branding
- Loading states on all auth buttons
- Inline validation (email format, password requirements)
- Success/error toast notifications
- Redirect to intended page after login

### Middleware (`src/middleware.ts`)
```
- Check auth on ALL /app/* and /admin/* routes
- Redirect unauthenticated users to /login
- Redirect unverified users to /verify-email
- Check 2FA requirement (redirect to /two-factor if needed)
- Check system role for /admin/* (must be ADMIN or SUPER_ADMIN)
- Rate limit API routes
- Set security headers (HSTS, CSP, X-Frame-Options)
```

---

## ADMIN PANEL (CRITICAL — BUILD THIS FULLY)

The admin panel is at `/admin/*` and is ONLY accessible to users with `systemRole` of `ADMIN` or `SUPER_ADMIN`. It must be a complete system management interface.

### Admin Dashboard (`/admin`)
- Total users (with growth chart)
- Total teams, active subscriptions
- MRR (Monthly Recurring Revenue) from Stripe
- New signups today / this week / this month
- Active users (DAU/MAU)
- System health indicators (DB connections, queue depth, storage usage)
- Recent activity feed (last 50 audit log entries)
- Quick actions (create user, create plan, toggle feature flag)

### User Management (`/admin/users`)
- **Data Table** with columns: Avatar, Name, Email, System Role, Status, Plan, Created, Last Login
- **Search** by name, email
- **Filters**: by status (active, banned, suspended), by role, by plan, by date range
- **Sort**: by any column
- **Bulk actions**: ban, suspend, activate, delete, change role
- **User Detail Page** (`/admin/users/[id]`):
  - Full profile info (editable)
  - System role selector (USER, MODERATOR, ADMIN, SUPER_ADMIN)
  - Status management (activate, suspend, ban with reason)
  - **Impersonate User** button — admin can sign in AS the user to debug issues (creates audit log entry, shows banner "You are impersonating [user]", with "Stop Impersonating" button)
  - Team memberships list
  - Subscription & billing info
  - API keys list
  - Login history (last 20 logins with IP, user agent, timestamp)
  - Audit log (all actions by this user)
  - Danger zone: delete account, force password reset, revoke all sessions

### Role Management (`/admin/roles`)
- List all roles with member count
- **Create Custom Role**: name, description, color picker
- **Permission Matrix**: visual grid of all permissions grouped by module
  - Rows = permissions (grouped: Projects, Clips, Posts, Accounts, Team, Billing, Files, AI, Analytics, Admin)
  - Columns = roles
  - Checkboxes to toggle each permission per role
  - Drag-and-drop role reordering
- **System roles** (owner, admin, editor, publisher, viewer) are locked from deletion but permissions can be edited by SUPER_ADMIN

### Permission Groups
Build these permission groups and individual permissions:

```
projects.*       → create, read, update, delete
clips.*          → create, read, update, delete, export, process
posts.*          → create, read, update, delete, publish, schedule
accounts.*       → connect, disconnect, read
team.*           → read, invite, remove, change_role, manage_settings
billing.*        → read, manage, cancel
files.*          → upload, read, delete, manage_folders
ai.*             → generate, read_templates, manage_templates
analytics.*      → read, export
settings.*       → read, update
admin.*          → access, manage_users, manage_roles, manage_plans, manage_billing, 
                    manage_content, manage_settings, view_audit_log, impersonate, 
                    manage_feature_flags, manage_support
```

### Plan Management (`/admin/plans`)
- List all plans with subscriber count, MRR contribution
- **Create/Edit Plan**: 
  - Name, description, slug
  - Monthly and yearly pricing
  - All limits (clips, posts, AI credits, team members, social accounts, storage, projects, export resolution)
  - Feature flags (JSON editor for which features are enabled)
  - Stripe product/price sync (create in Stripe when saving)
  - Public/Private toggle, Featured badge toggle
  - Sort order

### Subscription Management (`/admin/subscriptions`)
- All active subscriptions with team name, plan, status, MRR, next billing date
- Filter by plan, status
- Cancel/refund individual subscriptions
- Change plan for a team
- Apply coupon/discount

### Payment History (`/admin/payments`)
- All payments with date, team, amount, status, invoice link
- Filters by date range, status, amount range
- Export to CSV
- Refund action

### Audit Log (`/admin/audit-log`)
- Full searchable, filterable audit trail
- Columns: Timestamp, Actor, Action, Entity, IP Address, Details
- Filter by action type, actor, date range, team
- Detail modal showing full before/after JSON diff
- Export to CSV

### Feature Flags (`/admin/feature-flags`)
- List all flags with current state
- Toggle on/off
- Targeting: enable for specific plans, users, teams, or percentage rollout
- Create new flag with key, name, description

### Content Moderation (`/admin/content`)
- Review reported posts
- View/delete any post or clip
- User-reported content queue

### System Settings (`/admin/settings`)
- **General**: App name, logo URL, support email, default timezone
- **Email**: SMTP/Resend config, test email button
- **AI Providers**: API keys for OpenAI, Anthropic, Google. Default models. Rate limits.
- **Storage**: S3 bucket config, max file sizes, allowed file types
- **Webhooks**: List registered webhooks, test endpoint
- **Maintenance Mode**: toggle with custom message

### Support Tickets (`/admin/support`)
- All tickets with priority, status, category
- Assign to admin staff
- Reply to tickets
- Close/reopen
- Priority escalation

---

## RBAC (Role-Based Access Control) IMPLEMENTATION

### How Permissions Work

1. Every authenticated action checks permissions via `src/lib/permissions.ts`
2. Permission check flow:
   ```
   User → TeamMember → Role → RolePermission → Permission
   ```
3. System roles (ADMIN, SUPER_ADMIN) bypass team-level permissions for admin panel
4. Implement a `can()` helper function:
   ```typescript
   // Server-side
   const can = await checkPermission(userId, teamId, "posts.publish");
   if (!can) throw new ForbiddenError();
   
   // Client-side hook
   const { can } = usePermissions();
   if (can("posts.publish")) { /* show publish button */ }
   ```
5. Server Actions must ALWAYS check permissions before executing
6. API routes must ALWAYS check permissions (via API key scopes OR session)
7. UI must hide/disable elements the user doesn't have permission for

### Seed Data

The seed script (`prisma/seed.ts`) must create:

1. **System Roles** with default permissions:
   - `owner`: ALL permissions
   - `admin`: All except billing.cancel, team.manage_settings ownership transfer
   - `editor`: projects.*, clips.*, posts.create/read/update, files.*, ai.generate
   - `publisher`: posts.*, accounts.read, analytics.read
   - `viewer`: *.read, analytics.read

2. **Plans**:
   - Starter (Free): 5 clips, 50 posts, 100 AI credits, 1 member, 1 account, 1GB, 720p
   - Pro ($19/mo, $190/yr): unlimited clips, unlimited posts, 1000 AI credits, 5 members, 5 accounts, 25GB, 1080p
   - Business ($49/mo, $490/yr): unlimited clips, unlimited posts, 5000 AI credits, 15 members, unlimited accounts, 100GB, 4K
   - Enterprise (custom): all unlimited, custom pricing

3. **All Permissions** (every permission listed above)

4. **Default Super Admin** user (from env vars: `ADMIN_EMAIL`, `ADMIN_PASSWORD`)

---

## STRIPE BILLING INTEGRATION

### Implementation Requirements
1. **Checkout**: Redirect to Stripe Checkout for new subscriptions
2. **Customer Portal**: Use Stripe's hosted portal for subscription management
3. **Webhook Handler** (`/api/webhooks/stripe`): Handle ALL these events:
   - `checkout.session.completed` → activate subscription
   - `invoice.payment_succeeded` → update payment history
   - `invoice.payment_failed` → mark past_due, send warning email
   - `customer.subscription.updated` → sync plan changes
   - `customer.subscription.deleted` → cancel subscription
   - `customer.subscription.trial_will_end` → send trial ending email
4. **Usage Tracking**: Enforce plan limits on every action (clips, posts, AI, storage, team members)
5. **Upgrade/Downgrade**: Prorate automatically via Stripe
6. **Trial Period**: 14-day free trial on Pro plan
7. **Billing Page** (`/settings/billing`):
   - Current plan with usage meters (clips used/limit, posts used/limit, etc.)
   - Upgrade/downgrade buttons
   - Payment method display
   - Invoice history with PDF download links
   - Cancel subscription with confirmation dialog

---

## API KEYS & PUBLIC API

1. Users can generate API keys in `/settings/api-keys`
2. Keys are generated as `cm_live_xxxxxxxxxxxxxxxxxxxx` format
3. Only the hash is stored in DB. Full key shown once on creation.
4. Keys have configurable scopes (read, write per resource)
5. Public API endpoints at `/api/v1/*`:
   - `POST /api/v1/clips` — Create clip from URL
   - `GET /api/v1/clips` — List clips
   - `GET /api/v1/clips/:id` — Get clip
   - `POST /api/v1/posts` — Create and schedule post
   - `GET /api/v1/analytics` — Get analytics
6. API key auth via `Authorization: Bearer cm_live_xxx` header
7. Rate limiting: 100 req/min per key
8. Return proper REST responses with pagination, filtering, error codes

---

## EMAIL SYSTEM

Use Resend + React Email templates for ALL transactional emails:

1. **Welcome** — after registration
2. **Verify Email** — verification link
3. **Reset Password** — reset link
4. **Team Invite** — invite link with team name and inviter
5. **Subscription Created** — plan details and getting started link
6. **Subscription Cancelled** — confirmation with data retention info
7. **Payment Failed** — warning with update payment link
8. **Usage Warning** — when hitting 80% and 100% of plan limits
9. **New Login from Unknown Device** — security notification
10. **Clip Ready** — when video processing completes
11. **Scheduled Post Published** — confirmation with platform links

All emails must be beautifully designed, mobile-responsive, and match ClipMonk branding.

---

## ENVIRONMENT VARIABLES

Create `.env.example` with ALL required vars:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/clipmonk"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Email
RESEND_API_KEY=""
EMAIL_FROM="ClipMonk <noreply@clipmonk.dev>"

# Storage (S3-compatible)
S3_ENDPOINT=""
S3_REGION=""
S3_BUCKET=""
S3_ACCESS_KEY=""
S3_SECRET_KEY=""

# Redis
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# AI Providers
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GOOGLE_AI_API_KEY=""

# Admin
ADMIN_EMAIL="admin@clipmonk.dev"
ADMIN_PASSWORD="change-this-immediately"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="ClipMonk"
```

---

## DOCKER SETUP

Create `docker-compose.yml` with:
- **app**: Next.js app (builds from Dockerfile)
- **db**: PostgreSQL 16
- **redis**: Redis 7
- **minio**: MinIO (S3-compatible storage for self-hosting)

Create `Dockerfile` with multi-stage build:
- Stage 1: Install deps
- Stage 2: Build
- Stage 3: Production image (minimal)

---

## IMPLEMENTATION ORDER

Build in this exact order to avoid circular dependencies:

1. **Database**: Prisma schema, migrations, seed script
2. **Auth**: Auth.js config, login/register/verify/reset/2FA flows, middleware
3. **RBAC**: Permissions, roles, can() helpers, permission checks
4. **Billing**: Stripe integration, plans, checkout, webhooks, usage tracking
5. **Admin Panel**: All admin pages with full CRUD
6. **Core App**: Wire up existing UI to real data (projects, clips, posts, scheduler, analytics)
7. **Social Accounts**: OAuth connections for each platform
8. **AI Integration**: Multi-provider AI content generation
9. **File Storage**: S3 upload/download, media library
10. **Email**: All transactional email templates
11. **API**: Public API with key auth
12. **Docker**: Containerization for deployment
13. **Tests**: Vitest unit tests + Playwright E2E tests

---

## CRITICAL RULES

1. **NEVER** store passwords in plain text. Always bcrypt.
2. **NEVER** store API keys or tokens in plain text. Always hash or encrypt.
3. **NEVER** trust client input. Validate EVERYTHING with Zod on the server.
4. **NEVER** skip permission checks. Every Server Action and API route must verify access.
5. **ALWAYS** create audit log entries for sensitive actions.
6. **ALWAYS** handle errors gracefully with user-friendly messages.
7. **ALWAYS** implement proper loading and error states in the UI.
8. **ALWAYS** use database transactions for multi-step operations.
9. **ALWAYS** rate limit all API endpoints.
10. **ALWAYS** sanitize user-generated content before rendering.

---

## QUALITY EXPECTATIONS

- Zero TypeScript errors
- Zero ESLint warnings
- All forms have proper validation with clear error messages
- All async operations have loading states
- All destructive actions have confirmation dialogs
- All tables have search, sort, filter, pagination
- All admin pages are fully functional, not mock data
- Mobile-responsive admin panel
- Proper error boundaries on every page
- Toast notifications for all actions (success/error)
- Keyboard accessibility (focus management, skip links)
- Optimistic updates where appropriate (TanStack Query)

---

This is the complete specification. Build everything. Do not skip any feature. Do not use mock data for anything that should be real. Make it production-grade.
