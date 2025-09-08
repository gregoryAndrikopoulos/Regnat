import { expect } from "@wdio/globals";
import ConsentPage from "../../test-ui/page-objects/ConsentPage.js";
import { HOMEPAGE_LINK } from "./testConstants.js";

async function clickElem(elem) {
  await elem.waitForExist();
  await elem.waitForDisplayed();
  await elem.click();
}

async function expectIsDisplayed(element) {
  await element.waitForDisplayed();
  await expect(element).toBeDisplayed();
}

async function expectIsNotDisplayed(element) {
  await element.waitForDisplayed({ reverse: true });
  await expect(element).not.toBeDisplayed();
}

async function goHomeAcceptConsent() {
  await browser.url(HOMEPAGE_LINK);
  const consentVisible = await ConsentPage.consentButton
    .isDisplayed()
    .catch(() => false);
  if (consentVisible) await ConsentPage.acceptConsent();
}

export {
  clickElem,
  expectIsDisplayed,
  expectIsNotDisplayed,
  goHomeAcceptConsent,
};
