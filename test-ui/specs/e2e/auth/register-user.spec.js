import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import { goHomeAcceptConsent } from "../../../support/utils/index.js";
import { fakeEmail } from "../../../support/utils/fakers.js";
import {
  registerNewAccount,
  deleteIfLoggedIn,
} from "../../../support/utils/accountHelpers.js";
import { fakeName, fakePassword } from "../../../support/utils/fakers.js";

const TEST_USER_NAME = fakeName();
const TEST_USER_EMAIL = fakeEmail();
const TEST_USER_PASSWORD = fakePassword();

describe("Test Case 1: Register User", function () {
  it("should create and delete an account", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();

    await registerNewAccount({
      name: TEST_USER_NAME,
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    await HomePage.assertHomePageVisiblePostLogin();
    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(TEST_USER_NAME);

    const deleted = await deleteIfLoggedIn();
    expect(deleted).toBe(true);

    await HomePage.assertHomePageVisible();
    await expect(HomePage.signupLoginLink).toBeDisplayed();
  });
});
