import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";
import {
  registerNewAccount,
  deleteIfLoggedIn,
} from "../../../../test-support/utils/accountHelpers.js";
import {
  fakeName,
  fakeEmail,
  fakePassword,
} from "../../../../test-support/utils/fakers.js";

const NAME = fakeName();
const EMAIL = fakeEmail();
const PASSWORD = fakePassword();

describe("Test Case 1: Register User", function () {
  it("should create and delete an account", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();

    await registerNewAccount({ name: NAME, email: EMAIL, password: PASSWORD });

    await HomePage.assertHomePageVisiblePostLogin();
    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(NAME);

    const deleted = await deleteIfLoggedIn();
    expect(deleted).toBe(true);

    await HomePage.assertHomePageVisible();
    await expect(HomePage.signupLoginLink).toBeDisplayed();
  });
});
