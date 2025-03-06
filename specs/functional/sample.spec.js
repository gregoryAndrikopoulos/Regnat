import {acceptConsent, clickAllSliders, clickAllViewDetails, clickTcfVendorsButton, toggleFaq, clickVendorsLink} from '../../utils/index.js';

describe('Sample Test', function() {
    it('should click the Consent button', async function() {
        await browser.url('https://www.automationexercise.com/');

        // await acceptConsent();

        await clickAllSliders();

        // await clickAllViewDetails();

        // await clickTcfVendorsButton();

        // await toggleFaq();

        // await clickVendorsLink();

    });
});
