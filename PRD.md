# ClipMonk — Product Requirements Document (PRD)

> **This is the "What."** It defines every data model, API contract, user flow, and feature specification. It does NOT prescribe implementation patterns — those live in `CLAUDE.md`.

---

## 1. PRODUCT OVERVIEW

**ClipMonk** is an AI-powered video clipping and social media management platform that turns long-form videos into viral short-form clips, adds AI captions and face tracking, and publishes to every social platform from a single dashboard.

**Domain:** clipmonk.dev
**License:** MIT (open source, self-hostable)
**Business model:** Freemium SaaS with tiered subscriptions

### Target Users
- Content creators who repurpose long-form video (YouTube, Twitch, podcasts) into Shorts/Reels/TikToks
- Social media managers handling multiple brand accounts
- Marketing teams needing bulk scheduling and analytics
- Agencies managing client social presence

### Competitive Position
- Direct competitor to Ssemble, Opus Clip, Vizard, Vidyo.ai
- Differentiator: open source + self-hostable + social media management (not just clipping)

---

## 2. USER ROLES & PERSONAS

### System Roles (platform-wide)
| Role | Access |
|---|---|
| `USER` | Standard user, accesses app via team membership |
| `MODERATOR` | Can review reported content, limited admin access |
| `ADMIN` | Full admin panel access except SUPER_ADMIN-only actions |
| `SUPER_ADMIN` | Everything, including editing system roles and impersonation |

### Team Roles (scoped to a team/workspace)
| Role | Description |
|---|---|
| `owner` | Created the team. All permissions. Can transfer ownership. |
| `admin` | All permissions except ownership transfer and billing cancellation |
| `editor` | Create/edit projects, clips, draft posts. Upload files. Use AI. |
| `publisher` | Everything an editor can do + publish posts + manage social accounts |
| `viewer` | Read-only access to all resources + analytics |
| Custom roles | Admin-defined with granular permission selection |

---

## 3. USER FLOWS

### 3.1 Registration & Onboarding
```
Landing Page → "Get Started Free" → Registration Form
  → Email + Password (with strength meter) OR
  → OAuth (Google, GitHub, Discord) OR
  → Magic Link (email)
→ Email Verification (required before app access)
→ Onboarding Wizard:
  Step 1: Profile (name, avatar, timezone)
  Step 2: Create or join team (team name + slug, or accept invite)
  Step 3: Connect first social account (skip-able)
  Step 4: Choose plan (start free trial or stay on Starter)
→ Dashboard
```

### 3.2 Authentication
```
Login → Email/Password + Remember Me (30-day session)
     → OR OAuth (Google, GitHub, Discord)
     → OR Magic Link
→ If 2FA enabled → TOTP Challenge (authenticator app)
                 → OR Backup Code
→ If email not verified → Redirect to /verify-email
→ If team invite pending → Auto-join team
→ Redirect to intended page (or dashboard)
```

### 3.3 Two-Factor Authentication Setup
```
Settings > Security → Enable 2FA
→ Generate TOTP secret → Show QR code
→ User scans with authenticator app
→ User enters 6-digit code to confirm
→ Generate 8 backup codes → User downloads/copies
→ 2FA active
```

### 3.4 Password Recovery
```
Login → "Forgot Password?" → Enter email
→ Send reset link (1hr expiry)
→ Click link → Enter new password (with strength meter)
→ Password updated → Redirect to login
```

### 3.5 Video Clipping (Core Feature)
```
Dashboard → "New Project" → Enter YouTube URL or Upload Video
→ Video downloading/uploading (progress bar)
→ Transcription (Whisper, progress indicator)
→ AI Analysis (scoring moments for virality)
→ Clip suggestions generated (ranked by virality score 0-100)
→ User selects clips → Opens Clip Editor:
  - Timeline with trim handles
  - Aspect ratio selector (9:16, 1:1, 16:9, 4:5)
  - Face tracking toggle (auto-centers faces for vertical)
  - Caption editor:
    - Style: Bold, Karaoke, Typewriter, Minimal
    - Language: 30+ languages
    - Translation: translate captions, keep original audio
  - Hook generator: AI suggests scroll-stopping hooks
  - CTA generator: AI suggests calls-to-action
→ Export clip (resolution based on plan: 720p/1080p/4K)
→ Clip saved to library
```

### 3.6 Post Composition & Publishing
```
Compose → Rich text editor
→ Select target accounts (multi-platform, multi-account)
→ Attach media (clips, images, videos from library)
→ AI Assistant panel:
  - Generate caption
  - Suggest hashtags (trending, niche)
  - Translate content
  - Adjust tone
→ Preview per-platform (different character limits, aspect ratios)
→ Publish now OR Schedule for later
→ If scheduled → Appears on calendar
→ On publish → Post sent to each platform API
→ Status tracked per-platform (success/failed with error details)
```

### 3.7 Scheduling
```
Scheduler → Calendar view (month/week/day)
→ See all scheduled posts with platform icons
→ Click day → Day detail with time slots
→ Drag-and-drop to reschedule
→ AI suggests optimal posting times per platform
→ Bulk scheduling: upload CSV or queue multiple posts
```

### 3.8 Analytics
```
Analytics Dashboard:
- Cross-platform overview (total views, likes, shares, followers)
- Platform breakdown (per-network engagement rates)
- Top performing clips (ranked by engagement)
- Best posting times (heatmap)
- Growth charts (followers over time)
- Export as CSV or PDF
```

### 3.9 Team Management
```
Team Settings → Members tab:
- List members with role, join date, last active
- Invite by email → Select role → Send invite email
- Change member role (dropdown)
- Remove member (with confirmation)
- Pending invites list with resend/revoke

Team Settings → General:
- Team name, slug, avatar
- Default timezone
- Enforce 2FA for all members toggle
- Transfer ownership (SUPER_ADMIN only)
```

### 3.10 Admin Panel (see Section 7 for full spec)
```
/admin → System dashboard with KPIs
→ Manage users, teams, roles, permissions
→ Manage plans, subscriptions, payments
→ Content moderation
→ Feature flags
→ Audit log
→ System settings
→ Support tickets
```

---

## 4. DATA MODELS

> These are the canonical data contracts. The Prisma schema in the codebase must match these exactly.

### 4.1 User
| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | cuid | auto | - | Primary key |
| email | string | yes | - | Unique, indexed |
| emailVerified | datetime | no | null | Set when email confirmed |
| passwordHash | string | no | null | Null for OAuth-only users |
| name | string | no | null | Full name |
| displayName | string | no | null | Public display name |
| avatarUrl | string | no | null | Profile image URL |
| bio | string | no | null | Short bio |
| timezone | string | yes | "UTC" | IANA timezone |
| language | string | yes | "en" | ISO 639-1 |
| twoFactorEnabled | boolean | yes | false | - |
| twoFactorSecret | string | no | null | TOTP secret (encrypted) |
| backupCodes | string[] | yes | [] | Encrypted backup codes |
| lastLoginAt | datetime | no | null | - |
| lastLoginIp | string | no | null | - |
| failedLoginAttempts | int | yes | 0 | Resets on successful login |
| lockedUntil | datetime | no | null | Account lockout expiry |
| status | enum | yes | ACTIVE | ACTIVE, INACTIVE, BANNED, SUSPENDED, PENDING_VERIFICATION, DELETED |
| bannedAt | datetime | no | null | - |
| bannedReason | string | no | null | - |
| bannedBy | string | no | null | Admin user ID |
| deletedAt | datetime | no | null | Soft delete |
| systemRole | enum | yes | USER | USER, MODERATOR, ADMIN, SUPER_ADMIN |
| onboardingCompleted | boolean | yes | false | - |
| onboardingStep | int | yes | 0 | Current onboarding step |

**Relations:** accounts[], sessions[], teamMemberships[], ownedTeams[], apiKeys[], auditLogs[], notifications[]

### 4.2 Team
| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | cuid | auto | - | - |
| name | string | yes | - | Team display name |
| slug | string | yes | - | Unique, URL-safe |
| avatarUrl | string | no | null | - |
| description | string | no | null | - |
| ownerId | string | yes | - | FK → User |
| stripeCustomerId | string | no | null | Unique |
| stripeSubscriptionId | string | no | null | Unique |
| planId | string | no | null | FK → Plan |
| subscriptionStatus | enum | yes | TRIALING | TRIALING, ACTIVE, PAST_DUE, CANCELED, UNPAID, INCOMPLETE |
| trialEndsAt | datetime | no | null | - |
| currentPeriodEnd | datetime | no | null | - |
| clipsUsedThisMonth | int | yes | 0 | Reset monthly via cron |
| postsUsedThisMonth | int | yes | 0 | - |
| aiCreditsUsedThisMonth | int | yes | 0 | - |
| storageUsedBytes | bigint | yes | 0 | - |
| settings | json | yes | {} | Team-level config |

**Relations:** owner, plan, members[], invites[], projects[], socialAccounts[], posts[], files[], apiKeys[], auditLogs[]

### 4.3 Role
| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | cuid | auto | - | - |
| name | string | yes | - | Unique, machine-readable |
| displayName | string | yes | - | Human-readable |
| description | string | no | null | - |
| isSystem | boolean | yes | false | System roles cannot be deleted |
| color | string | no | null | Hex color for UI badges |

**Relations:** permissions[], members[], invites[]

### 4.4 Permission
| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | cuid | auto | - | - |
| name | string | yes | - | Unique. Format: `resource.action` |
| displayName | string | yes | - | Human-readable |
| description | string | no | null | - |
| group | string | yes | - | Grouping key for UI |

**Permission Registry (complete list):**

| Group | Permissions |
|---|---|
| projects | `projects.create`, `projects.read`, `projects.update`, `projects.delete` |
| clips | `clips.create`, `clips.read`, `clips.update`, `clips.delete`, `clips.export`, `clips.process` |
| posts | `posts.create`, `posts.read`, `posts.update`, `posts.delete`, `posts.publish`, `posts.schedule` |
| accounts | `accounts.connect`, `accounts.disconnect`, `accounts.read` |
| team | `team.read`, `team.invite`, `team.remove`, `team.change_role`, `team.manage_settings` |
| billing | `billing.read`, `billing.manage`, `billing.cancel` |
| files | `files.upload`, `files.read`, `files.delete`, `files.manage_folders` |
| ai | `ai.generate`, `ai.read_templates`, `ai.manage_templates` |
| analytics | `analytics.read`, `analytics.export` |
| settings | `settings.read`, `settings.update` |
| admin | `admin.access`, `admin.manage_users`, `admin.manage_roles`, `admin.manage_plans`, `admin.manage_billing`, `admin.manage_content`, `admin.manage_settings`, `admin.view_audit_log`, `admin.impersonate`, `admin.manage_feature_flags`, `admin.manage_support` |

### 4.5 Default Role → Permission Matrix

| Permission | owner | admin | editor | publisher | viewer |
|---|---|---|---|---|---|
| projects.create | x | x | x | | |
| projects.read | x | x | x | x | x |
| projects.update | x | x | x | | |
| projects.delete | x | x | | | |
| clips.create | x | x | x | | |
| clips.read | x | x | x | x | x |
| clips.update | x | x | x | | |
| clips.delete | x | x | | | |
| clips.export | x | x | x | x | |
| clips.process | x | x | x | | |
| posts.create | x | x | x | x | |
| posts.read | x | x | x | x | x |
| posts.update | x | x | x | x | |
| posts.delete | x | x | | | |
| posts.publish | x | x | | x | |
| posts.schedule | x | x | x | x | |
| accounts.connect | x | x | | x | |
| accounts.disconnect | x | x | | | |
| accounts.read | x | x | x | x | x |
| team.read | x | x | x | x | x |
| team.invite | x | x | | | |
| team.remove | x | x | | | |
| team.change_role | x | x | | | |
| team.manage_settings | x | | | | |
| billing.read | x | x | | | |
| billing.manage | x | | | | |
| billing.cancel | x | | | | |
| files.upload | x | x | x | x | |
| files.read | x | x | x | x | x |
| files.delete | x | x | x | | |
| files.manage_folders | x | x | x | | |
| ai.generate | x | x | x | x | |
| ai.read_templates | x | x | x | x | x |
| ai.manage_templates | x | x | | | |
| analytics.read | x | x | x | x | x |
| analytics.export | x | x | | | |
| settings.read | x | x | x | x | x |
| settings.update | x | x | | | |

### 4.6 Plan
| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | cuid | auto | - | - |
| name | string | yes | - | Display name |
| slug | string | yes | - | Unique, URL-safe |
| description | string | no | null | - |
| stripePriceIdMonthly | string | no | null | Unique |
| stripePriceIdYearly | string | no | null | Unique |
| stripeProductId | string | no | null | Unique |
| priceMonthly | int | yes | 0 | Cents |
| priceYearly | int | yes | 0 | Cents |
| maxClipsPerMonth | int | yes | 5 | -1 = unlimited |
| maxPostsPerMonth | int | yes | 50 | - |
| maxAiCreditsPerMonth | int | yes | 100 | - |
| maxTeamMembers | int | yes | 1 | - |
| maxSocialAccounts | int | yes | 1 | - |
| maxStorageBytes | bigint | yes | 1073741824 | 1GB default |
| maxProjectsPerMonth | int | yes | 3 | - |
| maxExportResolution | string | yes | "720p" | "720p", "1080p", "4k" |
| features | json | yes | {} | Feature flags per plan |
| isPublic | boolean | yes | true | Show on pricing page |
| isFeatured | boolean | yes | false | Highlight on pricing page |
| sortOrder | int | yes | 0 | Display order |

**Default Plans:**

| | Starter | Pro | Business | Enterprise |
|---|---|---|---|---|
| Price (monthly) | Free | $19 | $49 | Custom |
| Price (yearly) | Free | $190 | $490 | Custom |
| Clips/month | 5 | Unlimited | Unlimited | Unlimited |
| Posts/month | 50 | Unlimited | Unlimited | Unlimited |
| AI credits/month | 100 | 1,000 | 5,000 | Unlimited |
| Team members | 1 | 5 | 15 | Unlimited |
| Social accounts | 1 | 5 | Unlimited | Unlimited |
| Storage | 1 GB | 25 GB | 100 GB | Unlimited |
| Projects/month | 3 | Unlimited | Unlimited | Unlimited |
| Max resolution | 720p | 1080p | 4K | 4K |
| Trial | No | 14 days | 14 days | No |
| Face tracking | No | Yes | Yes | Yes |
| AI captions | Basic | Full | Full | Full |
| Priority support | No | No | Yes | Yes |
| API access | No | Yes | Yes | Yes |
| Custom branding | No | No | Yes | Yes |

### 4.7 Project
| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | cuid | auto | - | - |
| teamId | string | yes | - | FK → Team |
| createdById | string | yes | - | FK → User |
| title | string | yes | - | - |
| description | string | no | null | - |
| sourceUrl | string | no | null | YouTube/Twitch/Vimeo URL |
| sourceType | enum | yes | UPLOAD | YOUTUBE, TWITCH, VIMEO, UPLOAD, URL |
| originalFileUrl | string | no | null | S3 URL |
| originalFileName | string | no | null | - |
| originalDuration | int | no | null | Seconds |
| thumbnailUrl | string | no | null | - |
| status | enum | yes | PENDING | PENDING, DOWNLOADING, TRANSCRIBING, ANALYZING, GENERATING_CLIPS, READY, FAILED |
| processingError | string | no | null | Error message if failed |
| transcription | json | no | null | Full transcript with word-level timestamps |
| settings | json | yes | {} | aspectRatio, clipDuration, language, etc. |

### 4.8 Clip
| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | cuid | auto | - | - |
| projectId | string | yes | - | FK → Project |
| title | string | yes | - | - |
| startTime | float | yes | - | Seconds |
| endTime | float | yes | - | Seconds |
| duration | float | yes | - | Seconds |
| viralityScore | int | yes | 0 | 0-100, AI-assigned |
| tags | string[] | yes | [] | Content tags |
| aiReasoning | string | no | null | Why AI selected this moment |
| videoUrl | string | no | null | S3 URL of processed clip |
| thumbnailUrl | string | no | null | - |
| aspectRatio | string | yes | "9:16" | "9:16", "1:1", "16:9", "4:5" |
| resolution | string | yes | "1080p" | - |
| captions | json | no | null | SRT-like structure with timestamps |
| captionStyle | string | yes | "bold" | "bold", "karaoke", "typewriter", "minimal" |
| captionLanguage | string | yes | "en" | - |
| faceTrackingEnabled | boolean | yes | true | - |
| hookTitle | string | no | null | AI-generated hook |
| ctaText | string | no | null | AI-generated CTA |
| status | enum | yes | DRAFT | DRAFT, PROCESSING, READY, EXPORTED, PUBLISHED, FAILED |
| exportedAt | datetime | no | null | - |

### 4.9 SocialAccount
| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | cuid | auto | - | - |
| teamId | string | yes | - | FK → Team |
| platform | enum | yes | - | YOUTUBE, TIKTOK, INSTAGRAM, FACEBOOK, LINKEDIN, TWITTER, PINTEREST |
| platformUserId | string | yes | - | User ID on the platform |
| username | string | no | null | - |
| displayName | string | no | null | - |
| avatarUrl | string | no | null | - |
| profileUrl | string | no | null | - |
| followerCount | int | yes | 0 | - |
| accessToken | string | yes | - | Encrypted |
| refreshToken | string | no | null | Encrypted |
| tokenExpiresAt | datetime | no | null | - |
| scopes | string[] | yes | [] | Granted OAuth scopes |
| status | enum | yes | ACTIVE | ACTIVE, EXPIRED, ERROR, DISCONNECTED |
| lastSyncedAt | datetime | no | null | - |
| errorMessage | string | no | null | - |

**Unique constraint:** (teamId, platform, platformUserId)

### 4.10 Post
| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | cuid | auto | - | - |
| teamId | string | yes | - | FK → Team |
| createdById | string | yes | - | FK → User |
| content | string | yes | - | Post body text |
| title | string | no | null | Used by YouTube, LinkedIn |
| hashtags | string[] | yes | [] | - |
| mentions | string[] | yes | [] | - |
| linkUrl | string | no | null | - |
| mediaUrls | string[] | yes | [] | S3 URLs |
| thumbnailUrl | string | no | null | - |
| status | enum | yes | DRAFT | DRAFT, SCHEDULED, PUBLISHING, PUBLISHED, FAILED, CANCELLED |
| scheduledAt | datetime | no | null | - |
| publishedAt | datetime | no | null | - |
| aiGenerated | boolean | yes | false | - |
| aiProvider | string | no | null | - |
| aiPrompt | string | no | null | - |
| campaignId | string | no | null | FK → Campaign |

**Relations:** accounts[] (PostAccount junction), clips[] (PostClip junction), analytics[]

### 4.11 Remaining Models (summary)

- **PostAccount** — Junction: Post × SocialAccount. Tracks per-platform publish status, platform post ID, URL, errors.
- **PostAnalytics** — Per-post, per-platform metrics: views, likes, comments, shares, saves, clicks, impressions, reach, engagement rate.
- **Campaign** — Group posts by campaign: name, description, color, date range.
- **File** — Uploaded media: name, S3 key, URL, size, mime type, dimensions, duration, folder.
- **FileFolder** — Hierarchical folders: name, parentId (self-referential tree).
- **AiTemplate** — Reusable AI prompts: name, category, prompt template with {{variables}}, provider, model.
- **AiUsage** — Track AI consumption: provider, model, feature, tokens, cost.
- **ApiKey** — Developer API keys: name, SHA-256 hash, prefix, scopes, expiry.
- **Notification** — In-app notifications: type, title, body, data, read status.
- **AuditLog** — Every sensitive action: actor, action, entity, metadata, IP, user agent.
- **SupportTicket** — User support: subject, category, priority, status, messages.
- **SupportMessage** — Ticket thread messages: author, isStaff flag, body.
- **FeatureFlag** — Feature toggles: key, enabled, targeting (plans, users, teams, percentage).
- **SystemSetting** — Key-value system config.
- **Account** — Auth.js OAuth accounts (standard schema).
- **Session** — Auth.js sessions with IP and user agent tracking.
- **VerificationToken** — Multi-purpose tokens: email verification, password reset, team invite, 2FA, API key.

---

## 5. API CONTRACTS

### 5.1 Auth Endpoints (Server Actions + API routes)

| Action | Input | Output | Notes |
|---|---|---|---|
| Register | { email, password, name } | { user, session } | Sends verification email |
| Login | { email, password, rememberMe? } | { user, session } OR { requires2FA: true } | Rate limited: 10/min |
| Verify Email | { token } | { success } | Token from email link |
| Forgot Password | { email } | { success } | Always returns success (no email enumeration) |
| Reset Password | { token, password } | { success } | 1hr token expiry |
| Enable 2FA | { totpCode } | { backupCodes } | Requires current session |
| Verify 2FA | { code } OR { backupCode } | { session } | During login flow |
| Disable 2FA | { password, totpCode } | { success } | Requires both |
| OAuth Callback | (handled by Auth.js) | { user, session } | Google, GitHub, Discord |
| Magic Link | { email } | { success } | Sends login link |
| Logout | - | - | Destroys session |
| List Sessions | - | { sessions[] } | Active sessions for current user |
| Revoke Session | { sessionId } | { success } | - |

### 5.2 Public API (v1) — requires API key

**Authentication:** `Authorization: Bearer cm_live_xxxxxxxxxxxxxxxxxxxx`
**Rate limit:** 100 requests/minute per key
**Base URL:** `/api/v1`

#### Clips
```
POST   /api/v1/clips          Create clip from URL
GET    /api/v1/clips          List clips (paginated, filterable)
GET    /api/v1/clips/:id      Get clip details
PATCH  /api/v1/clips/:id      Update clip
DELETE /api/v1/clips/:id      Delete clip
```

#### Posts
```
POST   /api/v1/posts          Create post (draft or scheduled)
GET    /api/v1/posts          List posts
GET    /api/v1/posts/:id      Get post details
PATCH  /api/v1/posts/:id      Update post
DELETE /api/v1/posts/:id      Delete post
POST   /api/v1/posts/:id/publish   Publish immediately
```

#### Analytics
```
GET    /api/v1/analytics              Overview metrics
GET    /api/v1/analytics/posts/:id    Per-post analytics
GET    /api/v1/analytics/platforms    Per-platform breakdown
```

**Standard response format:**
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Error format:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action",
    "details": {}
  }
}
```

### 5.3 Webhook Events (Incoming)

**Stripe Webhooks** (`/api/webhooks/stripe`):
| Event | Action |
|---|---|
| `checkout.session.completed` | Activate subscription, update team plan |
| `invoice.payment_succeeded` | Record payment, reset usage counters |
| `invoice.payment_failed` | Mark past_due, send warning email |
| `customer.subscription.updated` | Sync plan changes |
| `customer.subscription.deleted` | Cancel subscription, downgrade to Starter |
| `customer.subscription.trial_will_end` | Send trial ending email (3 days before) |

**Social Platform Webhooks** (`/api/webhooks/social/[platform]`):
| Event | Action |
|---|---|
| Post published confirmation | Update PostAccount status |
| Token refresh needed | Refresh OAuth token |
| Account disconnected | Update SocialAccount status |

### 5.4 Internal API (Server-to-server)

| Endpoint | Trigger | Action |
|---|---|---|
| `POST /api/internal/process-video` | New project created | Download, transcribe, analyze, generate clips |
| `GET /api/internal/cron/publish-scheduled` | Every minute (cron) | Find posts with scheduledAt ≤ now, publish |
| `GET /api/internal/cron/sync-analytics` | Every hour (cron) | Fetch analytics from platform APIs |

---

## 6. EMAIL SPECIFICATIONS

| Email | Trigger | Subject Line | Key Content |
|---|---|---|---|
| Welcome | After registration | Welcome to ClipMonk | Getting started steps, link to dashboard |
| Verify Email | Registration or email change | Verify your email address | Verification link (24hr expiry) |
| Reset Password | Forgot password request | Reset your password | Reset link (1hr expiry) |
| Team Invite | Admin invites member | [Inviter] invited you to [Team] | Accept invite link, team info |
| Subscription Created | Successful checkout | Your [Plan] plan is active | Plan details, getting started |
| Subscription Cancelled | Cancellation confirmed | Your subscription has been cancelled | Data retention info, reactivation link |
| Payment Failed | Invoice payment fails | Payment failed for your ClipMonk subscription | Update payment method link |
| Usage Warning (80%) | Hit 80% of any limit | You're approaching your [resource] limit | Current usage, upgrade link |
| Usage Warning (100%) | Hit 100% of any limit | You've reached your [resource] limit | Upgrade link |
| New Device Login | Login from unknown IP/device | New sign-in to your ClipMonk account | Device info, "wasn't me" link |
| Clip Ready | Video processing complete | Your clips are ready | Project link, clip count |
| Post Published | Scheduled post goes live | Your post has been published | Platform links, quick stats |

---

## 7. ADMIN PANEL SPECIFICATION

### 7.1 Admin Dashboard (`/admin`)
**KPI Cards (top row):**
- Total users (with % growth this month)
- Total teams
- Active subscriptions (by plan)
- MRR (Monthly Recurring Revenue, calculated from Stripe)

**Charts:**
- New signups: daily for last 30 days (line chart)
- Active users: DAU/WAU/MAU (line chart)
- Revenue: MRR trend last 12 months (bar chart)

**Tables:**
- Recent activity feed: last 50 audit log entries (actor, action, time)
- Recent signups: last 10 users

**Quick actions:** Create user, Create plan, Toggle feature flag, View audit log

### 7.2 User Management (`/admin/users`)
**Table columns:** Avatar, Name, Email, System Role (badge), Status (badge), Plan, Created, Last Login
**Actions per row:** Edit, Impersonate, Ban/Suspend, Delete
**Bulk actions:** Ban selected, Suspend selected, Activate selected, Delete selected, Change role
**Filters:** Status, System Role, Plan, Date range (joined)
**Search:** Name, Email (debounced, server-side)

**User Detail (`/admin/users/[id]`):**
- Profile section (editable: name, email, avatar, timezone, language)
- System role selector
- Status management (activate, suspend, ban with reason input)
- Impersonate button (creates audit entry, shows banner, "Stop Impersonating" escape)
- Tabs: Teams, Subscription, API Keys, Login History, Audit Log
- Danger zone: Force password reset, Revoke all sessions, Delete account

### 7.3 Role Management (`/admin/roles`)
- Role list with member count, system badge
- Create custom role: name, display name, description, color picker
- Permission matrix: grid with permission rows (grouped by module) × role columns
- Checkbox toggles, with "select all in group" shortcut
- System roles (owner, admin, editor, publisher, viewer) are deletion-locked

### 7.4 Plan Management (`/admin/plans`)
- Plan list with subscriber count, MRR contribution
- Create/Edit: all fields from Plan model + Stripe sync button
- Feature flag JSON editor per plan
- Reorder via drag-and-drop

### 7.5 Subscription Management (`/admin/subscriptions`)
- Table: Team, Plan, Status, MRR, Next billing, Created
- Actions: Change plan, Cancel, Refund
- Filter by plan, status

### 7.6 Payment History (`/admin/payments`)
- Table: Date, Team, Amount, Status, Invoice link
- Filter by date range, status, amount
- Export CSV
- Refund action

### 7.7 Audit Log (`/admin/audit-log`)
- Table: Timestamp, Actor, Action, Entity Type, Entity ID, IP
- Filter by action, actor, date range, team
- Click row → modal with full metadata JSON (before/after diff)
- Export CSV

### 7.8 Feature Flags (`/admin/feature-flags`)
- List: Key, Name, Status toggle, Targeting summary
- Create: key (slug), name, description
- Edit targeting: all users, specific plans, specific users, specific teams, percentage rollout

### 7.9 Content Moderation (`/admin/content`)
- Reported content queue
- View/delete any post or clip
- Ban user from here

### 7.10 System Settings (`/admin/settings`)
- General: App name, logo URL, support email, default timezone, maintenance mode toggle
- Email: Provider config, test email button
- AI: Provider API keys, default models, per-provider rate limits
- Storage: S3 config, max file sizes, allowed MIME types
- Webhooks: Registered webhook URLs, test button

### 7.11 Support Tickets (`/admin/support`)
- Ticket list: ID, Subject, User, Category, Priority (color-coded), Status, Created
- Ticket detail: conversation thread, reply form, status/priority controls, assign to admin

---

## 8. SOCIAL PLATFORM INTEGRATIONS

### OAuth Scopes Required

| Platform | OAuth Provider | Required Scopes |
|---|---|---|
| YouTube | Google OAuth 2.0 | `youtube.upload`, `youtube.readonly`, `youtube.force-ssl` |
| TikTok | TikTok Login Kit | `video.upload`, `video.list`, `user.info.basic` |
| Instagram | Facebook/Meta OAuth | `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights` |
| Facebook | Facebook OAuth | `pages_manage_posts`, `pages_read_engagement`, `pages_show_list` |
| LinkedIn | LinkedIn OAuth 2.0 | `w_member_social`, `r_basicprofile`, `r_organization_social` |
| Twitter/X | OAuth 2.0 PKCE | `tweet.read`, `tweet.write`, `users.read`, `offline.access` |
| Pinterest | Pinterest OAuth | `boards:read`, `pins:read`, `pins:write` |

### Platform Publishing Constraints

| Platform | Max Video Length | Max File Size | Aspect Ratios | Caption Limit |
|---|---|---|---|---|
| YouTube Shorts | 60s | 256 MB | 9:16 | 100 chars (title) |
| TikTok | 10 min | 287.6 MB | 9:16 | 2,200 chars |
| Instagram Reels | 90s | 650 MB | 9:16 | 2,200 chars |
| Facebook Reels | 90s | 1 GB | 9:16 | 2,200 chars |
| LinkedIn Video | 10 min | 5 GB | any | 3,000 chars |
| Twitter/X | 2:20 | 512 MB | any | 280 chars |
| Pinterest Video | 15 min | 2 GB | 9:16, 1:1 | 500 chars |

---

## 9. SUCCESS METRICS

| Metric | Target (Month 1) | Target (Month 6) |
|---|---|---|
| Registered users | 500 | 10,000 |
| Active teams | 100 | 2,000 |
| Clips generated | 2,500 | 100,000 |
| Posts published | 5,000 | 200,000 |
| Paid subscribers | 20 | 400 |
| MRR | $500 | $10,000 |
| GitHub stars | 100 | 2,000 |

---

*This PRD is the single source of truth for what ClipMonk does. For how to build it, see `CLAUDE.md`.*
