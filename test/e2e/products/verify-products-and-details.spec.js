import HomePage from '../../../page-objects/HomePage.js';
import ProductsPage from '../../../page-objects/ProductsPage.js';
import ProductDetailsPage from '../../../page-objects/ProductDetailsPage.js';
import { goHomeAcceptConsent } from '../../../utils/index.js';

describe('Test Case 8: Verify All Products and product detail page', function () {
  it('should show All Products and display details for the first product', async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.productsMenuLink.click();

    await ProductsPage.assertAllProductsVisible();
    await ProductsPage.viewFirstProduct();

    await ProductDetailsPage.assertOnDetailsPage();
    await ProductDetailsPage.assertBasicDetailsVisible();
  });
});
