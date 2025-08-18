import HomePage from "../../../page-objects/HomePage.js";
import SignupLoginPage from "../../../page-objects/SignupLoginPage.js";
import { goHomeAcceptConsent } from "../../../support/utils/index.js";

describe("Test Case 3: Login User with incorrect email and password", function () {
  it("should show an error when logging in with incorrect credentials", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.signupLoginLink.click();

    await expect(SignupLoginPage.loginHeader).toBeDisplayed();
    await expect(SignupLoginPage.loginHeader).toHaveText(
      /Login to your account/i
    );
    await SignupLoginPage.loginEmailInput.setValue("wrong_email@testemail.com");
    await SignupLoginPage.loginPasswordInput.setValue("WrongPassword123!");

    await SignupLoginPage.loginButton.click();
    await expect(SignupLoginPage.loginErrorMessage).toBeDisplayed();
    await expect(SignupLoginPage.loginErrorMessage).toHaveText(
      /Your email or password is incorrect!/i
    );
  });
});
