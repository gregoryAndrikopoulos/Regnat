import HomePage from "../../../page-objects/HomePage.js";
import ProductsPage from "../../../page-objects/ProductsPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";

describe("Test Case 19: View & Cart Brand Products", function () {
  it("navigates between brand pages via the left sidebar and sees products", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.productsMenuLink.click();
    await ProductsPage.assertBrandsSidebarVisible();

    await ProductsPage.clickBrand("Polo");
    await ProductsPage.assertBrandHeader("Polo");
    await ProductsPage.assertGridHasProducts();

    await ProductsPage.clickBrand("H&M");
    await ProductsPage.assertBrandHeader("H&M");
    await ProductsPage.assertGridHasProducts();
  });
});
