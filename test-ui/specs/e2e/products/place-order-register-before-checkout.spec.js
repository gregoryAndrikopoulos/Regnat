import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import CartPage from "../../../page-objects/CartPage.js";
import CheckoutPage from "../../../page-objects/CheckoutPage.js";
import PaymentPage from "../../../page-objects/PaymentPage.js";
import { ORDER_NOTE } from "../../../../test-support/utils/testConstants.js";
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

describe("Test Case 15: Place Order: Register before Checkout", function () {
  it("registers first, then places an order successfully", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();

    await registerNewAccount({ name: NAME, email: EMAIL, password: PASSWORD });

    await HomePage.assertHomePageVisiblePostLogin();
    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(NAME);

    await HomePage.addBlueTopFromHome();

    await HomePage.clickContinueShoppingInAddedModal();
    await HomePage.cartMenuLink.click();

    await CartPage.assertCartPageVisible();
    await CartPage.clickProceedToCheckout();

    await CheckoutPage.assertAddressAndReviewVisible();

    await CheckoutPage.placeOrder(ORDER_NOTE);

    await PaymentPage.assertOnPaymentPage();
    await PaymentPage.payAndConfirm({
      name: NAME,
      number: "4111111111111111",
      cvc: "123",
      expiryMonth: "12",
      expiryYear: "2026",
    });
    await PaymentPage.assertOrderSuccess();

    // Steps 17–18
    const deleted = await deleteIfLoggedIn();
    expect(deleted).toBe(true);

    await HomePage.assertHomePageVisible();
    await expect(HomePage.signupLoginLink).toBeDisplayed();
  });
});
