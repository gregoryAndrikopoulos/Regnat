import { expect, browser } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import SignupLoginPage from "../../../page-objects/SignupLoginPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";
import {
  seedUiAccount,
  loginOnly,
  cleanupSeededAccount,
} from "../../../../test-support/utils/accountHelpers.js";

let credentials;

before(async function () {
  credentials = await seedUiAccount();
});

describe("Test Case 4: Logout User", function () {
  it("should login and then logout, returning to login page", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();

    await loginOnly({
      email: credentials.email,
      password: credentials.password,
    });

    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(credentials.name);

    await expect(HomePage.logoutMenuLink).toBeDisplayed();
    await HomePage.logoutMenuLink.click();

    await expect(SignupLoginPage.loginHeader).toBeDisplayed();
    await expect(browser).toHaveUrl(/\/login/);
  });
});

after(async () => {
  await cleanupSeededAccount({
    email: credentials.email,
    password: credentials.password,
  });
});
