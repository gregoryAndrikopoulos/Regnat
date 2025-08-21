import assert from "node:assert/strict";
import { $, expect } from "@wdio/globals";
import HomePage from "../../page-objects/HomePage.js";
import SignupLoginPage from "../../page-objects/SignupLoginPage.js";
import RegistrationPage from "../../page-objects/RegistrationPage.js";
import { goHomeAcceptConsent } from "../../support/utils/index.js";
import { buildAddress } from "../../support/utils/dataTemplates.js";
import { uniqueEmail } from "../../support/utils/index.js";
import { ensureAccountAbsent } from "../../support/utils/dataOps.js";

const PASSWORD = "TempPass!12345";
const NAME = "Smoke User";
const EMAIL = uniqueEmail("e2e", "example.com");

describe("[@smoke] Account lifecycle (register → logout → login → delete)", function () {
  it("registers with a randomized email, logs out/in, then deletes the account", async function () {
    await goHomeAcceptConsent();

    const onLogin = await SignupLoginPage.newUserSignupHeader
      .isExisting()
      .catch(() => false);
    if (!onLogin) {
      await HomePage.signupLoginLink.waitForDisplayed();
      await HomePage.signupLoginLink.click();
    }
    await expect(SignupLoginPage.newUserSignupHeader).toBeDisplayed();
    await expect(SignupLoginPage.newUserSignupHeader).toHaveText(
      /New User Signup!/i
    );

    await SignupLoginPage.signupNameInput.setValue(NAME);
    await SignupLoginPage.signupEmailInput.setValue(EMAIL);
    await SignupLoginPage.signupButton.click();

    await expect(RegistrationPage.formRoot).toBeDisplayed();
    await expect(RegistrationPage.enterAccountInfoHeader).toBeDisplayed();
    await expect(RegistrationPage.addressInfoHeader).toBeDisplayed();

    await RegistrationPage.selectTitle("Mr");
    await RegistrationPage.setPasswordAndDob({
      password: PASSWORD,
      day: "10",
      month: "May",
      year: "1990",
    });
    await RegistrationPage.setPreferenceToggles({
      newsletter: true,
      offers: true,
    });
    await RegistrationPage.fillAddressInfo(buildAddress());
    await RegistrationPage.submit();

    await expect(HomePage.statusHeader).toBeDisplayed();
    await expect(HomePage.statusHeader).toHaveText(/Account Created!/i);
    await expect(HomePage.continueButton).toBeDisplayed();
    await HomePage.continueButton.click();

    await expect(HomePage.loggedInBanner).toBeDisplayed();

    // Logout, then login with the just-created credentials
    let didClickLogout = false;
    try {
      if (
        HomePage.logoutMenuLink &&
        (await HomePage.logoutMenuLink.isDisplayed())
      ) {
        await HomePage.logoutMenuLink.click();
        didClickLogout = true;
      }
    } catch {
      // intentionally ignore: logout menu link may not exist; fallback to text link below
    }
    if (!didClickLogout) {
      const logoutLink = await $("=Logout");
      if (await logoutLink.isExisting()) {
        await logoutLink.click();
      }
    }

    await expect(SignupLoginPage.loginHeader).toBeDisplayed();
    await expect(SignupLoginPage.loginHeader).toHaveText(
      /Login to your account/i
    );

    await SignupLoginPage.loginEmailInput.setValue(EMAIL);
    await SignupLoginPage.loginPasswordInput.setValue(PASSWORD);
    await SignupLoginPage.loginButton.click();

    await expect(HomePage.loggedInBanner).toBeDisplayed();

    await expect(HomePage.deleteAccountMenuLink).toBeDisplayed();
    await HomePage.deleteAccountMenuLink.click();

    await expect(HomePage.statusHeader).toBeDisplayed();
    await expect(HomePage.statusHeader).toHaveText(/Account Deleted!/i);
    await expect(HomePage.continueButton).toBeDisplayed();
    await HomePage.continueButton.click();

    await expect(HomePage.signupLoginLink).toBeDisplayed();

    // Double-check server state with helper
    const postCheck = await ensureAccountAbsent({
      email: EMAIL,
      password: PASSWORD,
    });
    assert.ok(postCheck === "absent" || postCheck === "deleted");
  });
});
