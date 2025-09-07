import { expect } from "@wdio/globals";
import HomePage from "../../page-objects/HomePage.js";
import SignupLoginPage from "../../page-objects/SignupLoginPage.js";
import RegistrationPage from "../../page-objects/RegistrationPage.js";
import ConfirmationPage from "../../page-objects/ConfirmationPage.js";
import { fakeName, fakePassword, fakeAddress, fakeDOB } from "./fakers.js";

/**
 * Log in with provided credentials.
 * Throws with a helpful message if login fails.
 */
async function loginOnly({ email, password }) {
  const onLogin = await SignupLoginPage.loginHeader
    .isExisting()
    .catch(() => false);
  if (
    !onLogin &&
    (await HomePage.signupLoginLink.isExisting().catch(() => false))
  ) {
    await HomePage.signupLoginLink.click();
  }
  await expect(SignupLoginPage.loginHeader).toBeDisplayed();

  await SignupLoginPage.loginEmailInput.setValue(email);
  await SignupLoginPage.loginPasswordInput.setValue(password);
  await SignupLoginPage.loginButton.click();

  await HomePage.loggedInBanner.waitForDisplayed().catch(() => {
    throw new Error(
      `Login failed for "${email}". Ensure TEST_USER_EMAIL/TEST_USER_PASSWORD are valid.`
    );
  });
}

/**
 * Register a brand-new account.
 */
async function registerNewAccount({
  name = fakeName(),
  email,
  password = fakePassword(),
  title = "Mr",
  dob = fakeDOB(),
  address = fakeAddress(),
  toggles = { newsletter: true, offers: true },
} = {}) {
  const onLogin = await SignupLoginPage.loginHeader
    .isExisting()
    .catch(() => false);
  if (
    !onLogin &&
    (await HomePage.signupLoginLink.isExisting().catch(() => false))
  ) {
    await HomePage.signupLoginLink.click();
  }
  await expect(SignupLoginPage.newUserSignupHeader).toBeDisplayed();

  await SignupLoginPage.signupNameInput.setValue(name);
  await SignupLoginPage.signupEmailInput.setValue(email);
  await SignupLoginPage.signupButton.click();

  const emailExists = await SignupLoginPage.signupEmailExistsError
    ?.isDisplayed()
    .catch(() => false);
  if (emailExists) {
    throw new Error(`Registration failed: email "${email}" already exists.`);
  }

  await expect(RegistrationPage.formRoot).toBeDisplayed();
  await expect(RegistrationPage.enterAccountInfoHeader).toHaveText(
    /Enter Account Information/i
  );

  await RegistrationPage.selectTitle(title);
  await RegistrationPage.setPasswordAndDob({ password, ...dob });
  await RegistrationPage.setPreferenceToggles(toggles);
  await RegistrationPage.fillAddressInfo(address);
  await RegistrationPage.submit();

  await expect(ConfirmationPage.accountCreatedHeader).toBeDisplayed();
  await expect(ConfirmationPage.accountCreatedHeader).toHaveText(
    /Account Created!/i
  );
  await ConfirmationPage.continueButton.click();
  await expect(HomePage.loggedInBanner).toBeDisplayed();
}

/**
 * Delete the current logged-in account (no-op if link isn’t present).
 */
async function deleteIfLoggedIn() {
  const canDelete = await HomePage.deleteAccountMenuLink
    .waitForDisplayed()
    .then(
      () => true,
      () => false
    );
  if (!canDelete) return false;

  await HomePage.deleteAccountMenuLink.click();
  await ConfirmationPage.accountDeletedHeader.waitForDisplayed();
  await expect(ConfirmationPage.accountDeletedHeader).toHaveText(
    /Account Deleted!/i
  );

  await HomePage.continueButton.waitForClickable();
  await HomePage.continueButton.click();
  return true;
}

export { loginOnly, registerNewAccount, deleteIfLoggedIn };
