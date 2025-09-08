import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import SignupLoginPage from "../../../page-objects/SignupLoginPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";
import {
  cleanupSeededAccount,
  seedUiAccount,
} from "../../../../test-support/utils/accountHelpers.js";

let credentials;

before(async function () {
  credentials = await seedUiAccount();
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

    await SignupLoginPage.signupNameInput.setValue(credentials.name);
    await SignupLoginPage.signupEmailInput.setValue(credentials.email);
    await SignupLoginPage.signupButton.click();

    await expect(SignupLoginPage.signupEmailExistsError).toBeDisplayed();
    await expect(SignupLoginPage.signupEmailExistsError).toHaveText(
      "Email Address already exist!"
    );
  });
});

after(async () => {
  await cleanupSeededAccount({
    email: credentials.email,
    password: credentials.password,
  });
});
