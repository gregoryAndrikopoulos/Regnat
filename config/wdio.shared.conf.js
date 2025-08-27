import { promises as fs } from "node:fs";
import { join } from "node:path";

// Output paths (CI vs. local)
// In CI we keep paths short for easy artifact collection
// Locally we write under reports/ so developers can browse outputs
const isCI = !!process.env.CI;
const paths = {
  // Allure results directory (raw JSON used by the reporter)
  allureResults: isCI ? "allure-results" : "reports/allure/allure-results",
  // JUnit XML and failure screenshots
  junitDir: "reports/junit",
  screenshotsDir: "reports/screenshots",
  // Visual testing baselines and run outputs
  visualBaseline: "visual-baseline",
  visualOutput: "reports/visual",
};

export function makeConfig({ specsGlob }) {
  return {
    before: async () => {
      // Register signal handlers for graceful shutdown and add the visual
      // comparison command to the browser instance
      await beforeHook(paths, isCI);
    },

    // Derive “suite segment” and spec base name from the current spec path
    // These are used for organizing screenshots, baselines, and artifacts
    beforeTest: function (test) {
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
          // Enable DevTools “performance” log stream for network/page events
          perfLoggingPrefs: { enableNetwork: true, enablePage: true },
        },
      },
    ],

    logLevel: "error",
    waitforTimeout: isCI ? 20000 : 10000,
    connectionRetryCount: 2,
    specFileRetries: isCI ? 1 : 0,
    specFileRetriesDelay: 0,
    specFileRetriesDeferred: false,

    framework: "mocha",
    reporters: [
      "spec",
      [
        "allure",
        {
          outputDir: paths.allureResults,
          disableWebdriverStepsReporting: true,
          disableWebdriverScreenshotsReporting: true,
        },
      ],
      [
        "junit",
        {
          outputDir: paths.junitDir,
          outputFileFormat: (opts) => `junit-${opts.cid}.xml`,
        },
      ],
    ],

    afterTest: async function (test, context, { passed }) {
      // On failure: attach screenshot and logs to aid triage
      await afterTestHook(test, context, { passed }, paths);
    },

    mochaOpts: {
      ui: "bdd",
      timeout: isCI ? 120000 : 60000,
    },
  };
}

async function beforeHook(paths, isCI) {
  let cleaned = false;

  const closeSession = async (reason) => {
    if (cleaned) return;
    cleaned = true;
    try {
      if (browser?.sessionId) {
        // Avoid hanging if the Grid/Node is already gone
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

  // Best-effort cleanup on process signals
  process.on("SIGINT", () => {
    void closeSession("SIGINT");
  });

  process.on("SIGTERM", () => {
    void closeSession("SIGTERM");
  });

  // Register a visual-comparison command using pixelmatch + pngjs
  // Produces .actual and .diff images; seeds a baseline locally if missing, but fails in CI when a baseline is absent
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

      // Build a stable tag: <specBase>[-<tag>]-screenshot
      const provided = typeof tag === "string" ? tag.trim() : "";
      const finalTag = provided
        ? `${specBase}-${provided}-screenshot`
        : `${specBase}-screenshot`;

      const baseDir = join(
        process.cwd(),
        paths.visualBaseline,
        suiteSeg,
        bName,
        `${width}x${height}`
      );

      const outDir = join(
        process.cwd(),
        paths.visualOutput,
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

      // First run policy
      if (!baselineBuf) {
        if (isCI) {
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
          // Local seeds baseline automatically
          await fs.copyFile(actualFile, baselineFile);
          allure.addAttachment(
            "visual:seeded-baseline",
            await fs.readFile(actualFile),
            "image/png"
          );
          return { seeded: true, ratio: 0 };
        }
      }

      // Validate dimensions before diffing
      const basePng = PNG.sync.read(baselineBuf);
      const actPng = PNG.sync.read(await fs.readFile(actualFile));

      if (basePng.width !== actPng.width || basePng.height !== actPng.height) {
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

      // Pixel-by-pixel comparison
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
}

async function afterTestHook(test, context, { passed }, paths) {
  if (passed) return;

  const stamp = formatTimestamp();
  let b64 = null;

  // Capture a single screenshot and reuse it for both disk and Allure
  try {
    b64 = await browser.takeScreenshot();
  } catch {
    /* best-effort */
  }

  if (b64) {
    const dir = paths.screenshotsDir;

    // Keep filenames short and filesystem-safe
    const safe = (s) =>
      (s || "")
        .trim()
        .replace(/[^\w.-]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 120);

    const specBase = safe(browser.__specBase || "unknown");
    const name = `Failed-${specBase}-${stamp}`;
    const file = join(dir, `${name}.png`);

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
        `screenshot ${name}`,
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

  // Attach console and DevTools performance logs when available
  try {
    const [url, logs, perf] = await Promise.all([
      browser.getUrl().catch(() => undefined),
      browser.getLogs?.("browser").catch(() => []),
      browser.getLogs?.("performance").catch(() => []),
    ]);

    if (Array.isArray(logs) && logs.length) {
      // Prefer warnings/errors; otherwise include the tail of all entries
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
    /* Some grids/browsers don't support 'browser' or 'performance' logs */
  }
}

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

// Left-pad with zeros to length l (default 2)
function zeroPad(n, l = 2) {
  return String(n).padStart(l, "0");
}

// Timestamp format: YYYYMMDD-HHMMSS.mmm
function formatTimestamp(d = new Date()) {
  return `${d.getFullYear()}${zeroPad(d.getMonth() + 1)}${zeroPad(d.getDate())}-${zeroPad(
    d.getHours()
  )}${zeroPad(d.getMinutes())}${zeroPad(d.getSeconds())}.${zeroPad(d.getMilliseconds(), 3)}`;
}
