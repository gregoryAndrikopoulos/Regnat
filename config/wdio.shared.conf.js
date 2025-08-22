import { promises as fs } from "node:fs";
import { join } from "node:path";

const pad = (n, l = 2) => String(n).padStart(l, "0");
const ts = (d = new Date()) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;

// Pick output paths based on environment
const IS_CI = !!process.env.CI;
const PATHS = {
  // Allure (results + HTML)
  allureResults: IS_CI ? "allure-results" : "reports/allure/allure-results",
  allureReport: IS_CI ? "allure-report" : "reports/allure/allure-report",
  // JUnit and screenshots (kept under reports/ for both)
  junitDir: "reports/junit",
  screenshotsDir: "reports/screenshots",
};

export function makeConfig({ specsGlob }) {
  return {
    before: async () => {
      let cleaned = false;

      const closeSession = async (reason) => {
        if (cleaned) return;
        cleaned = true;
        try {
          if (browser?.sessionId) {
            // Don’t hang forever if Grid/Node is already gone
            const timeout = new Promise((res) => setTimeout(res, 3000));
            const attempt = browser.deleteSession().catch((e) => {
              const msg = String(e?.message || e);
              if (!/UND_ERR_CLOSED|ECONNREFUSED|socket hang up/i.test(msg)) {
                console.warn("deleteSession failed:", msg);
              }
            });
            await Promise.race([attempt, timeout]);
            console.log(`Session closed on ${reason}`);
          }
        } catch (err) {
          console.warn("Cleanup error:", err?.message || err);
        }
      };

      process.on("SIGINT", () => {
        void closeSession("SIGINT");
      });
      process.on("SIGTERM", () => {
        void closeSession("SIGTERM");
      });
    },

    hostname: "localhost",
    port: 4444,
    path: "/",
    specs: [specsGlob],
    maxInstances: 2,

    capabilities: [
      {
        browserName: "chrome",
        acceptInsecureCerts: true,
        "wdio:enforceWebDriverClassic": true,
        "goog:loggingPrefs": { browser: "ALL", performance: "ALL" },
        "goog:chromeOptions": {
          args: [
            "--window-size=1920,1080",
            "--window-position=0,0",
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--no-default-browser-check",
          ],
          // Enable DevTools perf log capture
          perfLoggingPrefs: { enableNetwork: true, enablePage: true },
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
          outputDir: PATHS.allureResults,
          disableWebdriverStepsReporting: true,
          disableWebdriverScreenshotsReporting: true,
        },
      ],
      [
        "junit",
        {
          outputDir: PATHS.junitDir,
          outputFileFormat: (opts) => `junit-${opts.cid}.xml`,
        },
      ],
    ],

    afterTest: async function (test, context, { passed }) {
      if (passed) return;

      const stamp = ts();
      let b64 = null;

      // 1) Screenshot once (reuse for disk & Allure)
      try {
        b64 = await browser.takeScreenshot();
      } catch {
        /* best-effort */
      }

      if (b64) {
        const dir = PATHS.screenshotsDir;
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
          /* ignore fs issues */
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

      // 2) Console + DevTools Performance logs (if available)
      try {
        const [url, logs, perf] = await Promise.all([
          browser.getUrl().catch(() => undefined),
          browser.getLogs?.("browser").catch(() => []),
          browser.getLogs?.("performance").catch(() => []),
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

        if (Array.isArray(perf) && perf.length) {
          const payload = {
            test: test.fullTitle ?? test.title,
            url,
            entries: perf.slice(-500),
          };
          const allure = (await import("@wdio/allure-reporter")).default;
          allure.addAttachment(
            "performance.log",
            JSON.stringify(payload, null, 2),
            "application/json"
          );
        }
      } catch {
        /* some grids/browsers don't support 'browser' or 'performance' logs */
      }
    },

    mochaOpts: {
      ui: "bdd",
      timeout: 120000,
    },
  };
}
