import ConsentPage from '../../page-objects/ConsentPage.js';

describe('Sample Test', function() {
    it('should click the Consent button', async function() {
        await browser.url('https://www.automationexercise.com/');
        await ConsentPage.acceptConsent();
        // await ConsentPage.clickAllSliders();
        // await ConsentPage.clickAllViewDetails();
        // await ConsentPage.clickTcfVendorsButton();
        // await ConsentPage.toggleFaq();
        // await ConsentPage.clickVendorsLink();
    });
});
