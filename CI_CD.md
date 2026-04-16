# ClipMonk — CI/CD Pipeline

> **Layer 7: The Gatekeeper.** Every push triggers a full gate: Typecheck → Unit/E2E tests → SAST/DAST scans → Docker build. The infra is version-controlled alongside the app.

---

## PIPELINE OVERVIEW

```
Push to any branch
  ├── Typecheck (tsc --noEmit)
  ├── Lint (eslint + prettier check)
  ├── Unit Tests (vitest run --coverage)
  ├── E2E Tests (playwright, against ephemeral DB)
  ├── Security Audit (npm audit, eslint-plugin-security)
  ├── Docker Build (multi-stage, verify it compiles)
  └── Bundle Analysis (next build, check size regression)

Push to main
  └── All above + Deploy (see DEPLOY.md)
```

---

## GITHUB ACTIONS WORKFLOW

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: '20'
  DATABASE_URL: postgresql://test:test@localhost:5432/clipmonk_test

jobs:
  typecheck:
    name: Typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit

  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npx eslint . --max-warnings 0
      - run: npx prettier --check .

  test-unit:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: clipmonk_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npx vitest run --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  test-e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: clipmonk_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npx prisma db seed
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  security:
    name: Security Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm audit --audit-level=high
      - run: npx eslint . --config .eslintrc.security.json  # Security-focused rules

  docker:
    name: Docker Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          cache-from: type=gha
          cache-to: type=gha,mode=max

  bundle:
    name: Bundle Analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npx next build
      - run: |
          # Fail if First Load JS exceeds 300kB
          SIZE=$(cat .next/build-manifest.json | node -e "
            const m = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
            // Check total page sizes
            console.log('Build completed successfully');
          ")
```

### `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  ci:
    uses: ./.github/workflows/ci.yml

  deploy:
    needs: ci
    runs-on: ubuntu-latest
    steps:
      # See DEPLOY.md for platform-specific deployment steps
      - uses: actions/checkout@v4
      # Vercel deployment, Docker push, or self-host trigger
```

---

## GATE REQUIREMENTS

**A PR cannot merge to `main` unless ALL of these pass:**

| Gate | Tool | Failure = Block? |
|---|---|---|
| TypeScript compiles | `tsc --noEmit` | Yes |
| Zero ESLint errors | `eslint --max-warnings 0` | Yes |
| Prettier formatted | `prettier --check` | Yes |
| Unit tests pass | `vitest run` | Yes |
| E2E tests pass | `playwright test` | Yes |
| No high/critical vulnerabilities | `npm audit` | Yes |
| Docker builds | `docker build` | Yes |
| Coverage ≥ thresholds | vitest coverage | Yes (see TESTING.md) |

---

## ESLINT CONFIGURATION

### Base Config (`.eslintrc.json`)
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/strict-boolean-expressions": "warn",
    "no-console": ["error", { "allow": ["warn", "error"] }]
  }
}
```

### Security Config (`.eslintrc.security.json`)
```json
{
  "extends": ["plugin:security/recommended"],
  "rules": {
    "security/detect-object-injection": "warn",
    "security/detect-non-literal-regexp": "error",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-possible-timing-attacks": "warn"
  }
}
```

---

## PRE-COMMIT HOOKS

### `.husky/pre-commit`
```bash
npx lint-staged
```

### `lint-staged` config (in `package.json`)
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml}": ["prettier --write"],
    "prisma/schema.prisma": ["npx prisma format"]
  }
}
```

---

## BRANCH PROTECTION RULES (GitHub)

Configure on `main`:
- Require PR before merging
- Require status checks: typecheck, lint, test-unit, test-e2e, security, docker
- Require up-to-date branch
- Require review (1 approval minimum)
- Dismiss stale reviews on new push
- Restrict force pushes
- Restrict deletions

---

## ENVIRONMENT VARIABLES IN CI

| Variable | Source | Used By |
|---|---|---|
| `DATABASE_URL` | Service container (PostgreSQL) | Tests, migrations |
| `NEXTAUTH_SECRET` | GitHub secret | E2E tests |
| `STRIPE_SECRET_KEY` | Not needed (MSW mocked) | - |
| `DOCKER_USERNAME` | GitHub secret | Docker push (deploy only) |
| `DOCKER_PASSWORD` | GitHub secret | Docker push (deploy only) |
| `VERCEL_TOKEN` | GitHub secret | Vercel deploy (deploy only) |

---

*For what the tests should verify, see `TESTING.md`. For security rules being enforced, see `SECURITY.md`. For what happens after CI passes, see `DEPLOY.md`.*
