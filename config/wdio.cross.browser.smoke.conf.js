import { makeConfig } from "./wdio.shared.conf.js";

/**
 * BROWSERS control which to include (default: chrome,firefox,edge).
 * No hooks here — shared config handles lifecycle/cleanup.
 */
function buildCapabilitiesFromEnv(baseChromeCaps) {
  const pick = (process.env.BROWSERS || "chrome,firefox,edge")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const chromeArgs = baseChromeCaps?.["goog:chromeOptions"]?.args ?? [
    "--window-size=1920,1080",
    "--window-position=0,0",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--no-default-browser-check",
  ];

  const caps = [];
  if (pick.includes("chrome")) caps.push(baseChromeCaps);

  if (pick.includes("firefox")) {
    caps.push({
      browserName: "firefox",
      acceptInsecureCerts: true,
      "wdio:enforceWebDriverClassic": true,
      "moz:firefoxOptions": { args: ["-width=1920", "-height=1080"] },
    });
  }

  if (pick.includes("edge") || pick.includes("microsoftedge")) {
    caps.push({
      browserName: "MicrosoftEdge",
      acceptInsecureCerts: true,
      "wdio:enforceWebDriverClassic": true,
      "ms:edgeOptions": { args: chromeArgs },
    });
  }

  if (!caps.length) caps.push(baseChromeCaps);
  return caps;
}

// Reuse shared config
export const config = makeConfig({
  specsGlob: "../specs/smoke/**/*.spec.js",
});

// Swap capabilities only
(() => {
  const baseChromeCaps =
    Array.isArray(config.capabilities) && config.capabilities.length
      ? config.capabilities[0]
      : {
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
            perfLoggingPrefs: { enableNetwork: true, enablePage: true },
          },
        };

  config.capabilities = buildCapabilitiesFromEnv(baseChromeCaps);
})();
