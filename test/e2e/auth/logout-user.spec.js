import HomePage from '../../../page-objects/HomePage.js';
import SignupLoginPage from '../../../page-objects/SignupLoginPage.js';
import { TEST_USER_NAME, TEST_USER_EMAIL_3, TEST_USER_PASSWORD_3 } from '../../../support/utils/testConstants.js';
import { loginOrRegister } from '../../../support/utils/accountHelpers.js';
import { goHomeAcceptConsent } from "../../../support/utils/index.js";

describe('Test Case 4: Logout User', function () {
  it('should login and then logout, returning to login page', async function () {
    await goHomeAcceptConsent();

    await loginOrRegister({
      name: TEST_USER_NAME,
      email: TEST_USER_EMAIL_3,
      password: TEST_USER_PASSWORD_3,
    });

    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(TEST_USER_NAME);

    await expect(HomePage.logoutMenuLink).toBeDisplayed();
    await HomePage.logoutMenuLink.click();

    await expect(SignupLoginPage.loginHeader).toBeDisplayed();
    await expect(browser).toHaveUrl(/\/login/);
  });
});
