import HomePage from "../../../page-objects/HomePage.js";
import ProductsPage from "../../../page-objects/ProductsPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";

describe("Test Case 18: View Category Products", function () {
  it("navigates via Women and Men category sub-links and verifies pages", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.assertCategoriesVisible();

    await HomePage.openWomenCategory();
    await HomePage.clickWomenSubcategory("Dress");
    await ProductsPage.assertCategoryHeader("Women", "Dress");

    await HomePage.openMenCategory();
    await HomePage.clickMenSubcategory("Tshirts");
    await ProductsPage.assertCategoryHeader("Men", "Tshirts");
  });
});
