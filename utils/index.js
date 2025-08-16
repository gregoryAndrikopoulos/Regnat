import ConsentPage from '../page-objects/ConsentPage.js';
import { DEFAULT_TIMEOUT, SHORT_TIMEOUT, HOMEPAGE_LINK } from './testConstants.js';

async function clickElem(elem) {
    await elem.waitForExist({ timeout: DEFAULT_TIMEOUT });
    await elem.waitForDisplayed({ timeout: DEFAULT_TIMEOUT });
    await elem.click();
}

async function expectIsDisplayed(element, timeout = DEFAULT_TIMEOUT) {
    await element.waitForDisplayed({ timeout });
    await expect(element).toBeDisplayed();
}

async function expectIsNotDisplayed(element, timeout = SHORT_TIMEOUT) {
    await element.waitForDisplayed({ timeout, reverse: true });
    await expect(element).not.toBeDisplayed();
}

async function goHomeAcceptConsent() {
    await browser.url(HOMEPAGE_LINK);
    const consentVisible = await ConsentPage.consentButton.isDisplayed().catch(() => false);
    if (consentVisible) await ConsentPage.acceptConsent();
}

export {
    clickElem,
    expectIsDisplayed,
    expectIsNotDisplayed,
    goHomeAcceptConsent
};
