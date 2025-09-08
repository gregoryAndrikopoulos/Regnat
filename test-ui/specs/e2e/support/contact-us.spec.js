import { expect } from "@wdio/globals";
import HomePage from "../../../page-objects/HomePage.js";
import ContactUsPage from "../../../page-objects/ContactUsPage.js";
import { goHomeAcceptConsent } from "../../../../test-support/utils/index.js";
import { fixturePath } from "../../../../test-support/fixtures/fixtures.js";

const filePath = fixturePath("contact-attachment.txt");

describe("Test Case 6: Contact Us Form", function () {
  it("should submit the contact form and show success message", async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.contactUsMenuLink.click();
    await ContactUsPage.assertGetInTouchVisible();

    await ContactUsPage.fillForm({
      name: "Greg Tester",
      email: "greg@example.com",
      subject: "Form smoke check",
      message: "This is an automated contact form submission.",
    });

    await ContactUsPage.attachFile(filePath);
    await ContactUsPage.submit();

    if (await browser.isAlertOpen()) {
      await browser.acceptAlert();
    }

    await ContactUsPage.successAlert.waitForDisplayed();
    await expect(ContactUsPage.successAlert).toBeDisplayed();
    await expect(ContactUsPage.successAlert).toHaveText(/Success!/i);

    await HomePage.homeMenuLink.click();
    await HomePage.assertHomePageVisible();
  });
});
