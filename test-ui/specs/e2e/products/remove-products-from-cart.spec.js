import HomePage from "../../../page-objects/HomePage.js";
import CartPage from "../../../page-objects/CartPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";

describe("Test Case 17: Remove Products From Cart", function () {
  it("adds a product, opens cart, removes it, and verifies empty cart", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.addBlueTopFromHome();

    await HomePage.clickContinueShoppingInAddedModal();
    await HomePage.cartMenuLink.click();

    await CartPage.assertCartPageVisible();
    await CartPage.removeFirstItem();
    await CartPage.assertCartEmpty();
  });
});
