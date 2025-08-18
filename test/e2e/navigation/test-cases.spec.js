import HomePage from '../../../page-objects/HomePage.js';
import TestCasesPage from '../../../page-objects/TestCasesPage.js';
import { SHORT_TIMEOUT } from '../../../support/utils/testConstants.js';
import { goHomeAcceptConsent } from '../../../support/utils/index.js';

describe('Test Case 7: Verify Test Cases Page', function () {
  it('should navigate to Test Cases and verify page is visible', async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.testCasesMenuLink.waitForClickable({ timeout: SHORT_TIMEOUT });
    await HomePage.testCasesMenuLink.click();

    await TestCasesPage.assertLanded();
  });
});
