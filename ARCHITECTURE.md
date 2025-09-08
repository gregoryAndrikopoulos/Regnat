# Directory Structure

```
Regnat/
├─ .github/workflows/                       # CI/CD workflows (reusable + suite-specific)
├─ infra/                                   # Selenium Grid (Docker Compose)
│  └─ docker-compose.yml
├─ test-ui/                                 # All WebdriverIO-related UI testing
│  ├─ config/                               # WebdriverIO configurations
│  │  ├─ wdio.shared.conf.js
│  │  ├─ wdio.e2e.conf.js
│  │  └─ wdio.smoke.conf.js
│  ├─ page-objects/                         # Page Object Model classes
│  ├─ specs/                                # Test specs
│  │  ├─ e2e/
│  │  └─ smoke/
│  └─ visual-baseline/                      # Committed visual baselines
│     └─ smoke/
├─ test-support/                            # Shared across UI / Smoke / API
│  ├─ fixtures/text/                        # Static text fixtures
│  ├─ fixtures.js                           # Central fixture loader
│  ├─ utils/                                # Reusable helpers
├─ test-api/                                # All Axios/Mocha-based API testing
│  ├─ specs/                                # API test specs
│  ├─ testConstants.js                      # API endpoints & config constants
│  └─ .mocharc.json                         # Mocha configuration for API tests
├─ reports/ (runtime)                       # Generated at runtime (not committed)
│  ├─ allure/
│  ├─ junit/
│  ├─ screenshots/
│  └─ visual/
├─ .semgrepignore                           # Optional: ignore noisy paths for SAST
├─ .env                                     # Local environment variables (ignored in git)
├─ .gitignore                               # Git ignore rules
├─ .prettierignore                          # Prettier ignore rules
├─ .tool-versions                           # Toolchain pinning (Node, pnpm)
├─ ARCHITECTURE.md                          # Repo structure documentation (this file)
├─ eslint.config.js                         # ESLint setup
├─ LICENSE                                  # Project license
├─ package.json                             # Project manifest
├─ pnpm-lock.yaml                           # Dependency lockfile
└─ README.md                                # Project overview and usage
```
