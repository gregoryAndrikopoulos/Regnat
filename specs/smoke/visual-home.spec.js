import { browser, $ } from "@wdio/globals";
import {
  SHORT_TIMEOUT,
  VISUAL_TOLERANCE,
} from "../../support/utils/testConstants.js";
import { goHomeAcceptConsent } from "../../support/utils/index.js";

describe("[@smoke] Visual check of home page", () => {
  it("home page matches baseline", async () => {
    await goHomeAcceptConsent();

    await browser.waitUntil(
      async () =>
        (await browser.execute(() => document.readyState)) === "complete",
      { timeout: SHORT_TIMEOUT, timeoutMsg: "document not ready" }
    );

    // wait for a stable element
    await $("header")
      .waitForDisplayed({ timeout: SHORT_TIMEOUT })
      .catch(() => {});

    // Compare full viewport; first local run seeds baseline automatically
    await browser.compareViewport("smoke-home", {
      tolerance: VISUAL_TOLERANCE,
    });
  });
});
