import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import CartPage from "../../../page-objects/CartPage.js";
import CheckoutPage from "../../../page-objects/CheckoutPage.js";
import PaymentPage from "../../../page-objects/PaymentPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";
import {
  registerNewAccountFromCheckoutModal,
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

describe("Test Case 14: Place Order - Register while Checkout", function () {
  it("places an order after registering during checkout", async function () {
    await goHomeAcceptConsent();
    await HomePage.assertHomePageVisible();

    await HomePage.addBlueTopFromHome();
    await HomePage.clickViewCartInAddedModal();

    await CartPage.assertCartPageVisible();
    await CartPage.clickProceedToCheckout();
    await registerNewAccountFromCheckoutModal({
      name: NAME,
      email: EMAIL,
      password: PASSWORD,
    });

    await HomePage.assertHomePageVisiblePostLogin();
    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(NAME);

    await HomePage.cartMenuLink.click();
    await CartPage.assertCartPageVisible();
    await CartPage.clickProceedToCheckout();

    await CheckoutPage.assertAddressAndReviewVisible();
    await CheckoutPage.placeOrder("Please deliver ASAP.");

    await PaymentPage.assertOnPaymentPage();
    await PaymentPage.payAndConfirm({
      name: NAME,
      number: "4111111111111111",
      cvc: "123",
      expiryMonth: "12",
      expiryYear: "2026",
    });
    await PaymentPage.assertOrderSuccess();

    const deleted = await deleteIfLoggedIn();
    expect(deleted).toBe(true);

    await HomePage.assertHomePageVisible();
    await expect(HomePage.signupLoginLink).toBeDisplayed();
  });
});
