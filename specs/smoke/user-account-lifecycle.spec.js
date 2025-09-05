import { expect } from "@wdio/globals";
import HomePage from "../../page-objects/HomePage.js";
import SignupLoginPage from "../../page-objects/SignupLoginPage.js";
import { goHomeAcceptConsent } from "../../support/utils/index.js";
import { fakeEmail } from "../../support/utils/fakers.js";
import {
  registerNewAccount,
  loginOnly,
  deleteIfLoggedIn,
} from "../../support/utils/accountHelpers.js";
import { fakeName, fakePassword } from "../../support/utils/fakers.js";

const NAME = fakeName();
const EMAIL = fakeEmail();
const PASSWORD = fakePassword();

describe("[@smoke] Account lifecycle (register → logout → login → delete)", function () {
  it("registers with a randomized email, logs out/in, then deletes the account", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();

    await registerNewAccount({ name: NAME, email: EMAIL, password: PASSWORD });
    await expect(HomePage.loggedInBanner).toBeDisplayed();

    // Logout via menu link
    await expect(HomePage.logoutMenuLink).toBeDisplayed();
    await HomePage.logoutMenuLink.click();

    // Back on login page
    await expect(SignupLoginPage.loginHeader).toBeDisplayed();
    await expect(SignupLoginPage.loginHeader).toHaveText(
      /Login to your account/i
    );

    // Login with the just-created credentials
    await loginOnly({ email: EMAIL, password: PASSWORD });
    await expect(HomePage.loggedInBanner).toBeDisplayed();

    // Delete the account and verify we're back to a clean state
    const deleted = await deleteIfLoggedIn();
    expect(deleted).toBe(true);

    await HomePage.assertHomePageVisible();
    await expect(HomePage.signupLoginLink).toBeDisplayed();
  });
});
