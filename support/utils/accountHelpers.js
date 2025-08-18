import HomePage from '../../page-objects/HomePage.js';
import SignupLoginPage from '../../page-objects/SignupLoginPage.js';
import RegistrationPage from '../../page-objects/RegistrationPage.js';
import ConfirmationPage from '../../page-objects/ConfirmationPage.js';
import { LONG_TIMEOUT } from "./testConstants.js";
import { buildAddress } from './dataTemplates.js';

export async function loginOrRegister({ name, email, password }) {
  await HomePage.assertHomePageVisible();
  await HomePage.signupLoginLink.click();

  await expect(SignupLoginPage.loginHeader).toBeDisplayed();
  await expect(SignupLoginPage.loginHeader).toHaveText(/Login to your account/i);

  await SignupLoginPage.loginEmailInput.setValue(email);
  await SignupLoginPage.loginPasswordInput.setValue(password);
  await SignupLoginPage.loginButton.click();

  await browser.waitUntil(async () =>
      (await HomePage.loggedInBanner.isDisplayed().catch(() => false)) ||
      (await SignupLoginPage.loginError?.isDisplayed().catch(() => false)) ||
      (await SignupLoginPage.signupNameInput.isDisplayed().catch(() => false)),
    { timeout: LONG_TIMEOUT, interval: 200 }
  );

  const loggedIn = await HomePage.loggedInBanner.isDisplayed().catch(() => false);
  if (loggedIn) return;

  await SignupLoginPage.signupNameInput.setValue(name);
  await SignupLoginPage.signupEmailInput.setValue(email);
  await SignupLoginPage.signupButton.click();

  const emailExists = await SignupLoginPage.signupEmailExistsError?.isDisplayed().catch(() => false);
  if (emailExists) {
    throw new Error(`Cannot register: email "${email}" already exists and login failed. Check password or use a different test account.`);
  }

  await RegistrationPage.selectTitle('Mr');
  await RegistrationPage.setPasswordAndDob({ password, day: '10', month: 'May', year: '1990' });
  await RegistrationPage.setPreferenceToggles({ newsletter: true, offers: true });
  await RegistrationPage.fillAddressInfo(buildAddress());
  await RegistrationPage.submit();

  await expect(ConfirmationPage.accountCreatedHeader).toBeDisplayed();
  await expect(ConfirmationPage.accountCreatedHeader).toHaveText(/Account Created!/i);
  await ConfirmationPage.continueButton.click();

  await expect(HomePage.loggedInBanner).toBeDisplayed();
}
