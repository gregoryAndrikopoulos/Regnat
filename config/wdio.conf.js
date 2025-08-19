import { promises as fs } from "node:fs";
import { join } from "node:path";

const pad = (n, l = 2) => String(n).padStart(l, "0");
const ts = (d = new Date()) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;

export const config = {
  hostname: "localhost",
  port: 4444,
  path: "/",
  specs: ["../specs/**/*.spec.js"],
  maxInstances: 4,

  capabilities: [
    {
      browserName: "chrome",
      acceptInsecureCerts: true,
      "wdio:enforceWebDriverClassic": true,
      "goog:loggingPrefs": { browser: "ALL" },
      "goog:chromeOptions": {
        args: [
          "--window-size=1920,1080",
          ...(process.env.CI
            ? [
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--no-default-browser-check",
              ]
            : []),
        ],
      },
    },
  ],

  logLevel: "error",
  waitforTimeout: 20000,
  connectionRetryCount: 2,
  specFileRetries: 1,
  specFileRetriesDelay: 0,
  specFileRetriesDeferred: false,

  framework: "mocha",
  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
      },
    ],
    [
      "junit",
      {
        outputDir: "reports/junit",
        outputFileFormat: (opts) => `junit-${opts.cid}.xml`,
      },
    ],
  ],

  afterTest: async (test, context, { passed }) => {
    if (passed) return;

    const stamp = ts();
    let b64 = null;

    // 1) Screenshot once (reuse for disk & Allure)
    try {
      b64 = await browser.takeScreenshot();
    } catch {
      /* non-fatal: screenshot capture is best-effort and must not fail teardown */
    }

    if (b64) {
      const dir = "./reports/html-reports/screenshots";
      const file = join(dir, `${stamp}.png`);
      try {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(file, Buffer.from(b64, "base64"));
        process.emit?.(
          "test:log",
          `Browser: ${browser.capabilities.browserName}, OS: ${browser.capabilities.platformName}`
        );
        process.emit?.("test:screenshot", file);
      } catch {
        /* non-fatal: file system write issues shouldn't fail the test run */
      }
      try {
        const allure = (await import("@wdio/allure-reporter")).default;
        allure.addAttachment(
          `screenshot ${stamp}`,
          Buffer.from(b64, "base64"),
          "image/png"
        );
      } catch (err) {
        if (process.env.WDIO_DEBUG_ATTACH) {
          console.warn(
            "[allure] failed to attach screenshot:",
            err?.message || err
          );
        }
      }
    }

    // 2) Console logs (Chrome & classic driver)
    try {
      const [url, logs] = await Promise.all([
        browser.getUrl().catch(() => undefined),
        browser.getLogs?.("browser").catch(() => []),
      ]);
      if (Array.isArray(logs) && logs.length) {
        const interesting = logs.filter((e) =>
          ["SEVERE", "ERROR", "WARNING"].includes(e.level)
        );
        const payload = {
          test: test.fullTitle ?? test.title,
          url,
          entries: (interesting.length ? interesting : logs)
            .slice(-200)
            .map((e) => ({
              level: e.level,
              message: e.message,
              timestamp: e.timestamp,
            })),
        };
        const allure = (await import("@wdio/allure-reporter")).default;
        allure.addAttachment(
          "console.log",
          JSON.stringify(payload, null, 2),
          "application/json"
        );
      }
    } catch {
      /* non-fatal: some grids/browsers don't support 'browser' logs */
    }
  },

  mochaOpts: {
    ui: "bdd",
    timeout: 120000,
    retries: 2,
  },
};
