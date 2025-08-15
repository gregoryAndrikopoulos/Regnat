import HomePage from '../../../page-objects/HomePage.js';
import SignupLoginPage from '../../../page-objects/SignupLoginPage.js';
import RegistrationPage from '../../../page-objects/RegistrationPage.js';
import { TEST_USER_NAME, TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../../../utils/testConstants.js';
import { goHomeAcceptConsent } from '../../../utils/index.js';

describe('Test Case 1: Register User', function () {
  it('Should create and delete an account', async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.signupLoginLink.click();
    await expect(SignupLoginPage.newUserSignupHeader).toBeDisplayed();
    await expect(SignupLoginPage.newUserSignupHeader).toHaveText(/New User Signup!/i);

    await SignupLoginPage.signupEmailInput.setValue(TEST_USER_EMAIL);
    await SignupLoginPage.signupNameInput.setValue(TEST_USER_NAME);
    await SignupLoginPage.signupButton.click();

    await expect(RegistrationPage.formRoot).toBeDisplayed();
    await expect(RegistrationPage.enterAccountInfoHeader).toBeDisplayed();
    await expect(RegistrationPage.enterAccountInfoHeader).toHaveText(/Enter Account Information/i);
    await expect(RegistrationPage.addressInfoHeader).toBeDisplayed();
    await expect(RegistrationPage.addressInfoHeader).toHaveText(/Address Information/i);

    await expect(RegistrationPage.nameInput).toHaveValue(TEST_USER_NAME);
    await expect(RegistrationPage.emailInput).toHaveValue(TEST_USER_EMAIL);

    await RegistrationPage.selectTitle('Mr');
    await RegistrationPage.setPasswordAndDob({ password: TEST_USER_PASSWORD, day: '24', month: 'May', year: '1993' });
    await RegistrationPage.setPreferenceToggles({ newsletter: true, offers: true });
    await RegistrationPage.fillAddressInfo({
      firstName: 'Gregory',
      lastName: 'Tester',
      company: 'Best Company Ever',
      address: '123 Main St',
      address2: 'Unit 4',
      country: 'United States',
      state: 'IL',
      city: 'Chicago',
      zipcode: '60601',
      mobile: '+14155550123',
    });
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
