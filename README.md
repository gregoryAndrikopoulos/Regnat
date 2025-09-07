# Regnat

> Structured WebdriverIO v9 + Axios setup for reliable **UI** and **API** testing.

Provides a clean, maintainable foundation for scalable automation, with support
for Selenium Grid, Docker, CI pipelines, **Allure reporting**, and **visual
regression checks**.

---

## Website Under Test

Regnat is designed to test any modern web application.  
For demonstration purposes, it is configured to run against
[Automation Exercise](https://www.automationexercise.com/).

---

## Workflow Status

[![E2E Tests](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/e2e_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/e2e_test.yml)
[![API Tests](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/api_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/api_test.yml)
[![Cross-browser Smoke Test](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/cross_browser_smoke_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/cross_browser_smoke_test.yml)

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

### Developer Tooling

- **ESLint** — linting
- **Prettier** — formatting
- **asdf** — runtime version manager (pins Node & pnpm versions per project)

---

## Runtime Versions (Node & pnpm)

This repository pins tool versions via **asdf** in `.tool-versions`:

```txt
nodejs 24.7.0
pnpm 10.15.0
```

**Setup**

```bash
asdf install
asdf current
node -v && pnpm -v
```

**Change versions locally**

```bash
asdf install nodejs <new> && asdf local nodejs <new>
asdf install pnpm <new>   && asdf local pnpm <new>
asdf reshim
```

**CI note:** GitHub Actions uses **asdf** and reads **`.tool-versions`** for both **Node** and **pnpm**. Keep **`.tool-versions`** in sync with
`package.json`’s `"packageManager"` (e.g., `pnpm@10.15.0`). Corepack isn’t used in CI.

**Version sync:** `package.json` sets `"packageManager": "pnpm@10.15.0"`. Keep this in sync with **`.tool-versions`** and the
versions listed above.

---

## Environment & Secrets

### Local (.env)

Create a `.env` at the repository root (do **not** commit it). Example:

```ini
TEST_USER_EMAIL_1=
TEST_USER_PASSWORD_1=
TEST_USER_EMAIL_2=
TEST_USER_PASSWORD_2=
API_VALID_EMAIL=
API_VALID_PASSWORD=

```

### CI (GitHub Actions)

Create repository **Secrets** with the same names used locally:

- `TEST_USER_EMAIL_1`, `TEST_USER_PASSWORD_1`
- `TEST_USER_EMAIL_2`, `TEST_USER_PASSWORD_2`
- `API_VALID_EMAIL`, `API_VALID_PASSWORD`

### Site-Specific Note (display name)

The suite targets **Automation Exercise**, which shows a display name after
login.

> Sign-up flow detail: Automation Exercise first prompts for **Name** and
> **Email Address** before creating an account.

### Faker-based test data

For specs that create **throwaway accounts or inputs** the suite uses **[faker.js](https://fakerjs.dev/)**.  
This ensures:

- Each run generates unique, realistic values (emails, names, addresses, passwords).
- CI runs remain deterministic when seeded via `FAKER_SEED`.

Example seeding:

```bash
export FAKER_SEED=12345
pnpm test:e2e
```

This guarantees the same fake data across reruns, useful for debugging failures.

### Security

- Never commit `.env` or print raw secrets in logs.
- Rotate real credentials if leaked or shared beyond CI.

---

## Installation and Setup

### Prerequisites

- **asdf** (version manager)
- **Docker Desktop** (with Compose)

> This repository pins tool versions in **`.tool-versions`** (Node **24.7.0**,
> pnpm **10.15.0**).

### Install toolchain & dependencies (recommended)

```bash
asdf install                # installs node & pnpm from .tool-versions
node -v && pnpm -v          # verify
pnpm install                # project deps
```

### Without asdf

Install matching versions manually:

- **Node.js 24.x** (any installer)
- **pnpm 10.15.x**
  ```bash
  npm install -g pnpm@10.15.0
  pnpm -v
  ```

---

## Running Tests

### Run test infrastructure (Docker)

Start Selenium Grid + nodes:

```bash
# Chrome-only (default; fastest)
pnpm infra:up

# Cross-browser nodes (Firefox + Edge + Chrome)
pnpm infra:cross:up    # equivalent to: COMPOSE_PROFILES=smoke pnpm infra:up
```

Grid UI: <http://localhost:4444/ui>

Live logs (optional):

```bash
pnpm infra:logs
```

Stop infrastructure:

```bash
pnpm infra:down         # or: pnpm infra:cross:down
```

Infrastructure status (hub ready?):

```bash
pnpm infra:status
```

> **Compose profiles**
>
> - The `chrome` node is always available.
> - `firefox` and `edge` nodes start only when the **`smoke`** profile is
>   enabled (via `infra:cross:up`) or when `COMPOSE_PROFILES` is provided.

---

### Run tests locally

**E2E (Chrome-only):**

```bash
pnpm test:e2e
```

**Smoke (cross-browser):**

```bash
# Run all browsers in one invocation (default: chrome,firefox,edge)
pnpm infra:cross:up
pnpm test:smoke
```

**API Tests (Axios + Mocha):**

API specs live under `test-api/specs/` and target the public  
[Automation Exercise APIs](https://automationexercise.com/api).

Run locally:

```bash
pnpm test:api
```

JUnit results are written to:

```
reports/junit/api/api-junit.xml
```

---

### Run tests in CI (GitHub Actions)

- **E2E Test**: Chrome-only, parallelized across specs for speed on pull requests.
- **API Test**: Axios-based API tests on pull requests.
- **Cross-browser Smoke Test**: One job brings up Grid with the `smoke` profile
  and runs the smoke suite **sequentially across browsers in a single
  invocation** (to keep artifacts and reporting consolidated).

Manual dispatch:

- Open **Actions**.
- Select **E2E Test**, **API Test**, or **Cross-browser Smoke Test**.
- Choose a branch and click **Run workflow**.

---

## Reports

### Allure (local, UI only)

Local test runs write raw results to:

- `reports/allure/allure-results/` (local)
- In CI, results are at repo root: `allure-results/` (so the runner can upload
  them).

Generate and open locally:

```bash
pnpm report:allure:open:local
```

This generates HTML in `reports/allure/allure-report/` and opens it.

### Allure (CI, UI only)

After a CI run, download the **`allure`** artifact. When unzipped to
`~/Downloads/allure/`, it contains:

- `allure-report/` → generated HTML report (standalone)

Open the report locally:

```bash
pnpm report:allure:open:ci
```

Default path is `~/Downloads/allure/allure-report`. Override with `ALLURE_PATH`
if needed:

```bash
ALLURE_PATH="/custom/path/allure-report" pnpm report:allure:open:ci
```

### JUnit

- **UI Tests (E2E/Smoke)**  
  JUnit XML stored under `reports/junit/e2e/` or `reports/junit/smoke/`.

- **API Tests**  
  JUnit XML stored under `reports/junit/api/api-junit.xml`.

---

## Visual Regression (UI only)

- The suite captures visual snapshots and compares them to committed baselines.
- On differences, the test fails and Allure shows baseline / actual / diff.
- Locally, missing baselines are auto-seeded; in CI, baselines must already
  exist.

---

## Integration Steps

Regnat can be used as a starting point for test automation in any project.  
To integrate into an existing repository:

1. **Separate application and test logic**
   - Place application code under `your_repo/src/` (or equivalent).
   - Create a dedicated test directory `your_repo/test/`.

2. **Copy framework directories**  
   Move the following from Regnat into `your_repo/test/`:
   - `test-api/`
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
   - Copy relevant `devDependencies` and `scripts` from Regnat’s `package.json` into the repository’s `package.json`.
   - Ensure Node.js and pnpm versions are aligned.  
     Regnat uses `.tool-versions` (asdf) together with `packageManager` in `package.json` to enforce this, but any equivalent mechanism can be used (e.g., `engines`, nvm, Volta, or Corepack).
   - Adjust version pinning to match the conventions of the host repository.

5. **Tailor configurations**
   - Update paths if the test directory differs from `Regnat/`.
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
