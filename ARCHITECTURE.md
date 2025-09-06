# Directory Structure

```
Regnat/
├─ .github/workflows/                   # CI/CD workflows (reusable + suite-specific)
├─ config/                              # WebdriverIO configurations
│  ├─ wdio.shared.conf.js
│  ├─ wdio.e2e.conf.js
│  └─ wdio.cross.browser.smoke.conf.js
├─ infra/                               # Selenium Grid (Docker Compose)
│  └─ docker-compose.yml
├─ page-objects/
├─ specs/
│  ├─ e2e/
│  └─ smoke/
├─ support/
│  ├─ fixtures/text/                    # Static text fixtures
│  ├─ fixtures.js                       # Central fixture loader
│  └─ utils/                            # Test utilities
├─ visual-baseline/                     # Committed visual baselines
│  └─ smoke/
├─ reports/ (runtime)                   # Generated at runtime (not committed)
│  ├─ allure/
│  ├─ junit/
│  ├─ screenshots/
│  └─ visual/
├─ .env                                 # Local environment variables (ignored in git)
├─ .gitignore                           # Git ignore rules
├─ .prettierignore                      # Prettier ignore rules
├─ .tool-versions                       # Toolchain pinning (Node, pnpm)
├─ ARCHITECTURE.md                      # Repo structure documentation (this file)
├─ eslint.config.js                     # ESLint setup
├─ LICENSE                              # Project license
├─ package.json                         # Project manifest
├─ pnpm-lock.yaml                       # Dependency lockfile
└─ README.md                            # Project overview and usage
```
