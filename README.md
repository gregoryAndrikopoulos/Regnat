# Regnat

> Structured WebdriverIO v9 test automation setup for reliable end-to-end testing.

It provides a clean, maintainable foundation for scalable automation, with
support for Selenium Grid, Docker, CI/CD pipelines, and Allure reporting.

---

### Website Under Test

Regnat is designed to test any modern web application.  
For demonstration purposes, it is currently configured to run against
[automationexercise](https://www.automationexercise.com/).

---

## Workflow Status

[![e2e Tests](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/e2e_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/regnat/actions/workflows/e2e_test.yml)

---

## Technologies Used

- **WebdriverIO v9** — Automation testing framework.
- **Mocha** — Test framework for writing and executing tests.
- **Node.js** — JavaScript runtime environment.
- **Docker + Selenium Grid 4** — For browser execution in isolated containers.
- **Allure** — For advanced reporting and test result visualization.
- **GitHub Actions** — For continuous integration and automated test
  runs.
- **dotenv** — Local environment variable management.
- **GitHub Secrets** — Secure storage of CI credentials.

### Developer Tooling

- **ESLint + Prettier** — Linting and formatting.

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

This suite currently targets **automationexercise**, which shows a **display name** after login.

> Sign-up flow detail: automationexercise first prompts for **Name** and **Email Address** before creating an account.

### Security

- Never commit `.env` or print raw secrets in logs.
- Rotate real credentials if leaked or shared beyond CI.

---

## Installation and Setup

### Prerequisites

- **Node.js v18+**
- **pnpm v10+**
- **Docker Desktop** (with Compose)

You can install Node.js directly from the [official
website](https://nodejs.org/), or use a package manager like Homebrew
(macOS), apt (Linux), or Chocolatey (Windows).

**macOS (Homebrew):**

```bash
brew install node
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install -y nodejs npm
```

**Windows (Chocolatey):**

```powershell
choco install nodejs-lts
```

Verify installation:

```bash
node -v
npm -v
```

---

### Install Dependencies

First, install **pnpm** globally (our package manager):

```bash
npm install -g pnpm
```

Then install all project dependencies:

```bash
pnpm install
```

Verify pnpm:

```bash
pnpm -v
```

---

## Running Tests

### Run Selenium Grid (Docker)

Bring Grid up:

```bash
pnpm grid:up
```

Check Grid UI: <http://localhost:4444/ui>

Bring Grid down:

```bash
pnpm grid:down
```

---

### Run tests locally

To execute your test suite using the local WebdriverIO configuration,
run:

```bash
pnpm test:local
```

### Run tests in CI (GitHub Actions)

The workflow runs automatically on pushes/PRs, but can also be triggered
manually:

```bash
pnpm test:ci
```

---

### View Allure Reports (Local)

When you run tests locally, **raw results** are written to `allure-results/`.  
Use this script to generate and open the corresponding HTML report:

```bash
pnpm report:allure:open:local
```

> By default this script looks for the report under `./allure-report`.  
> You can override the path with `ALLURE_PATH` if needed:

```bash
ALLURE_PATH="/custom/path/allure-report" pnpm report:allure:open:local
```

---

### View Allure Reports (CI)

After the CI run completes, download the **`allure`** artifact from the GitHub Actions run.  
It contains both:

- `allure-results/` → raw JSON output.
- `allure-report/` → generated HTML report.

To open the report locally (after downloading/unzipping the artifact):

```bash
pnpm report:allure:open:ci
```

> By default this script looks for the report under `~/Downloads/allure/allure-report`.  
> If your report is in another directory, you can override the path:

```bash
ALLURE_PATH="/path/to/allure-report" pnpm report:allure:open:ci
```

---

## License

This project is licensed under the ISC License – see the [LICENSE](./LICENSE) file for details.
