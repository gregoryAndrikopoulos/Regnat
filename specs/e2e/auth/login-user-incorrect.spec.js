import { expect } from "@wdio/globals";
import { faker } from "@faker-js/faker";
import HomePage from "../../../page-objects/HomePage.js";
import SignupLoginPage from "../../../page-objects/SignupLoginPage.js";
import { goHomeAcceptConsent } from "../../../support/utils/index.js";
import { fakePassword } from "../../../support/utils/fakers.js";

const INVALID_EMAIL = faker.internet.email({ provider: "example.com" });
const INVALID_PASSWORD = fakePassword();

describe("Test Case 3: Login User with incorrect email and password", function () {
  it("should show an error when logging in with incorrect credentials", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.signupLoginLink.click();

    await expect(SignupLoginPage.loginHeader).toBeDisplayed();
    await expect(SignupLoginPage.loginHeader).toHaveText(
      /Login to your account/i
    );

    await SignupLoginPage.loginEmailInput.setValue(INVALID_EMAIL);
    await SignupLoginPage.loginPasswordInput.setValue(INVALID_PASSWORD);
    await SignupLoginPage.loginButton.click();

    await expect(SignupLoginPage.loginErrorMessage).toBeDisplayed();
    await expect(SignupLoginPage.loginErrorMessage).toHaveText(
      /Your email or password is incorrect!/i
    );
  });
});
