import HomePage from "../../../page-objects/HomePage.js";
import FooterPage from "../../../page-objects/FooterPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";

describe("Test Case 10: Verify Subscription in home page", function () {
  it("subscribes successfully from the footer", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();

    await FooterPage.scrollIntoView();
    await FooterPage.assertSubscriptionHeaderVisible();

    const email = `sub.${Date.now()}@example.com`;
    await FooterPage.subscribe(email);
    await FooterPage.assertSubscribedSuccess();
  });
});
