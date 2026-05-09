# wdio-baseline

> Structured WebdriverIO v9 + Axios setup for reliable **UI** and **API** testing.

Provides a clean, maintainable foundation for scalable automation, with support
for Selenium Grid, Docker, CI pipelines, **Allure reporting**, and **visual
regression checks**.

---

## Website Under Test

wdio-baseline is designed to test any modern web application.  
For demonstration purposes, it is configured to run against
[Automation Exercise](https://www.automationexercise.com/).

---

## Workflow Status

[![E2E Tests](https://github.com/gregoryAndrikopoulos/wdio-baseline/actions/workflows/e2e_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/wdio-baseline/actions/workflows/e2e_test.yml)
[![API Tests](https://github.com/gregoryAndrikopoulos/wdio-baseline/actions/workflows/api_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/wdio-baseline/actions/workflows/api_test.yml)
[![Smoke Test](https://github.com/gregoryAndrikopoulos/wdio-baseline/actions/workflows/smoke_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/wdio-baseline/actions/workflows/smoke_test.yml)
[![SCA](https://github.com/gregoryAndrikopoulos/wdio-baseline/actions/workflows/sca.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/wdio-baseline/actions/workflows/sca.yml)
[![SAST](https://github.com/gregoryAndrikopoulos/wdio-baseline/actions/workflows/sast.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/wdio-baseline/actions/workflows/sast.yml)

---

## Technologies Used

- **WebdriverIO v9** — automation testing framework
- **Mocha** — test framework for writing and executing tests
- **Axios** — HTTP client for API testing
- **Node.js** — JavaScript runtime environment
- **Selenium Grid 4 (via Docker)** — browser execution in isolated containers
- **Allure** — advanced reporting (screenshots and console logs)
- **Pixelmatch + pngjs** — image diffing stack used for visual regression
- **GitHub Actions** — continuous integration and automated test runs
- **dotenv** — local environment variable management
- **GitHub Secrets** — secure storage for CI credentials
- **faker.js** — random but reproducible test data generation
- **Dependabot** — automated dependency update PRs (weekly)
- **Trivy** — SCA for filesystem/dependencies and Docker images
- **Semgrep** — SAST for JS/TS with OWASP Top 10 rules

### Developer Tooling

- **ESLint** — linting
- **Prettier** — formatting
- **mise** — runtime version manager (pins Node per project via `.tool-versions`)
- **Corepack** — manages pnpm version per project via `packageManager`

---

## Runtime Versions (Node & pnpm)

This repository pins tooling using:

- **mise** for Node.js
- **Corepack** for pnpm

### Node version is defined in `.tool-versions`

```txt
nodejs 24.7.0
```

### pnpm version is defined in `package.json`

```json
"packageManager": "pnpm@10.15.1"
```

### Setup

```bash
mise install
corepack enable
pnpm install
```

### Verify setup

```bash
node -v
pnpm -v
```

Expected:

- Node → 24.7.0
- pnpm → 10.15.1

### Changing versions locally

```bash
mise use node@24.7.0
corepack prepare pnpm@10.15.1 --activate
```

---

## Environment & Secrets

### Local (.env)

Create a `.env` at the repository root (do **not** commit it). Example:

```ini
TEST_USER_EMAIL_1=
TEST_USER_PASSWORD_1=
```

### CI (GitHub Actions)

Create repository **Secrets** with the same names used locally:

- `TEST_USER_EMAIL_1`, `TEST_USER_PASSWORD_1`

### Additional credential sets

The codebase supports extra sets (`_2`, `_3`, …) via `getCredentials(setNumber)`.

1. Add variables to `.env`
2. Add GitHub Secrets
3. Update workflows

---

## Installation and Setup

### Prerequisites

- **mise** (runtime manager)
- **Docker Desktop** (with Compose)
- Node is installed via mise
- pnpm is managed via Corepack (Node 24+)

### Install toolchain & dependencies

```bash
mise install
corepack enable
pnpm install
```

---

## Running Tests

### Run test infrastructure (Docker)

```bash
pnpm infra:up
pnpm infra:cross:up
```

Grid UI: http://localhost:4444/ui

```bash
pnpm infra:logs
pnpm infra:down
pnpm infra:status
```

---

### Run tests locally

```bash
pnpm test:e2e
pnpm test:smoke
pnpm test:api
```

---

## Reports

### Allure

```bash
pnpm report:allure:open:local
pnpm report:allure:open:ci
```

---

## Visual Regression (UI only)

- Snapshot comparison against baselines
- Failures show diff in Allure

---

## Integration Steps

wdio-baseline can be used as a starting point for test automation in any project.  
To integrate into an existing repository:

1. **Separate application and test logic**
   - Place application code under `your_repo/src/` (or equivalent).
   - Create a dedicated test directory `your_repo/test/`.

2. **Copy framework directories**  
   Move the following from wdio-baseline into `your_repo/test/`:
   - `test-api/`
   - `test-support/`
   - `test-ui/`

3. **Delete Automation Exercise–specific components**
   - Remove all example **page-object files** (UI).
   - Delete provided **spec files** (UI and API).
   - Clean out **utils** tied to the demo app such as:
     - `accountHelpers.js`
     - `testConstants.js` (UI)
     - `test-api/testConstants.js` (API)
   - Remove provided **Axios API specs** in `test-api/specs/`.

   This creates a clean slate for building page objects and specs specific to the target application.

4. **Align dependencies and scripts**
   - Copy relevant `devDependencies` and `scripts` from wdio-baseline’s `package.json` into the repository’s `package.json`.
   - Ensure Node.js and pnpm versions are aligned.  
     wdio-baseline uses `.tool-versions` (asdf) together with `packageManager` in `package.json` to enforce this, but any equivalent mechanism can be used (e.g., `engines`, nvm, Volta, or Corepack).
   - Adjust version pinning to match the conventions of the host repository.

5. **Tailor configurations**
   - Update paths if the test directory differs from `wdio-baseline/`.
   - Adjust workflow YAML files under `.github/workflows/` to match branch names and CI requirements.
   - Rename environment variables as needed (see `.env` / `envCredentials.js`).

6. **Validate infrastructure**
   - Run `pnpm infra:up` to confirm Selenium Grid is operational.
   - Execute `pnpm test:e2e` to verify specs run end-to-end.

Once integrated, the suite can be expanded with:

- **App-specific page objects and specs**
- **Custom utilities** in `support/utils/`
- **New workflows** calling the reusable runner

---

## License

This project is licensed under the ISC License — see the
[LICENSE](./LICENSE) file for details.
