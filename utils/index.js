import { DEFAULT_TIMEOUT } from './testConstants.js';
import ConsentScreen from '../screen-objects/ConsentScreen.js';

async function clickElem(elem) {
    await elem.waitForExist({ timeout: DEFAULT_TIMEOUT });
    await elem.waitForDisplayed({ timeout: DEFAULT_TIMEOUT });
    await elem.click();
}

async function acceptConsent() {
    await clickElem(await ConsentScreen.consentButton);
}

async function clickTcfVendorsButton() {
    await clickElem(await ConsentScreen.manageOptionsButton);

    await clickElem(await ConsentScreen.tcfVendorsLink);
    await clickElem(await ConsentScreen.closeDetailsButton);
}

async function clickAllSliders() {
    const consentIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const legitimateInterestIds = [2, 7, 8, 9, 10, 11];

    await clickElem(await ConsentScreen.manageOptionsButton);

    for (const id of consentIds) {
        const slider = await ConsentScreen.getConsentSliderById(id);
        await clickElem(slider);
        await clickElem(slider);
    }

    for (const id of legitimateInterestIds) {
        const slider = await ConsentScreen.getLegitimateInterestSliderById(id);
        await clickElem(slider);
        await clickElem(slider);
    }
}

async function clickAllViewDetails() {
    const purposeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const featureIds = [1, 2, 3];
    const specialPurposeIds = [1, 2, 3];

    await clickElem(await ConsentScreen.manageOptionsButton);

    for (const id of purposeIds) {
        const button = await ConsentScreen.getViewDetailsButtonByPurposeId(id);
        await clickElem(button);
        await clickElem(await ConsentScreen.closeDetailsButton);
    }

    for (const id of featureIds) {
        const button = await ConsentScreen.getViewDetailsButtonByFeatureId(id);
        await clickElem(button);
        await clickElem(await ConsentScreen.closeDetailsButton);
    }

    for (const id of specialPurposeIds) {
        const button = await ConsentScreen.getViewDetailsButtonBySpecialPurposeId(id);
        await clickElem(button);
        await clickElem(await ConsentScreen.closeDetailsButton);
    }
}

async function toggleFaq() {
    await clickElem(await ConsentScreen.learnMoreToggle);
}

async function clickVendorsLink() {
    await clickElem(await ConsentScreen.vendorsListLink)
    await clickElem(await ConsentScreen.closeVendorsListButton);
}


export {
    clickElem,
    acceptConsent,
    clickTcfVendorsButton,
    clickAllSliders,
    clickAllViewDetails,
    toggleFaq,
    clickVendorsLink,
};
