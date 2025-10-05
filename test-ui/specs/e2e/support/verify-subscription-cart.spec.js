import HomePage from "../../../page-objects/HomePage.js";
import FooterPage from "../../../page-objects/FooterPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";

describe("Test Case 11: Verify Subscription in Cart page", function () {
  it("subscribes successfully from the cart page footer", async function () {
    await goHomeAcceptConsent();
    await HomePage.assertHomePageVisible();

    await HomePage.cartMenuLink.click();

    await FooterPage.scrollIntoView();
    await FooterPage.assertSubscriptionHeaderVisible();

    const email = `sub.${Date.now()}@example.com`;
    await FooterPage.subscribe(email);

    await FooterPage.assertSubscribedSuccess();
  });
});
