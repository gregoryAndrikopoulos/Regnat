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
  // Visual testing
  visualBaseline: "visual-baseline",
  visualOutput: "reports/visual",
};

// Infer "suite" from the spec file path
function suiteFromFile(filePath) {
  if (!filePath) return "unknown";
  const parts = filePath.split(/[\\/]/);
  const idx = parts.lastIndexOf("specs");
  if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
  // Fallback: use parent directory name
  return parts.length > 1 ? parts[parts.length - 2] : "unknown";
}

// Infer base spec filename without extension
function specBaseFromFile(filePath) {
  if (!filePath) return "unknown";
  const base = filePath.split(/[\\/]/).pop() || "";
  return base.replace(/\.[^.]+$/, "");
}

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

      // Visual compare command (uses pixelmatch + pngjs)
      const pngjsMod = await import("pngjs");
      const PNG =
        pngjsMod.PNG ||
        (pngjsMod.default && (pngjsMod.default.PNG || pngjsMod.default));
      const pixelmatchMod = await import("pixelmatch");
      const pixelmatch = pixelmatchMod.default || pixelmatchMod;

      browser.addCommand(
        "compareViewport",
        async function compareViewport(tag, { tolerance = 0.01 } = {}) {
          const bName = (
            browser.capabilities.browserName || "browser"
          ).toLowerCase();
          const { width, height } = await browser.getWindowSize();
          const suiteSeg = browser.__suiteSegment || "unknown";
          const specBase = browser.__specBase || "unknown";

          // Build final tag:
          const provided = typeof tag === "string" ? tag.trim() : "";
          const finalTag = provided
            ? `${specBase}-${provided}-screenshot`
            : `${specBase}-screenshot`;

          const baseDir = join(
            process.cwd(),
            PATHS.visualBaseline,
            suiteSeg,
            bName,
            `${width}x${height}`
          );
          const outDir = join(
            process.cwd(),
            PATHS.visualOutput,
            suiteSeg,
            bName,
            `${width}x${height}`
          );
          await fs.mkdir(baseDir, { recursive: true });
          await fs.mkdir(outDir, { recursive: true });

          const baselineFile = join(baseDir, `${finalTag}.png`);
          const actualFile = join(outDir, `${finalTag}.actual.png`);
          const diffFile = join(outDir, `${finalTag}.diff.png`);

          await browser.saveScreenshot(actualFile);

          const allure = (await import("@wdio/allure-reporter")).default;
          const baselineBuf = await fs.readFile(baselineFile).catch(() => null);

          // First run behavior
          if (!baselineBuf) {
            if (IS_CI) {
              // CI requires committed baselines
              allure.addAttachment(
                "visual:actual",
                await fs.readFile(actualFile),
                "image/png"
              );
              throw new Error(
                `Baseline missing for "${finalTag}" → ${baselineFile}`
              );
            } else {
              // Local: seed baseline automatically
              await fs.copyFile(actualFile, baselineFile);
              allure.addAttachment(
                "visual:seeded-baseline",
                await fs.readFile(actualFile),
                "image/png"
              );
              return { seeded: true, ratio: 0 };
            }
          }

          // Compare baseline vs actual
          const basePng = PNG.sync.read(baselineBuf);
          const actPng = PNG.sync.read(await fs.readFile(actualFile));

          if (
            basePng.width !== actPng.width ||
            basePng.height !== actPng.height
          ) {
            allure.addAttachment("visual:baseline", baselineBuf, "image/png");
            allure.addAttachment(
              "visual:actual",
              await fs.readFile(actualFile),
              "image/png"
            );
            throw new Error(
              `Size mismatch (${basePng.width}x${basePng.height} vs ${actPng.width}x${actPng.height}) for "${finalTag}"`
            );
          }

          const diff = new PNG({
            width: basePng.width,
            height: basePng.height,
          });
          const mismatched = pixelmatch(
            basePng.data,
            actPng.data,
            diff.data,
            basePng.width,
            basePng.height,
            { threshold: 0.1 }
          );
          const ratio = mismatched / (basePng.width * basePng.height);

          if (ratio > tolerance) {
            await fs.writeFile(diffFile, PNG.sync.write(diff));
            allure.addAttachment("visual:baseline", baselineBuf, "image/png");
            allure.addAttachment(
              "visual:actual",
              await fs.readFile(actualFile),
              "image/png"
            );
            allure.addAttachment(
              "visual:diff",
              await fs.readFile(diffFile),
              "image/png"
            );
            throw new Error(
              `Visual diff for "${finalTag}" → ${(ratio * 100).toFixed(2)}% > ${tolerance * 100}%`
            );
          }

          return { seeded: false, ratio };
        }
      );
    },

    // Capture the suite segment and spec base from the spec path before each test
    beforeTest: function (test /*, context */) {
      browser.__suiteSegment = suiteFromFile(test?.file);
      browser.__specBase = specBaseFromFile(test?.file);
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
