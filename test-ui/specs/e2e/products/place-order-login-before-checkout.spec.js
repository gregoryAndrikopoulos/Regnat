import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import CartPage from "../../../page-objects/CartPage.js";
import CheckoutPage from "../../../page-objects/CheckoutPage.js";
import PaymentPage from "../../../page-objects/PaymentPage.js";
import { ORDER_NOTE } from "../../../../test-support/utils/testConstants.js";
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

describe("Test Case 16: Place Order: Login before Checkout", function () {
  it("logs in first, then places an order successfully", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await loginOnly({
      email: credentials.email,
      password: credentials.password,
    });

    await expect(HomePage.loggedInBanner).toBeDisplayed();
    await expect(HomePage.loggedInUsername).toHaveText(credentials.name);

    await HomePage.addBlueTopFromHome();
    await HomePage.clickContinueShoppingInAddedModal();
    await HomePage.cartMenuLink.click();

    await CartPage.assertCartPageVisible();
    await CartPage.clickProceedToCheckout();
    await CheckoutPage.assertAddressAndReviewVisible();

    await CheckoutPage.placeOrder(ORDER_NOTE);
    await PaymentPage.assertOnPaymentPage();
    await PaymentPage.payAndConfirm({
      name: credentials.name,
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

after(async function () {
  await cleanupSeededAccount({
    email: credentials.email,
    password: credentials.password,
  });
});
