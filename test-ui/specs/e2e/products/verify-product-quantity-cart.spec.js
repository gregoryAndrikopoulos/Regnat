import HomePage from "../../../page-objects/HomePage.js";
import ProductDetailsPage from "../../../page-objects/ProductDetailsPage.js";
import CartPage from "../../../page-objects/CartPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";

describe("Test Case 13: Verify Product quantity in Cart", function () {
  it("sets quantity to 4 on details page and verifies it in cart", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.viewFirstProductFromHome();

    await ProductDetailsPage.assertOnDetailsPage();
    const name = await ProductDetailsPage.title.getText();

    await ProductDetailsPage.setQuantity(4);
    await ProductDetailsPage.clickAddToCart();
    await ProductDetailsPage.clickViewCartInModal();

    await CartPage.assertQuantityForName(name, 4);
  });
});
