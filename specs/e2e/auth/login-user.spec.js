import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import ConfirmationPage from "../../../page-objects/ConfirmationPage.js";
import {
  TEST_USER_NAME,
  getCredentials,
} from "../../../support/utils/envCredentials.js";
import { loginOrRegister } from "../../../support/utils/accountHelpers.js";
import { goHomeAcceptConsent } from "../../../support/utils/index.js";
import { BAD_CREDENTIALS } from "../../../support/utils/testConstants.js";

// Pick the credential set explicitly for this spec (set 2)
const { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD } =
  getCredentials(2);

before(function () {
  if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) throw new Error(BAD_CREDENTIALS);
});

describe("Test Case 2: Login User with correct email and password", function () {
  it("should verify that account exists and login user or create one and successfully login", async function () {
    await goHomeAcceptConsent();

    await loginOrRegister({
      name: TEST_USER_NAME,
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(TEST_USER_NAME);
    await expect(HomePage.logoutMenuLink).toBeDisplayed();
    await expect(HomePage.deleteAccountMenuLink).toBeDisplayed();
    await HomePage.assertHomePageVisiblePostLogin();
    await HomePage.deleteAccountMenuLink.click();

    await expect(ConfirmationPage.accountDeletedHeader).toBeDisplayed();
    await expect(ConfirmationPage.accountDeletedHeader).toHaveText(
      /Account Deleted!/i
    );

    await expect(HomePage.continueButton).toBeDisplayed();
    await HomePage.continueButton.click();

    await HomePage.assertHomePageVisible();
    await expect(HomePage.signupLoginLink).toBeDisplayed();
    await expect(HomePage.signupLoginLink).toHaveText(/Signup \/ Login/i);
  });
});
