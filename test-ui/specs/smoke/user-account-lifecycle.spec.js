import { expect } from "@wdio/globals";
import HomePage from "../../page-objects/HomePage.js";
import SignupLoginPage from "../../page-objects/SignupLoginPage.js";
import { goHomeAcceptConsent } from "../../../test-support/utils/index.js";
import { loginOnly } from "../../../test-support/utils/accountHelpers.js";
import {
  TEST_USER_NAME,
  getCredentials,
} from "../../../test-support/utils/envCredentials.js";
import { BAD_CREDENTIALS } from "../../../test-support/utils/testConstants.js";

const { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD } =
  getCredentials(1);

before(function () {
  if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
    throw new Error(BAD_CREDENTIALS);
  }
});

describe("[@smoke] Account session (login → logout → login, real credentials)", function () {
  it("logs in with real credentials, logs out, then logs back in (no deletion)", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();

    await loginOnly({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(TEST_USER_NAME);

    await expect(HomePage.logoutMenuLink).toBeDisplayed();
    await HomePage.logoutMenuLink.click();

    await expect(SignupLoginPage.loginHeader).toBeDisplayed();
    await expect(SignupLoginPage.loginHeader).toHaveText(
      /Login to your account/i
    );
  });
});
