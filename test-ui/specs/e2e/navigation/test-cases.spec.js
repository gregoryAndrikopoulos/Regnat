import HomePage from "../../../page-objects/HomePage.js";
import TestCasesPage from "../../../page-objects/TestCasesPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";

describe("Test Case 7: Verify Test Cases Page", function () {
  it("should navigate to Test Cases and verify page is visible", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.testCasesMenuLink.waitForClickable();
    await HomePage.testCasesMenuLink.click();

    await TestCasesPage.assertLanded();
  });
});
