# automationexercise-wdio-tests

## Overview
This project is a structured WebdriverIO v9 test automation setup for testing an existing website.  

---

### Website Under Test
Website under test: [automationexercise](https://www.automationexercise.com/)

---

## Workflow Status
[![Functional Tests](https://github.com/gregoryAndrikopoulos/automationexercise-wdio-tests/actions/workflows/e2e_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/automationexercise-wdio-tests/actions/workflows/e2e_test.yml)

---

## Technologies Used
- **WebdriverIO v9** – Automation testing framework.
- **Mocha** – Test framework for writing and executing tests.
- **Node.js** – JavaScript runtime environment.
- **Chromedriver Service** – For local browser testing.

---

## Installation and Setup

### Prerequisites
- Node.js v18+
- pnpm v10+

---

### Install Dependencies
```bash 
pnpm install
```

---

## Running Tests

### Run tests locally
To execute your test suite using the local WebdriverIO configuration, run:

```bash
pnpm test:local
```