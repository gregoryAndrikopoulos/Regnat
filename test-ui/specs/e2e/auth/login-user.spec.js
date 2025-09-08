import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";
import {
  seedUiAccount,
  loginOnly,
  deleteIfLoggedIn,
  cleanupSeededAccount,
} from "../../../../test-support/utils/accountHelpers.js";

let credentials;

before(async function () {
  credentials = await seedUiAccount();
});

describe("Test Case 2: Login User with correct email and password", function () {
  it("should log in with valid credentials and delete the account", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await loginOnly({
      email: credentials.email,
      password: credentials.password,
    });

    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(credentials.name);

    const deleted = await deleteIfLoggedIn();
    expect(deleted).toBe(true);

    await HomePage.assertHomePageVisible();
    await expect(HomePage.signupLoginLink).toBeDisplayed();
    await expect(HomePage.signupLoginLink).toHaveText(/Signup \/ Login/i);
  });
});

after(async () => {
  await cleanupSeededAccount({
    email: credentials.email,
    password: credentials.password,
  });
});
