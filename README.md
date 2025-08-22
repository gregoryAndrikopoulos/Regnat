# Regnat

> Structured WebdriverIO v9 test automation setup for reliable end-to-end testing.

It provides a clean, maintainable foundation for scalable automation, with
support for Selenium Grid, Docker, CI pipelines, and Allure reporting.

---

### Website Under Test

Regnat is designed to test any modern web application.  
For demonstration purposes, it is configured to run against
[Automation Exercise](https://www.automationexercise.com/).

---

## Workflow Status

[![E2E Tests](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/e2e_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/e2e_test.yml)
[![Smoke Tests](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/smoke_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/smoke_test.yml)

---

## Technologies Used

- **WebdriverIO v9** — Automation testing framework.
- **Mocha** — Test framework for writing and executing tests.
- **Node.js** — JavaScript runtime environment.
- **Selenium Grid 4 (via Docker)** — Browser execution in isolated containers.
- **Allure** — Advanced reporting (screenshots and console logs).
- **GitHub Actions** — Continuous integration and automated test runs.
- **dotenv** — Manage local environment variables.
- **GitHub Secrets** — Store CI credentials securely.

### Developer Tooling

- **ESLint** — Linting.
- **Prettier** — Formatting.
- **asdf** — Runtime version manager (pins Node & pnpm versions per project).

---

### Runtime versions (Node & pnpm)

This repo pins tool versions via **asdf** in `.tool-versions`:

```
nodejs 20.14.0
pnpm 10.13.1
```

**Setup**

```bash
asdf install
asdf current
node -v && pnpm -v
```

**Change versions locally:**

```bash
asdf install nodejs <new> && asdf local nodejs <new>
asdf install pnpm <new>   && asdf local pnpm <new>
asdf reshim
```

**CI note:** GitHub Actions reads **`.nvmrc`** for Node. When updating Node locally, update `.nvmrc` to keep CI in sync.
Corepack is disabled to avoid shim conflicts; `pnpm` is provided by asdf.

---

## Environment & Secrets

### Local (.env)

Create a `.env` at the repo root (do **not** commit it). Example:

```ini
TEST_USER_EMAIL_1=
TEST_USER_PASSWORD_1=
TEST_USER_EMAIL_2=
TEST_USER_PASSWORD_2=
TEST_USER_EMAIL_3=
TEST_USER_PASSWORD_3=
```

### CI (GitHub Actions)

Create repository **Secrets** with the same names used locally:

- `TEST_USER_EMAIL_1`, `TEST_USER_PASSWORD_1`
- `TEST_USER_EMAIL_2`, `TEST_USER_PASSWORD_2`
- `TEST_USER_EMAIL_3`, `TEST_USER_PASSWORD_3`

### Site-specific note (display name)

The suite targets **Automation Exercise**, which shows a display name after login.

> Sign-up flow detail: Automation Exercise first prompts for **Name** and **Email Address** before creating an account.

### Security

- Never commit `.env` or print raw secrets in logs.
- Rotate real credentials if leaked or shared beyond CI.

---

## Installation and Setup

### Prerequisites

- **asdf** (version manager)
- **Docker Desktop** (with Compose)

> This repo pins tool versions in `.tool-versions` (Node 20.14.0, pnpm 10.13.1).

### Install toolchain & dependencies (recommended)

```bash
asdf install                # installs node & pnpm from .tool-versions
node -v && pnpm -v          # verify
pnpm install                # project deps
```

### Without asdf

Install matching versions manually:

- **Node.js 20.x** (any installer)
- **pnpm 10.13.x**
  ```bash
  npm install -g pnpm@10.13.1
  pnpm -v
  ```

---

## Running Tests

### Run test infrastructure (Docker)

Start test infrastructure:

```bash
pnpm infra:up
```

Check Grid UI: <http://localhost:4444/ui>

View live logs (optional):

```bash
pnpm infra:logs
```

Stop test infrastructure:

```bash
pnpm infra:down
```

Infrastructure status:

```bash
pnpm infra:status
```

---

### Run tests locally

To run the test suites locally:

```bash
pnpm test:e2e
pnpm test:smoke
```

### Run tests in CI (GitHub Actions)

Workflows run automatically (on pull requests and on a schedule).
Manual dispatch is available via **GitHub → Actions**:

- Open **Actions**
- Select the workflow (e.g., **E2E Test**, **Smoke**)
- Choose a branch and click **Run workflow**

---

### View Allure Reports (Local)

Local test runs write raw results to `allure-results/`.  
Generate and open the HTML report:

```bash
pnpm report:allure:open:local
```

> The default report directory is `./allure-report`.
> Override with `ALLURE_PATH` if needed:

```bash
ALLURE_PATH="/custom/path/reports/allure-report" pnpm report:allure:open:local
```

---

### View Allure Reports (CI)

After the CI run completes, download the **`allure`** artifact from the GitHub Actions run.  
It contains both:

- `reports/allure-results/` → raw JSON output.
- `reports/allure-report/` → generated HTML report.

To open the report locally (after downloading/unzipping the artifact):

```bash
pnpm report:allure:open:ci
```

> The default path is `~/Downloads/allure/allure-report`.  
> Override with `ALLURE_PATH` if needed:

```bash
ALLURE_PATH="/path/to/reports/allure-report" pnpm report:allure:open:ci
```

---

## License

This project is licensed under the ISC License – see the [LICENSE](./LICENSE) file for details.
