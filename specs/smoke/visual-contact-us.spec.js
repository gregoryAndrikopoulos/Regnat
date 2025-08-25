import { browser, $ } from "@wdio/globals";
import { VISUAL_TOLERANCE } from "../../support/utils/testConstants.js";
import { goHomeAcceptConsent } from "../../support/utils/index.js";
import HomePage from "../../page-objects/HomePage.js";

describe("[@smoke] Visual check of Contact Us page", () => {
  it("Contact Us page matches baseline", async () => {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.contactUsMenuLink.click();

    await browser.waitUntil(
      async () =>
        (await browser.execute(() => document.readyState)) === "complete",
      { timeoutMsg: "document not ready" }
    );

    // wait for a stable element
    await $("header")
      .waitForDisplayed()
      .catch(() => {});

    // Compare full viewport; first local run seeds baseline automatically
    await browser.compareViewport("contact-us-page", {
      tolerance: VISUAL_TOLERANCE,
    });
  });
});
