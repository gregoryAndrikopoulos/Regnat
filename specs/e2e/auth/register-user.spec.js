import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import SignupLoginPage from "../../../page-objects/SignupLoginPage.js";
import RegistrationPage from "../../../page-objects/RegistrationPage.js";
import {
  TEST_USER_NAME,
  getCredentials,
} from "../../../support/utils/envCredentials.js";
import { goHomeAcceptConsent } from "../../../support/utils/index.js";
import { buildAddress } from "../../../support/utils/dataTemplates.js";
import { BAD_CREDENTIALS } from "../../../support/utils/testConstants.js";

// Pick the credential set explicitly for this spec (set 1)
const { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD } =
  getCredentials(1);

before(function () {
  if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) throw new Error(BAD_CREDENTIALS);
});

describe("Test Case 1: Register User", function () {
  it("should create and delete an account", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.signupLoginLink.click();
    await expect(SignupLoginPage.newUserSignupHeader).toBeDisplayed();
    await expect(SignupLoginPage.newUserSignupHeader).toHaveText(
      /New User Signup!/i
    );

    await SignupLoginPage.signupEmailInput.setValue(TEST_USER_EMAIL);
    await SignupLoginPage.signupNameInput.setValue(TEST_USER_NAME);
    await SignupLoginPage.signupButton.click();

    await expect(RegistrationPage.formRoot).toBeDisplayed();
    await expect(RegistrationPage.enterAccountInfoHeader).toBeDisplayed();
    await expect(RegistrationPage.enterAccountInfoHeader).toHaveText(
      /Enter Account Information/i
    );
    await expect(RegistrationPage.addressInfoHeader).toBeDisplayed();
    await expect(RegistrationPage.addressInfoHeader).toHaveText(
      /Address Information/i
    );

    await expect(RegistrationPage.nameInput).toHaveValue(TEST_USER_NAME);
    await expect(RegistrationPage.emailInput).toHaveValue(TEST_USER_EMAIL);

    await RegistrationPage.selectTitle("Mr");
    await RegistrationPage.setPasswordAndDob({
      password: TEST_USER_PASSWORD,
      day: "24",
      month: "May",
      year: "1993",
    });
    await RegistrationPage.setPreferenceToggles({
      newsletter: true,
      offers: true,
    });
    await expect(RegistrationPage.newsletterCheckbox).toBeSelected();
    await expect(RegistrationPage.offersCheckbox).toBeSelected();
    await RegistrationPage.fillAddressInfo(buildAddress());
    await RegistrationPage.submit();

    await expect(HomePage.statusHeader).toBeDisplayed();
    await expect(HomePage.statusHeader).toHaveText(/Account Created!/i);
    await expect(HomePage.continueButton).toBeDisplayed();
    await HomePage.continueButton.click();

    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(TEST_USER_NAME);

    await expect(HomePage.deleteAccountMenuLink).toBeDisplayed();
    await HomePage.deleteAccountMenuLink.click();

    await expect(HomePage.statusHeader).toBeDisplayed();
    await expect(HomePage.statusHeader).toHaveText(/Account Deleted!/i);
    await expect(HomePage.continueButton).toBeDisplayed();
    await HomePage.continueButton.click();

    await expect(HomePage.signupLoginLink).toBeDisplayed();
    await expect(HomePage.signupLoginLink).toHaveText(/Signup \/ Login/i);
  });
});
