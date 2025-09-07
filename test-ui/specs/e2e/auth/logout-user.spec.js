import { expect, browser } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import SignupLoginPage from "../../../page-objects/SignupLoginPage.js";
import {
  TEST_USER_NAME,
  getCredentials,
} from "../../../support/utils/envCredentials.js";
import { loginOnly } from "../../../support/utils/accountHelpers.js";
import { BAD_CREDENTIALS } from "../../../support/utils/testConstants.js";
import { goHomeAcceptConsent } from "../../../support/utils/index.js";

// Pick the credential set explicitly for this spec (set 1)
const { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD } =
  getCredentials(1);

before(function () {
  if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) throw new Error(BAD_CREDENTIALS);
});

describe("Test Case 4: Logout User", function () {
  it("should login and then logout, returning to login page", async function () {
    await goHomeAcceptConsent();
    await HomePage.assertHomePageVisible();

    await loginOnly({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(TEST_USER_NAME);

    await expect(HomePage.logoutMenuLink).toBeDisplayed();
    await HomePage.logoutMenuLink.click();

    await expect(SignupLoginPage.loginHeader).toBeDisplayed();
    await expect(browser).toHaveUrl(/\/login/);
  });
});
