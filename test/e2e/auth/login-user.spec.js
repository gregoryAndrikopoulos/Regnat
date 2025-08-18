import HomePage from '../../../page-objects/HomePage.js';
import ConfirmationPage from '../../../page-objects/ConfirmationPage.js';
import { TEST_USER_NAME, TEST_USER_EMAIL_2, TEST_USER_PASSWORD_2 } from '../../../support/utils/testConstants.js';
import { loginOrRegister } from '../../../support/utils/accountHelpers.js';
import { goHomeAcceptConsent } from "../../../support/utils/index.js";

describe('Test Case 2: Login User with correct email and password', function () {
  it('should verify that account exists and login user or create one and successfully login', async function () {
    await goHomeAcceptConsent();

    await loginOrRegister({
      name: TEST_USER_NAME,
      email: TEST_USER_EMAIL_2,
      password: TEST_USER_PASSWORD_2,
    });

    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(TEST_USER_NAME);
    await expect(HomePage.logoutMenuLink).toBeDisplayed();
    await expect(HomePage.deleteAccountMenuLink).toBeDisplayed();
    await HomePage.assertHomePageVisiblePostLogin();
    await HomePage.deleteAccountMenuLink.click();

    await expect(ConfirmationPage.accountDeletedHeader).toBeDisplayed();
    await expect(ConfirmationPage.accountDeletedHeader).toHaveText(/Account Deleted!/i);

    await expect(HomePage.continueButton).toBeDisplayed();
    await HomePage.continueButton.click();

    await HomePage.assertHomePageVisible();
    await expect(HomePage.signupLoginLink).toBeDisplayed();
    await expect(HomePage.signupLoginLink).toHaveText(/Signup \/ Login/i);
  });
});
