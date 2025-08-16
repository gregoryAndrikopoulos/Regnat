# automationexercise-wdio-tests

## Overview

This project is a structured WebdriverIO v9 test automation setup for
testing an existing website.

------------------------------------------------------------------------

### Website Under Test

Website under test:
[automationexercise](https://www.automationexercise.com/)

------------------------------------------------------------------------

## Workflow Status

[![e2e Tests](https://github.com/gregoryAndrikopoulos/automationexercise-wdio-tests/actions/workflows/e2e_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/automationexercise-wdio-tests/actions/workflows/e2e_test.yml)

------------------------------------------------------------------------

## Technologies Used

-   **WebdriverIO v9** -- Automation testing framework.
-   **Mocha** -- Test framework for writing and executing tests.
-   **Node.js** -- JavaScript runtime environment.
-   **Chromedriver Service** -- For local browser testing.
-   **GitHub Actions** -- For continuous integration and automated test
    runs.

------------------------------------------------------------------------

## Installation and Setup

### Prerequisites

-   **Node.js v18+**
-   **pnpm v10+**

You can install Node.js directly from the [official
website](https://nodejs.org/), or use a package manager like Homebrew
(macOS), apt (Linux), or Chocolatey (Windows).

**macOS (Homebrew):**

``` bash
brew install node
```

**Ubuntu/Debian:**

``` bash
sudo apt update
sudo apt install -y nodejs npm
```

**Windows (Chocolatey):**

``` powershell
choco install nodejs-lts
```

Verify installation:

``` bash
node -v
npm -v
```

------------------------------------------------------------------------

### Install Dependencies

First, install **pnpm** globally (our package manager):

``` bash
npm install -g pnpm
```

Then install all project dependencies:

``` bash
pnpm install
```

Verify pnpm:

``` bash
pnpm -v
```

------------------------------------------------------------------------

## Running Tests

### Run tests locally

To execute your test suite using the local WebdriverIO configuration,
run:

``` bash
pnpm test:local
```
