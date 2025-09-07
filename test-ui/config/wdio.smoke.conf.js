import { makeConfig } from "./wdio.shared.conf.js";

/**
 * Smoke config
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

  const edgeArgs = baseChromeCaps["goog:chromeOptions"].args;

  const caps = [];
  // Chrome (inherits everything from the shared base)
  if (pick.includes("chrome")) caps.push(structuredClone(baseChromeCaps));

  // Firefox (minimal set for smoke)
  if (pick.includes("firefox")) {
    caps.push({
      browserName: "firefox",
      acceptInsecureCerts: true,
      "wdio:enforceWebDriverClassic": true,
      "moz:firefoxOptions": {
        args: ["-width=1920", "-height=1080"],
        prefs: {
          "browser.contentblocking.category": "strict",
          "privacy.trackingprotection.enabled": true,
          "privacy.trackingprotection.pbmode.enabled": true,
          "dom.webnotifications.enabled": false, // no “allow notifications” bars
          "dom.disable_open_during_load": true, // kill JS popups
        },
      },
    });
  }

  // Edge (accepts "edge" or "microsoftedge")
  if (pick.includes("edge") || pick.includes("microsoftedge")) {
    caps.push({
      browserName: "MicrosoftEdge",
      acceptInsecureCerts: true,
      "wdio:enforceWebDriverClassic": true,
      "ms:edgeOptions": {
        args: edgeArgs,
        prefs: {
          "profile.default_content_setting_values.notifications": 2,
          "profile.default_content_setting_values.geolocation": 2,
          "profile.default_content_setting_values.mouselock": 2,
          "profile.default_content_setting_values.media_stream_mic": 2,
          "profile.default_content_setting_values.media_stream_camera": 2,
          "profile.password_manager_enabled": false,
          credentials_enable_service: false,
        },
      },
    });
  }

  // If nothing matched, default to Chrome
  if (!caps.length) caps.push(baseChromeCaps);
  return caps;
}

// Reuse shared config
export const config = makeConfig({
  specsGlob: "../specs/smoke/**/*.spec.js",
  junitLabel: "smoke",
});

// Swap capabilities only (use Chrome from shared config as the base)
{
  const baseChromeCaps =
    Array.isArray(config.capabilities) && config.capabilities.length
      ? config.capabilities[0]
      : null;

  if (
    !baseChromeCaps ||
    String(baseChromeCaps.browserName).toLowerCase() !== "chrome"
  ) {
    throw new Error(
      "Shared config must provide a Chrome capability as the first item."
    );
  }

  config.capabilities = buildCapabilitiesFromEnv(baseChromeCaps);
}
