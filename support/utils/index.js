import { expect } from "@wdio/globals";
import ConsentPage from "../../page-objects/ConsentPage.js";
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

function createTimestamp() {
  const now = new Date();
  const padLeft = (num, width = 2) => String(num).padStart(width, "0");

  const timestamp =
    `${now.getFullYear()}` +
    `${padLeft(now.getMonth() + 1)}` +
    `${padLeft(now.getDate())}` +
    `${padLeft(now.getHours())}` +
    `${padLeft(now.getMinutes())}` +
    `${padLeft(now.getSeconds())}`;

  const randomSuffix = Math.random().toString(36).slice(2, 6);
  return `${timestamp}${randomSuffix}`;
}

function uniqueEmail(prefix = "auto", domain = "example.com") {
  return `${prefix}+${createTimestamp()}@${domain}`;
}

export {
  clickElem,
  expectIsDisplayed,
  expectIsNotDisplayed,
  goHomeAcceptConsent,
  uniqueEmail,
};
