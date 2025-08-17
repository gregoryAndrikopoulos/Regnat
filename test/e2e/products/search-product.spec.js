import HomePage from '../../../page-objects/HomePage.js';
import ProductsPage from '../../../page-objects/ProductsPage.js';
import { goHomeAcceptConsent } from '../../../utils/index.js';

const term = 'sleeveless';
const expectedTitles = [
  'Sleeveless Dress',
  'Sleeveless Unicorn Patch Gown - Pink',
  'Sleeveless Unicorn Print Fit & Flare Net Dress - Multi'
];

describe('Test Case 9: Search Product', function () {
  it('should search for a product and show only the related results', async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.productsMenuLink.click();

    await ProductsPage.assertAllProductsVisible();
    await ProductsPage.searchFor(term);

    await ProductsPage.assertSearchedProductsVisible();
    await ProductsPage.assertAllResultsContainTerm(term);

    await ProductsPage.assertResultCountIs(3);
    await ProductsPage.assertResultsTitlesInclude(expectedTitles);
  });
});
