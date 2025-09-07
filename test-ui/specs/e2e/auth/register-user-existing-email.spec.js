import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import SignupLoginPage from "../../../page-objects/SignupLoginPage.js";
import {
  TEST_USER_NAME,
  getCredentials,
} from "../../../support/utils/envCredentials.js";
import { goHomeAcceptConsent } from "../../../support/utils/index.js";
import { BAD_CREDENTIALS } from "../../../support/utils/testConstants.js";

// Pick the credential set explicitly for this spec (set 2)
const { email: TEST_USER_EMAIL } = getCredentials(2);

before(function () {
  if (!TEST_USER_EMAIL) throw new Error(BAD_CREDENTIALS);
});

describe("Test Case 5: Register User with existing email", function () {
  it("should show error when trying to sign up with an already registered email", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.signupLoginLink.click();

    await expect(SignupLoginPage.newUserSignupHeader).toBeDisplayed();
    await expect(SignupLoginPage.newUserSignupHeader).toHaveText(
      /New User Signup!/i
    );

    await SignupLoginPage.signupNameInput.setValue(TEST_USER_NAME);
    await SignupLoginPage.signupEmailInput.setValue(TEST_USER_EMAIL);
    await SignupLoginPage.signupButton.click();

    await expect(SignupLoginPage.signupEmailExistsError).toBeDisplayed();
    await expect(SignupLoginPage.signupEmailExistsError).toHaveText(
      "Email Address already exist!"
    );
  });
});
