import { expect } from "@wdio/globals";
import HomePage from "../../test-ui/page-objects/HomePage.js";
import SignupLoginPage from "../../test-ui/page-objects/SignupLoginPage.js";
import RegistrationPage from "../../test-ui/page-objects/RegistrationPage.js";
import ConfirmationPage from "../../test-ui/page-objects/ConfirmationPage.js";
import {
  fakeName,
  fakePassword,
  fakeAddress,
  fakeDOB,
  fakeEmail,
} from "./fakers.js";
import { getCredentials } from "./envCredentials.js";
import { goHomeAcceptConsent } from "./index.js";
import { HOMEPAGE_LINK } from "./testConstants.js";

// unified credentials for all tests
function getTestCredentials(setNumber) {
  if (process.env.USE_REAL_CREDS === "true") {
    const { name, email, password } = getCredentials(setNumber);
    if (!email || !password) {
      throw new Error(
        "USE_REAL_CREDS=true but TEST_USER_EMAIL/TEST_USER_PASSWORD are missing"
      );
    }
    return { name: name || "Scheduled Smoke User", email, password };
  }
  return {
    name: fakeName(),
    email: fakeEmail("automation", "example.com"),
    password: fakePassword(),
  };
}

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

// one-call seeding for UI specs
async function seedUiAccount(setNumber) {
  const credentials = getTestCredentials(setNumber);

  await goHomeAcceptConsent();
  await HomePage.assertHomePageVisible();
  await registerNewAccount({
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
  });

  // hard reset for a clean test flow (grid-safe)
  try {
    await browser.reloadSession();
    await browser.pause(200);
  } catch {
    // rare race: try once more
    await browser.reloadSession();
    await browser.pause(200);
  }

  await browser.url(HOMEPAGE_LINK);
  return credentials;
}

async function cleanupSeededAccount({ email, password }) {
  try {
    await goHomeAcceptConsent();
    await HomePage.assertHomePageVisible();
    await loginOnly({ email, password });
    await deleteIfLoggedIn();
  } catch {
    // swallow errors so cleanup never fails the suite
  }
}

export {
  getTestCredentials,
  loginOnly,
  registerNewAccount,
  deleteIfLoggedIn,
  seedUiAccount,
  cleanupSeededAccount,
};
