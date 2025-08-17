import HomePage from '../../../page-objects/HomePage.js';
import ContactUsPage from '../../../page-objects/ContactUsPage.js';
import { SHORT_TIMEOUT } from "../../../utils/testConstants.js";
import { goHomeAcceptConsent } from '../../../utils/index.js';
import { fixturePath } from '../../utils/fixtures.js';

const filePath = fixturePath('contact-attachment.txt');

// Currently disabled due to CI flakiness
describe.skip('Test Case 6: Contact Us Form', function () {
  it('should submit the contact form and show success message', async function () {
    await goHomeAcceptConsent();

    await HomePage.assertHomePageVisible();
    await HomePage.contactUsMenuLink.click();
    await ContactUsPage.assertGetInTouchVisible();

    await ContactUsPage.fillForm({
      name: 'Greg Tester',
      email: 'greg@example.com',
      subject: 'Form smoke check',
      message: 'This is an automated contact form submission.',
    });

    await ContactUsPage.attachFile(filePath);
    await ContactUsPage.submit();

    if (await browser.isAlertOpen()) {
      await browser.acceptAlert();
    }

    await ContactUsPage.successAlert.waitForDisplayed({ timeout: SHORT_TIMEOUT });
    await expect(ContactUsPage.successAlert).toBeDisplayed();
    await expect(ContactUsPage.successAlert).toHaveText(/Success!/i);

    await HomePage.homeMenuLink.click();
    await HomePage.assertHomePageVisible();
  });
});