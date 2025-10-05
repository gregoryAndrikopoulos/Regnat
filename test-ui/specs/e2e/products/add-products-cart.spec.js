import HomePage from "../../../page-objects/HomePage.js";
import ProductsPage from "../../../page-objects/ProductsPage.js";
import CartPage from "../../../page-objects/CartPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";

describe("Test Case 12: Add Products in Cart", function () {
  it("adds first and second products, then verifies cart details", async function () {
    await goHomeAcceptConsent();
    await HomePage.assertHomePageVisible();

    await HomePage.productsMenuLink.click();

    await ProductsPage.addProductToCartByIndex(0);
    await ProductsPage.clickContinueShoppingInModal();

    await ProductsPage.addProductToCartByIndex(1);
    await ProductsPage.clickViewCartInModal();

    await CartPage.assertItemsCount(2);
    await CartPage.assertContainsNames(["Blue Top", "Men Tshirt"]);
    await CartPage.assertExpectedDetails([
      { name: "Blue Top", price: 500, qty: 1, total: 500 },
      { name: "Men Tshirt", price: 400, qty: 1, total: 400 },
    ]);
  });
});
