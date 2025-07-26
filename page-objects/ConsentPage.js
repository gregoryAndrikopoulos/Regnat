import { $ } from "@wdio/globals";
import {clickElem} from "../utils/index.js";

class ConsentPage {
    /* Landing page */
    get consentButton() { return $('button[aria-label="Consent"]'); }
    get manageOptionsButton() { return $('button[aria-label="Manage options"]'); }
    get learnMoreToggle() { return $('div.fc-faq-icon'); }
    get vendorsListLink() { return $('a.fc-vendors-list-dialog'); }
    get closeVendorsListButton() { return $('button.fc-help-dialog-close-button'); }

    /* Main controls of Manage Options page */
    get backButton() { return $('button[aria-label="Back"]'); }
    get acceptAllButton() { return $('button[aria-label="Accept all"]'); }
    get confirmChoicesButton() { return $('button[aria-label="Confirm choices"]'); }

    /* TFC vendors */
    get tcfVendorsLink() { return $('div.fc-preference-divider button.fc-help-tip'); }
    get vendorPreferencesButton() { return $('button[aria-label="Vendor preferences"]'); }

    /* Consent sliders */
    getConsentSliderById(id) { return $(`input.fc-preference-consent.purpose[data-id="${id}"] + span.fc-slider-el`); }

    /* Legitimate Interest sliders */
    getLegitimateInterestSliderById(id) { return $(`input.fc-preference-legitimate-interest.purpose[data-id="${id}"] + span.fc-slider-el`); }

    /* View Details */
    getViewDetailsButtonByPurposeId(id) { return $(`a.fc-purpose-feature-more-info[data-purpose-id="${id}"]`); }
    getViewDetailsButtonByFeatureId(id) { return $(`a.fc-purpose-feature-more-info[data-feature-id="${id}"]`); }
    getViewDetailsButtonBySpecialPurposeId(id) { return $(`a.fc-purpose-feature-more-info[data-special-purpose-id="${id}"]`); }
    get closeDetailsButton() { return $('p.fc-help-dialog-close-button-label'); }

    /* ----------------------------------------------- ACTION METHODS ----------------------------------------------- */

    async acceptConsent() {
        await clickElem(await this.consentButton);
    }

    async clickTcfVendorsButton() {
        await clickElem(await this.manageOptionsButton);
        await clickElem(await this.tcfVendorsLink);
        await clickElem(await this.closeDetailsButton);
    }

    async clickAllSliders() {
        const consentIds = [1,2,3,4,5,6,7,8,9,10,11];
        const legitimateInterestIds = [2,7,8,9,10,11];

        await clickElem(await this.manageOptionsButton);

        for (const id of consentIds) {
            const slider = await this.getConsentSliderById(id);
            await clickElem(slider);
            await clickElem(slider);
        }
        for (const id of legitimateInterestIds) {
            const slider = await this.getLegitimateInterestSliderById(id);
            await clickElem(slider);
            await clickElem(slider);
        }
    }

    async clickAllViewDetails() {
        const purposeIds = [1,2,3,4,5,6,7,8,9,10,11];
        const featureIds = [1,2,3];
        const specialPurposeIds = [1,2,3];

        await clickElem(await this.manageOptionsButton);

        for (const id of purposeIds) {
            const button = await this.getViewDetailsButtonByPurposeId(id);
            await clickElem(button);
            await clickElem(await this.closeDetailsButton);
        }
        for (const id of featureIds) {
            const button = await this.getViewDetailsButtonByFeatureId(id);
            await clickElem(button);
            await clickElem(await this.closeDetailsButton);
        }
        for (const id of specialPurposeIds) {
            const button = await this.getViewDetailsButtonBySpecialPurposeId(id);
            await clickElem(button);
            await clickElem(await this.closeDetailsButton);
        }
    }

    async toggleFaq() {
        await clickElem(await this.learnMoreToggle);
    }

    async clickVendorsLink() {
        await clickElem(await this.vendorsListLink);
        await clickElem(await this.closeVendorsListButton);
    }
}

export default new ConsentPage();
