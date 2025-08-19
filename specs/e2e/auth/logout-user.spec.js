import { expect, browser } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import SignupLoginPage from "../../../page-objects/SignupLoginPage.js";
import {
  TEST_USER_NAME,
  getCredentials,
} from "../../../support/utils/envCredentials.js";
import { loginOrRegister } from "../../../support/utils/accountHelpers.js";
import { goHomeAcceptConsent } from "../../../support/utils/index.js";
import { BAD_CREDENTIALS } from "../../../support/utils/testConstants.js";

// Pick the credential set explicitly for this spec (set 3)
const { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD } =
  getCredentials(3);

before(function () {
  if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) throw new Error(BAD_CREDENTIALS);
});

describe("Test Case 4: Logout User", function () {
  it("should login and then logout, returning to login page", async function () {
    await goHomeAcceptConsent();

    await loginOrRegister({
      name: TEST_USER_NAME,
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
