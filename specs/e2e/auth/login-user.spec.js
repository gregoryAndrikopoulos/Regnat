import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import {
  loginOnly,
  deleteIfLoggedIn,
  registerNewAccount,
} from "../../../support/utils/accountHelpers.js";
import {
  fakeName,
  fakeEmail,
  fakePassword,
} from "../../../support/utils/fakers.js";
import { goHomeAcceptConsent } from "../../../support/utils/index.js";

const TEST_USER_NAME = fakeName();
const TEST_USER_EMAIL = fakeEmail();
const TEST_USER_PASSWORD = fakePassword();

// create account so spec can commence
before(async function seedFakerAccount() {
  await goHomeAcceptConsent();
  await HomePage.assertHomePageVisible();
  await registerNewAccount({
    name: TEST_USER_NAME,
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  await browser.reloadSession(); // nukes the current browser session, starts fresh
});

describe("Test Case 2: Login User with correct email and password", function () {
  it("should log in with valid credentials and delete the account", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await loginOnly({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });

    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(TEST_USER_NAME);

    const deleted = await deleteIfLoggedIn();
    expect(deleted).toBe(true);

    await HomePage.assertHomePageVisible();
    await expect(HomePage.signupLoginLink).toBeDisplayed();
    await expect(HomePage.signupLoginLink).toHaveText(/Signup \/ Login/i);
  });
});
