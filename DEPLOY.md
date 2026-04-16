# ClipMonk — Deployment Specification

> **Layer 8: The Destination.** Deployment choices are made in the planning phase, not at 11 PM the night before launch. This file defines every target environment, Docker config, and self-hosting setup.

---

## DEPLOYMENT TARGETS

ClipMonk supports three deployment modes:

| Mode | Frontend | Backend | Database | Storage | Best For |
|---|---|---|---|---|---|
| **Managed** | Vercel | Vercel (serverless) | Neon PostgreSQL | Cloudflare R2 | SaaS production |
| **VPS** | Docker | Docker | Docker (PostgreSQL) | MinIO (Docker) | Self-hosted, single server |
| **Kubernetes** | K8s pod | K8s pod | Managed PostgreSQL | S3 / R2 | Enterprise, scale |

---

## DOCKER CONFIGURATION

### `Dockerfile` (Multi-stage build)

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Requires** in `next.config.ts`:
```typescript
output: "standalone"
```

### `docker-compose.yml` (Full stack, self-hosted)

```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://clipmonk:clipmonk@db:5432/clipmonk
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - UPSTASH_REDIS_REST_URL=http://redis:8079
      - S3_ENDPOINT=http://minio:9000
      - S3_REGION=us-east-1
      - S3_BUCKET=clipmonk
      - S3_ACCESS_KEY=minioadmin
      - S3_SECRET_KEY=minioadmin
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
      minio:
        condition: service_started
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: clipmonk
      POSTGRES_PASSWORD: clipmonk
      POSTGRES_DB: clipmonk
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U clipmonk"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data
    restart: unless-stopped

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - miniodata:/data
    ports:
      - "9000:9000"   # API
      - "9001:9001"   # Console
    restart: unless-stopped

  # Bucket initialization
  minio-init:
    image: minio/mc
    depends_on:
      - minio
    entrypoint: >
      /bin/sh -c "
      sleep 3;
      mc alias set local http://minio:9000 minioadmin minioadmin;
      mc mb local/clipmonk --ignore-existing;
      mc anonymous set download local/clipmonk/public;
      "

volumes:
  pgdata:
  redisdata:
  miniodata:
```

### `docker-compose.dev.yml` (Development overrides)

```yaml
version: '3.9'

services:
  # Only run infrastructure — app runs via `npm run dev`
  app:
    profiles: ["full"]  # Only start with `docker compose --profile full up`
  
  db:
    ports:
      - "5432:5432"
  
  redis:
    ports:
      - "6379:6379"
  
  minio:
    ports:
      - "9000:9000"
      - "9001:9001"
```

**Usage:**
```bash
# Dev: just infrastructure
docker compose -f docker-compose.yml -f docker-compose.dev.yml up db redis minio

# Production: full stack
docker compose up -d
```

---

## MANAGED DEPLOYMENT (Vercel + Neon + R2)

### Vercel Setup

1. Connect GitHub repo to Vercel
2. Framework: Next.js (auto-detected)
3. Build command: `npx prisma generate && npm run build`
4. Install command: `npm ci`
5. Output directory: `.next` (default)
6. Node.js version: 20.x

### Environment Variables (Vercel Dashboard)

```
DATABASE_URL           → Neon connection string (pooled)
NEXTAUTH_URL           → https://clipmonk.dev
NEXTAUTH_SECRET        → openssl rand -base64 32
STRIPE_SECRET_KEY      → sk_live_...
STRIPE_PUBLISHABLE_KEY → pk_live_...
STRIPE_WEBHOOK_SECRET  → whsec_...
RESEND_API_KEY         → re_...
S3_ENDPOINT            → https://....r2.cloudflarestorage.com
S3_REGION              → auto
S3_BUCKET              → clipmonk
S3_ACCESS_KEY          → ...
S3_SECRET_KEY          → ...
UPSTASH_REDIS_REST_URL → https://....upstash.io
UPSTASH_REDIS_REST_TOKEN → ...
OPENAI_API_KEY         → sk-...
ANTHROPIC_API_KEY      → sk-ant-...
ENCRYPTION_KEY         → openssl rand -hex 32
```

### Neon PostgreSQL

- Create database: `clipmonk`
- Use pooled connection string for `DATABASE_URL`
- Run migrations: `npx prisma migrate deploy` (in Vercel build or separate script)
- Run seed: `npx prisma db seed` (first deploy only)

### Cloudflare R2

- Create bucket: `clipmonk`
- Create API token with read/write access
- Configure CORS:
```json
[{
  "AllowedOrigins": ["https://clipmonk.dev"],
  "AllowedMethods": ["GET", "PUT", "POST"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3600
}]
```

### Cron Jobs (Vercel)

In `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/internal/cron/publish-scheduled",
      "schedule": "* * * * *"
    },
    {
      "path": "/api/internal/cron/sync-analytics",
      "schedule": "0 * * * *"
    }
  ]
}
```

---

## VPS DEPLOYMENT (Docker Compose)

### Requirements
- VPS: 2 vCPU, 4GB RAM minimum (8GB recommended for video processing)
- Storage: 50GB+ SSD
- OS: Ubuntu 22.04 LTS
- Docker: 24+, Docker Compose v2

### Setup Steps

```bash
# 1. Clone repo
git clone https://github.com/davidoladeji/clipmonk.git
cd clipmonk

# 2. Copy and configure environment
cp .env.example .env
nano .env  # Set all values

# 3. Start services
docker compose up -d

# 4. Run migrations
docker compose exec app npx prisma migrate deploy

# 5. Seed database
docker compose exec app npx prisma db seed

# 6. Verify
curl http://localhost:3000/api/health
```

### Reverse Proxy (Caddy)

```
# /etc/caddy/Caddyfile
clipmonk.dev {
    reverse_proxy localhost:3000
    encode gzip
}
```

Caddy handles HTTPS automatically via Let's Encrypt.

### Backups

```bash
# PostgreSQL backup (daily cron)
docker compose exec db pg_dump -U clipmonk clipmonk | gzip > backup_$(date +%Y%m%d).sql.gz

# MinIO backup
docker compose exec minio mc mirror local/clipmonk /backup/minio/
```

---

## HEALTH CHECK ENDPOINT

### `/api/health` (public, no auth)

```json
{
  "status": "healthy",
  "version": "0.1.0",
  "timestamp": "2026-04-16T12:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "storage": "connected"
  }
}
```

If any service is down:
```json
{
  "status": "degraded",
  "services": {
    "database": "connected",
    "redis": "error",
    "storage": "connected"
  }
}
```

---

## MIGRATION STRATEGY

### Database Migrations
- Run `npx prisma migrate deploy` during deployment (not `migrate dev`)
- Never auto-migrate in production
- Test migrations against a staging database first
- Keep migrations reversible when possible

### Zero-Downtime Deploys
- Vercel: Automatic (immutable deployments, atomic swap)
- Docker: Use rolling updates (`docker compose up -d --no-deps app`)
- Database: Backward-compatible migrations only (add columns, don't rename/delete)

### Rollback Plan
- Vercel: Instant rollback to previous deployment via dashboard
- Docker: `docker compose pull && docker compose up -d` with previous image tag
- Database: Keep rollback SQL scripts for each migration

---

## MONITORING (Post-Launch)

| Concern | Tool | Notes |
|---|---|---|
| Uptime | UptimeRobot / Better Uptime | Monitor `/api/health` |
| Errors | Sentry | Server + client error tracking |
| Performance | Vercel Analytics / Web Vitals | Core Web Vitals, TTFB |
| Logs | Docker logs / Vercel logs | Structured JSON logging |
| Database | Neon dashboard / pg_stat | Query performance, connections |

---

*For what CI gates must pass before deploy, see `CI_CD.md`. For security constraints, see `SECURITY.md`. For the full feature spec, see `PRD.md`.*
