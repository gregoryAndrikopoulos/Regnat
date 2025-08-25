import { expect } from "@wdio/globals";
import HomePage from "../../page-objects/HomePage.js";
import SignupLoginPage from "../../page-objects/SignupLoginPage.js";
import ConfirmationPage from "../../page-objects/ConfirmationPage.js";
import { goHomeAcceptConsent } from "./index.js";

async function tryLogin({ email, password }) {
  await goHomeAcceptConsent();

  // Navigate to login only if not already on it (site may redirect / -> /login)
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

  try {
    await HomePage.loggedInBanner.waitForDisplayed();
    return true;
  } catch {
    return false;
  }
}

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

  // After deletion we may land on /login or back to home; accept either
  const landed =
    (await SignupLoginPage.loginHeader.waitForDisplayed().then(
      () => true,
      () => false
    )) ||
    (await HomePage.signupLoginLink.waitForDisplayed().then(
      () => true,
      () => false
    ));

  if (!landed) {
    throw new Error(
      "Post-delete landing page not detected (neither Login nor Home)."
    );
  }
  return true;
}

async function ensureAccountAbsent({ email, password }) {
  const loggedIn = await tryLogin({ email, password });
  if (!loggedIn) return "absent";
  const deleted = await deleteIfLoggedIn();
  return deleted ? "deleted" : "absent";
}

export { ensureAccountAbsent };
