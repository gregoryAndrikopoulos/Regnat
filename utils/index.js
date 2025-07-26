import {DEFAULT_TIMEOUT, SHORT_TIMEOUT} from './testConstants.js';

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

export { clickElem, expectIsDisplayed, expectIsNotDisplayed };
