import { makeConfig } from "./wdio.shared.conf.js";

/**
 * Cross-browser smoke config
 *
 * Browser selection:
 * - Controlled via the BROWSERS env var
 * - Default: "chrome,firefox,edge"

 * Notes:
 * - No additional hooks here. Lifecycle and cleanup are owned by the shared config
 * - Capabilities are derived from the shared Chrome base and expanded per browser
 */
function buildCapabilitiesFromEnv(baseChromeCaps) {
  // Parse the env var into a normalized list of browser names
  const pick = (process.env.BROWSERS || "chrome,firefox,edge")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // Reuse Chrome args from the base caps when available; fall back to a sane default
  const chromeArgs = baseChromeCaps?.["goog:chromeOptions"]?.args ?? [
    "--window-size=1920,1080",
    "--window-position=0,0",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--no-default-browser-check",
  ];

  const caps = [];
  // Chrome (inherits everything from the shared base)
  if (pick.includes("chrome")) caps.push(baseChromeCaps);

  // Firefox (minimal set for smoke)
  if (pick.includes("firefox")) {
    caps.push({
      browserName: "firefox",
      acceptInsecureCerts: true,
      "wdio:enforceWebDriverClassic": true,
      "moz:firefoxOptions": { args: ["-width=1920", "-height=1080"] },
    });
  }

  // Edge (accepts "edge" or "microsoftedge")
  if (pick.includes("edge") || pick.includes("microsoftedge")) {
    caps.push({
      browserName: "MicrosoftEdge",
      acceptInsecureCerts: true,
      "wdio:enforceWebDriverClassic": true,
      "ms:edgeOptions": { args: chromeArgs },
    });
  }

  // If nothing matched, default to Chrome
  if (!caps.length) caps.push(baseChromeCaps);
  return caps;
}

// Reuse shared config
export const config = makeConfig({
  specsGlob: "../specs/smoke/**/*.spec.js",
});

// Swap capabilities only
{
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
}
